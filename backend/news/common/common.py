from boto3 import resource, client
from os import environ
import jwt
import logging
import base64
import boto3
import logging
import json

from aws_lambda_powertools.middleware_factory import lambda_handler_decorator

logger = logging.getLogger("NewsCommon")
logger.setLevel(logging.INFO)

_LAMBDA_NEWS_TABLE_RESOURCE = {
    "resource" : resource('dynamodb'),
    "table_name" : environ.get("NEWS_TABLE_NAME", "test_table")
}

_LAMBDA_S3_CLIENT_FOR_NEWS_PICTURES = {
    "client" : client('s3', region_name=environ.get("AWS_REGION", "eu-central-1")),
    "bucket_name" : environ.get("NEWS_PICTURES_BUCKET", "hakaton")
}

class LambdaS3Class:
    """
    AWS S3 Resource Class
    """
    def __init__(self, lambda_s3_resource):
        """
        Initialize an S3 Resource
        """
        self.client = lambda_s3_resource["client"]
        self.bucket_name = lambda_s3_resource["bucket_name"]
        
class LambdaDynamoDBClass:
    """
    AWS DynamoDB Resource Class
    """
    def __init__(self, lambda_dynamodb_resource):
        """
        Initialize a DynamoDB Resource
        """
        self.resource = lambda_dynamodb_resource["resource"]
        self.table_name = lambda_dynamodb_resource["table_name"]
        self.table = self.resource.Table(self.table_name)

def get_news_pictures_as_base64(news_id):
    # Setting up S3 client
    s3_class = LambdaS3Class(_LAMBDA_S3_CLIENT_FOR_NEWS_PICTURES)
    s3_client = s3_class.client
    bucket_name = s3_class.bucket_name

    # Define the prefix to specify the folder
    prefix = f"{news_id}/"
    
    # List all objects in the specified folder (prefix)
    images = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
    
    # Check if there are any images in the folder
    if 'Contents' in images:
        # Dictionary to store each image's base64 data with their file name
        images_base64 = []
        
        # Loop through each object in the folder
        for obj in images['Contents']:
            # Only process image files based on extension
            key = obj['Key']

            # Get the image object
            response = s3_client.get_object(Bucket=bucket_name, Key=key)
            
            # Read the image content and convert to base64
            image_data = response['Body'].read()
            converted_image = base64.b64encode(image_data).decode('utf-8')
            
            # Store the base64 image with its file name (or S3 key)
            images_base64.append(converted_image)
        
        return images_base64
    else:
        return f"No images found in folder {news_id}."
    
def delete_news_pictures(news_id):
    # Setting up S3 client
    s3_class = LambdaS3Class(_LAMBDA_S3_CLIENT_FOR_NEWS_PICTURES)
    s3_client = s3_class.client
    bucket_name = s3_class.bucket_name

    # Define the prefix (the folder path for the news_id)
    prefix = f"{news_id}/"
    
    # List all objects in the specified folder (prefix)
    objects_to_delete = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
    
    if 'Contents' in objects_to_delete:
        # Prepare a list of objects to delete
        delete_list = [{'Key': obj['Key']} for obj in objects_to_delete['Contents']]
        
        # Perform a bulk delete operation
        s3_client.delete_objects(
            Bucket=bucket_name,
            Delete={
                'Objects': delete_list,
                'Quiet': True
            }
        )
        
        return f"Successfully deleted all images in folder {news_id}."
    else:
        return f"No images found in folder {news_id}."

def save_news_pictures(pictures, id, should_convert_from_base64=True):
    # Setting up s3 client
    s3_class = LambdaS3Class(_LAMBDA_S3_CLIENT_FOR_NEWS_PICTURES)
    
    logger.info('Converting profile pictures to data.')
    pictures_data = [base64.b64decode(picture) if should_convert_from_base64 else picture for picture in pictures]

    i = 0
    for picture_data in pictures_data:
        is_saved = save_image_to_s3(
            s3_class.client, 
            s3_class.bucket_name,
            f"{id}/{i}.jpg",
            picture_data
        )

        if not is_saved:
            return False

        i += 1

@lambda_handler_decorator
def lambda_middleware(handler, event, context):
    event_headers = event.get('headers')
    logger.info(f"Received event in the middleware: {event_headers}")

    result = validate_jwt_token(event_headers)

    if result['statusCode'] != 200:
        logger.info("JWT token validation failed, returning to the client")

        return result

    logger.info("JWT token validation passed, continuing to the handler")

    try:
        authorization = event_headers.get('Authorization') or event_headers.get('authorization')
        
        if authorization:
            access_token = authorization.split(' ')[1] if ' ' in authorization else authorization
            event['headers']['x-access-token'] = access_token

            event['headers'].pop('Authorization', None)
            event['headers'].pop('authorization', None)
        
        return handler(event, context)
    except Exception as e:
        logger.error(f"Error in the handler: {e}")

        return build_response(
            500, 
            {
                "error": "Internal server error"
            }
        )

def validate_jwt_token(event_headers):
    authorization = event_headers.get('Authorization') or event_headers.get('authorization')
    
    access_token = authorization.split(' ')[1] if authorization and ' ' in authorization else authorization
    refresh_token = event_headers.get('x-refresh-token')

    logger.info(f"Validating JWT token: {access_token}")
    
    secrets = get_secrets_from_aws_secrets_manager(
            environ.get('JWT_SECRET_NAME'),
            environ.get('SECRETS_REGION_NAME')
    )

    try:
        jwt.decode(access_token.encode('utf-8'), secrets["jwt_secret"], algorithms=["HS256"])
        
        logger.info("JWT token verified successfully, continuing to the handler")
        
        return {
            'statusCode': 200
        }
    
    except jwt.ExpiredSignatureError:
        return validate_refresh_token(refresh_token, secrets["refresh_secret"], secrets["jwt_secret"])
    
    except Exception as e:
        logger.error(f"Error verifying JWT token: {e}")
        
        return build_response(
            401, 
            {
                "error": "Invalid token, please login again"
            }
        )

def validate_refresh_token(refresh_token, refresh_secret, jwt_secret):
    try:
        jwt.decode(refresh_token, refresh_secret, algorithms=["HS256"])
        
        logger.info("Refresh token verified successfully, creating new JWT token")

        user_email = get_email_from_jwt_token(refresh_token)
        new_jwt_token = jwt.encode({"email": user_email}, jwt_secret, algorithm="HS256")
        
        return build_response(
            200, 
            {
                "message": "JWT token verified successfully"
            }, 
            {
                'x-access-token': new_jwt_token, 
                'Content-Type': 'application/json'
            }
        )
    except Exception as e:
        logger.error(f"Error verifying refresh token: {e}")
        
        return build_response(
            401, 
            {
                "error": "Token expired"
            }
        )

def get_email_from_jwt_token(provided_jwt_token):
    secrets = get_secrets_from_aws_secrets_manager(
            environ.get('JWT_SECRET_NAME'),
            environ.get('SECRETS_REGION_NAME')
    )

    decoded_jwt = jwt.decode(provided_jwt_token.encode('utf-8'), secrets["jwt_secret"], algorithms=["HS256"])
    
    return decoded_jwt.get('email')

def get_secrets_from_aws_secrets_manager(secret_id, region_name):
    try:
        secrets_manager = boto3.client(
            service_name='secretsmanager', 
            region_name=region_name
        )

        secret_string = secrets_manager.get_secret_value(
            SecretId=secret_id
        )

        return json.loads(secret_string['SecretString'])
    except Exception as e:
        logger.error(f'Failed to retrieve secrets: {str(e)}')
        return None
    
def build_response(status_code, body, headers=None):
    return {
        'statusCode': status_code,
        headers if headers else 'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps(body)
    }

def get_image_from_s3(s3_client, bucket_name, image_key):
    logger.info(f"Getting image from S3: {image_key}")

    response = s3_client.get_object(
        Bucket=bucket_name,
        Key=image_key,
    )

    logger.info(f"Response for getting image: {response}")

    if response.get('Body'):
        return response['Body'].read(), True
    
    return None, False

def save_image_to_s3(s3_client, bucket_name, image_key, image_data):
    try:
        logger.info(f'Saving image to S3: {image_key}')

        s3_client.put_object(
            Bucket=bucket_name,
            Key=image_key,
            Body=image_data,
            ContentType='image/jpeg'
        )

        return True
    except Exception as e:
        logger.error(f'Unable to save image to S3: {str(e)}')
        return False

def delete_image_from_s3(s3_client, bucket_name, image_key):
    try:
        logger.info(f'Deleting image from S3: {image_key}')

        s3_client.delete_object(
            Bucket=bucket_name,
            Key=image_key
        )

        return True
    except Exception as e:
        logger.error(f'Unable to save image to S3: {str(e)}')
        return False
    