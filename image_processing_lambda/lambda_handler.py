import json
from process_images import download_and_process_images
from s3_interaction import upload_results_to_s3

def lambda_handler(event, context):
    """
    try:
        
    except Exception as e:
        print(e)  # Ensure the error is logged
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    """
    for date, result in download_and_process_images():
            upload_results_to_s3(str(date),result)
    return {
        'statusCode': 200,
        'body': "Success"
    }