import numpy as np
import cv2
from s3_interaction import get_most_recent_images, save_image_to_s3


def mask_imaging_boundaries(img):
    """Produces two masked versions of the input image. One with
    the color yellow replaced with black, and one with green.

    Parameters
    ----------
    img: A NumPy array representing the image

    Returns
    -------
        The modified image as a NumPy array.
    """

    # Blur to better detect colors
    blurred = cv2.GaussianBlur(img, (7, 7), 0)

    # Use HSV to be more robust to lighting changes
    hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)

    # HSV boundaries for yellow (pretty broad)
    lower_yellow = np.array([10, 40, 40])
    upper_yellow = np.array([80, 255, 255])

    # Mask for yellow pixels
    mask = cv2.inRange(hsv, lower_yellow, upper_yellow)

    # Create one image with the tape blacked out for edge detection
    # and one where its greened out to count the number of pixels taken
    # up by the tape
    img_black = img.copy()
    img_green = img.copy()

    # Produce one
    img_black[mask > 0] = (0, 0, 0)
    img_green[mask > 0] = (0, 255, 0)

    return img_black, img_green


def detect_imaging_areas(img_black, img_green):
    """Detects the imaging areas in the inputted image which are
    rectangular contours defined by tape in the original image

    Parameters
    ----------
    img_black:
        The image with the tape blacked out
    img_black:
        The image with the tape greened out
    Returns
    -------
       imaging_area:
        The detected imaging area on the left
    green_pixels:
        The number of green pixels in the imaging area, which
        must be removed from consideration when detecting mycelium growth
    """
    img = img_black.copy()

    # Convert the image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply Adaptive Thresholding to handle varying lighting conditions
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)

    # Find contours
    contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    largest_area = 0
    x1 = 0
    y1 = 0
    w1 = 0
    h1 = 0
    for contour in contours:
        epsilon = 0.02 * cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, epsilon, True)
        x, y, w, h = cv2.boundingRect(approx)
        area = cv2.contourArea(contour)
        if 10000 < area < 100000 and area > largest_area:  # Filter to only images of the correct size
            x1,y1,w1,h1 = x, y, w, h
            largest_area = area

    # If a countour is found
    if x1:
        # Take the imaging area from the black image to make mycelium detection easier
        imaging_area = img_black[y1:y1+h1, x1:x1+w1]
        # Get the count of pixels the tape is taking up in this imaging are
        green_pixels = np.sum(np.all(img_green[y1:y1+h1, x1:x1+w1] == [0, 255, 0], axis=-1))
        return imaging_area, green_pixels
    else:
        return None, None

    

def detect_myc_growth(image, green_pixels):
    """Detects the growth of mycelium, which will show up as
    white pixels on the black rice grain spawn

    Parameters
    ----------
    image: 
        The image path in string format

    Returns
    -------
       imaging_area:
        The detected imaging area on the left
    green_pixels:
        The number of green pixels in the imaging area, which
        must be removed from consideration when detecting mycelium growth
    """
    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply a loose threshold to convert the grayscale image to black and white
    new_thresh = cv2.threshold(gray, 75, 255, cv2.THRESH_BINARY)[1]

    # Count the total number of pixels in the image
    total_area = image.shape[0] * image.shape[1]

    # Calculate the area excluding green pixels
    non_green_area = total_area - green_pixels

    # Calculate white pixel count in the non-green area
    # As this is likely myc
    white_pixels = cv2.countNonZero(new_thresh)
    
    # Create a copy of the original image to highlight the white pixels
    highlighted_image = image.copy()

    # Find the indices of the white pixels
    white_pixel_indices = np.where(new_thresh == 255)

    # Set the pixels corresponding to white pixels to red
    highlighted_image[white_pixel_indices] = [0, 0, 255]  # Red color

    return white_pixels, non_green_area, highlighted_image


def collate_images(image_list):
    """Collates a list of images into one image by resizing them to the average dimensions 
    and placing them horizontally.

    Args:
        image_list: A list of OpenCV images.

    Returns:
        The combined image.
    """
    
    # Calculate the average width and height
    total_width = sum(image.shape[1] for image in image_list)
    total_height = sum(image.shape[0] for image in image_list)
    avg_width = total_width // len(image_list)
    avg_height = total_height // len(image_list)

    # Resize all images to the average dimensions
    resized_images = [cv2.resize(image, (avg_width, avg_height)) for image in image_list]

    # Calculate the total canvas width
    total_canvas_width = avg_width * len(image_list)
    total_canvas_height = avg_height

    # Create a white canvas
    canvas = np.ones((total_canvas_height, total_canvas_width, 3), dtype=np.uint8) * 255

    # Place images next to each other horizontally
    x_offset = 0

    for resized_image in resized_images:
        canvas[:, x_offset:x_offset + avg_width] = resized_image
        x_offset += avg_width

    return canvas


def download_and_process_images():
    """Loops through the most recent batch of images and detects
    the pct of mycelium growing in each of them

    Returns
    -------
       imaging_area:
        The detected imaging area on the left
    green_pixels:
        The number of green pixels in the imaging area, which
        must be removed from consideration when detecting mycelium growth
    """
    for last_capture_date in get_most_recent_images():
        results = {'jar_1':{'pct_myc':0},'jar_2':{'pct_myc':0},'jar_3':{'pct_myc':0},'jar_4':{'pct_myc':0}}
        myc_pcts = [[[],[]],[[],[]],[[],[]],[[],[]]]
        base_path = f'/tmp/images/{last_capture_date}'
        imaging_areas = [[[],[]],[[],[]],[[],[]],[[],[]]]

        for camera in [1,2]:
            for side in range(8):
                image_path = base_path + f"_camera_{camera}_side_{side}.jpg"
                img = cv2.imread(image_path)
                height, width, _ = img.shape

                left_half = img[:, :(width // 2)]
                right_half = img[:, (width // 2):]

                left_half_black, left_half_green = mask_imaging_boundaries(left_half)
                right_half_black, right_half_green = mask_imaging_boundaries(right_half)

                left_imaging_area, left_green_pixels = detect_imaging_areas(left_half_black,left_half_green)
                right_imaging_area, right_green_pixels = detect_imaging_areas(right_half_black,right_half_green)

                if camera == 1:
                    #Left = Jar 3, Right = Jar 4
                    if left_imaging_area is not None:
                        #Jar 3
                        white_pixels, non_green_area,highlighted_image  = detect_myc_growth(left_imaging_area,left_green_pixels)
                        myc_pcts[2][0].append(white_pixels)
                        myc_pcts[2][1].append(non_green_area)
                        imaging_areas[2][0].append(left_imaging_area)
                        imaging_areas[2][1].append(highlighted_image)

                    else:
                        print('no left')
                        myc_pcts[2][0].append(0)
                        myc_pcts[2][1].append(0)
                        
                    if right_imaging_area is not None:
                        #Jar 4
                        white_pixels, non_green_area,highlighted_image = detect_myc_growth(right_imaging_area,right_green_pixels)
                        myc_pcts[3][0].append(white_pixels)
                        myc_pcts[3][1].append(non_green_area)
                        imaging_areas[3][0].append(right_imaging_area)
                        imaging_areas[3][1].append(highlighted_image)
                    else:
                        print('no right')
                        myc_pcts[3][0].append(0)
                        myc_pcts[3][1].append(0)

                if camera == 2:
                    #Left = Jar 1, Right = Jar 2
                    if left_imaging_area is not None:
                        #Jar 1
                        white_pixels, non_green_area,highlighted_image = detect_myc_growth(left_imaging_area,left_green_pixels)
                        myc_pcts[0][0].append(white_pixels)
                        myc_pcts[0][1].append(non_green_area)
                        imaging_areas[0][0].append(left_imaging_area)
                        imaging_areas[0][1].append(highlighted_image)

                    else:
                        print('no left')
                        myc_pcts[0][0].append(0)
                        myc_pcts[0][1].append(0)
                        
                    if right_imaging_area is not None:
                        #Jar 2
                        white_pixels, non_green_area,highlighted_image = detect_myc_growth(right_imaging_area,right_green_pixels)
                        myc_pcts[1][0].append(white_pixels)
                        myc_pcts[1][1].append(non_green_area)
                        imaging_areas[1][0].append(right_imaging_area)
                        imaging_areas[1][1].append(highlighted_image)

                    else:
                        print('no right')
                        myc_pcts[1][0].append(0)
                        myc_pcts[1][1].append(0)
        
        for idx,jar in enumerate(imaging_areas):
            if len(jar[0]) > 0:
                base_images = collate_images(jar[0])
                myc_processed_images = collate_images(jar[1])
                save_image_to_s3(base_images,f'base_image_jar_{idx+1}_{last_capture_date}')
                save_image_to_s3(myc_processed_images,f'processed_image__{idx+1}_{last_capture_date}')



        for idx,jar in enumerate(myc_pcts):
            results[f'jar_{idx+1}'] = 0
            if sum(myc_pcts[idx][1]) == 0:
                results[f'jar_{idx+1}'] = 0
            else:
                results[f'jar_{idx+1}'] = round((sum(myc_pcts[idx][0]) / sum(myc_pcts[idx][1])),2)

        yield last_capture_date,results
