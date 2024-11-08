import logging

logger = logging.getLogger("GetUsersPublicInfo")
logger.setLevel(logging.INFO)

from common.common import (
    _LAMBDA_USERS_TABLE_RESOURCE,
    get_profile_picture_as_base64,
    lambda_middleware,
    get_email_from_jwt_token,
    build_response,
    LambdaDynamoDBClass
)

@lambda_middleware
def lambda_handler(event, context):
    # Getting email from JWT token
    jwt_token = event.get('headers').get('x-access-token')
    email = get_email_from_jwt_token(jwt_token)
    
    # Setting up table for users
    global _LAMBDA_USERS_TABLE_RESOURCE
    dynamodb = LambdaDynamoDBClass(_LAMBDA_USERS_TABLE_RESOURCE)

    try:
        user = get_user_from_table(dynamodb, email)

        # Check if user exists
        if not user:
            return build_response(
                400,
                {
                    'message': 'We could not find your account. Please try again or contact support.'
                }
            )
        
        # Get user profile picture from S3
        user_profile_picture = get_profile_picture_as_base64(email)
    except Exception as e:
        logger.error(f"Couldn't get public info: {str(e)}")

        return build_response(
            500,
            {
                'message': "Couldn't get public info. Please try again or contact support."
            }
        )
    
    return build_response(
        200,
        {
            'message': 'User info fetched successfully!',
            'info': {
                'email': user.get('email'),
                'first_name': user.get('first_name'),
                'last_name': user.get('last_name'),
                'profile_picture': user_profile_picture
            }
        }
    )

def get_user_from_table(dynamodb, email):
    logger.info(f"Getting user with email: {email}")

    response = dynamodb.table.get_item(
        Key={
            'email': email
        }
    )
    
    return response.get('Item')