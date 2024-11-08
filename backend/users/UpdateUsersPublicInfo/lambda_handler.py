import json
import logging

logger = logging.getLogger("UpdateUsersPublicInfo")
logger.setLevel(logging.INFO)

from common.common import (
    _LAMBDA_USERS_TABLE_RESOURCE,
    save_profile_picture,
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
    
    # Extracting body from event
    event = json.loads(event.get('body')) if 'body' in event else event

    new_first_name = event.get('first_name')
    new_last_name = event.get('last_name')
    new_profile_picture = event.get('profile_picture')
    
    logger.info('Checking if body request items are in valid type')
    
    is_valid = validate_body_items(new_first_name, new_last_name, new_profile_picture)
    if not is_valid:
        return build_response(
            400,
            {
                'message': 'Please provide correct types for request.'
            }
        )

    user = get_user_from_table(dynamodb, email)
    if not user:
        return build_response(
            400,
            {
                'message': 'We could not find your account. Please try again or contact support.'
            }
        )
    
    update_user(dynamodb, email, new_first_name, new_last_name)
    
    # Update profile picture if it exists
    if new_profile_picture:
        successful_upload = save_profile_picture(new_profile_picture, email)

        if not successful_upload:
            return build_response(
                400,
                {
                    'message': 'Couldn\'t update profile picture. Please try again or contact support.'
                }
            )
    
    return build_response(
        200,
        {
            'message': 'Your public info has been updated successfully.'
        }
    )

def validate_body_items(first_name, last_name, profile_picture):
    return ( 
        (first_name is None or isinstance(first_name, str)) and 
        (last_name is None or isinstance(last_name, str)) and 
        (profile_picture is None or isinstance(profile_picture, str))
    )

def get_user_from_table(dynamodb, email):
    logger.info(f"Getting user with email: {email}")

    response = dynamodb.table.get_item(
        Key={
            'email': email
        }
    )
    
    return response.get('Item')

def update_user(dynamodb, email, new_first_name, new_last_name):
    # Update user's public info
    update_expression = "SET "
    expression_attribute_values = {}

    if new_first_name is not None:
        update_expression += "first_name = :first_name, "
        expression_attribute_values[':first_name'] = new_first_name

    if new_last_name is not None:
        update_expression += "last_name = :last_name, "
        expression_attribute_values[':last_name'] = new_last_name

    # Check if there is anything to update
    if expression_attribute_values:
        update_expression = update_expression.rstrip(', ')
        
        dynamodb.table.update_item(
            Key={
                'email': email
            },
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values
        )