import boto3
import json
import datetime
import os
import cv2 
import json


def get_most_recent_images():
    """Retrieves the most recent images from S3 based on the specified format and returns the date."""

    s3 = boto3.client('s3')
    bucket_name = 'mycelium-image-storage'

    # Create a subfolder within /tmp/
    subfolder_name = "images"
    download_path = os.path.join("/tmp", subfolder_name)
    os.makedirs(download_path, exist_ok=True)  # Create the directory if it doesn't exist

    # Get a list of all objects in the bucket
    response = s3.list_objects_v2(Bucket=bucket_name)
    objects = response['Contents']

    # Extract dates from object keys
    image_dates = []
    for obj in objects:
        key = obj['Key']
        if key.startswith('2024-'):
            date_str = key.split('_')[0].split('-')
            image_dates.append(datetime.date(int(date_str[0]), int(date_str[1]), int(date_str[2])))

    # Find the most recent date
    for t_date in set(sorted(image_dates)):
        most_recent_date_str = t_date.strftime('%Y-%m-%d')
        """
        if image_dates:
            most_recent_date = max(image_dates)
            most_recent_date_str = most_recent_date.strftime('%Y-%m-%d')
        else:
            print("No images found in the bucket.")
            return None
        """
        # Download images for the most recent date
        downloaded_images = []
        for camera in (1, 2):
            for side in range(8):
                key = f"{most_recent_date_str}_camera_{camera}_side_{side}.jpg"
                try:
                    s3.download_file(bucket_name, key, f"/tmp/images/{key}")
                    downloaded_images.append(key)
                    print(f"Downloaded {key}")
                except Exception as e:
                    print(f"{key} was not found")

        yield most_recent_date_str


def upload_results_to_s3(key, data):
    """Appends colonization progress to the active grow session in user_demo.json in S3.

    Args:
        key (str): The date string to be used as the key for the colonization progress update.
        data (dict): The colonization progress data to append.
    """

    s3 = boto3.client('s3')
    bucket_name = 'user-info-with-history'
    file_name = 'user_demo.json'

    # Retrieve the existing JSON file from S3
    response = s3.get_object(Bucket=bucket_name, Key=file_name)
    file_content = response['Body'].read().decode('utf-8')
    user_data = json.loads(file_content)

    # Find the active grow session
    sessions = user_data.get('grow_sessions', {}).get('sessions', [])
    active_session = None
    for session in sessions:
        if session.get('active') == 'Y':
            active_session = session
            break

    if not active_session:
        raise ValueError("No active grow session found.")

    # Append new colonization progress to the active session
    if 'colonization_progress' not in active_session:
        active_session['colonization_progress'] = {}

    active_session['colonization_progress'][key] = data

    # Convert the updated data back to JSON
    updated_json_data = json.dumps(user_data)

    # Upload the updated JSON back to S3
    s3.put_object(
        Bucket=bucket_name,
        Key=file_name,
        Body=updated_json_data
    )

    print(f"Successfully updated colonization progress for date {key} and uploaded to S3.")



def save_image_to_s3(image, key):
    """Saves a OpenCV image to an S3 bucket.

    Args:
        image_path (str): The path to the image file.
        bucket_name (str): The name of the S3 bucket.
        key (str): The key (file name) for the uploaded object.
    """

    # Create an S3 client
    s3 = boto3.client('s3')
    bucket_name = 'image-pct-myc-visual'

    # Encode the image as JPEG
    _, encoded_image = cv2.imencode('.jpg', image)

    # Upload the image to S3
    s3.put_object(
        Bucket=bucket_name,
        Key=key+".jpg",
        Body=encoded_image.tobytes()
    )