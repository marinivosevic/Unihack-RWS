import json
import logging

logger = logging.getLogger("RegisterUser")
logger.setLevel(logging.INFO)

from common.common import (
    _LAMBDA_USERS_TABLE_RESOURCE,
    build_response,
    hash_password,
    LambdaDynamoDBClass
)

def lambda_handler(event, context):
    event = json.loads(event.get('body')) if 'body' in event else event

    logger.info(f'Checking if every required attribute is found: {event}')

    # Check if all required parameters are present
    required_params = ['email', 'password', 'first_name', 'last_name']
    missing_params = [param for param in required_params if not event.get(param)]

    if missing_params:
        missing_params_str = ', '.join(missing_params)
        return build_response(
            400,
            {
                'message': f'The following parameters are missing: {missing_params_str}'
            }
        )

    email = event['email']
    password = event['password']
    first_name = event['first_name']
    last_name = event['last_name']
    profile_picture_base64 = event.get('profile_picture')

    # Setting up table for users
    global _LAMBDA_USERS_TABLE_RESOURCE
    dynamodb = LambdaDynamoDBClass(_LAMBDA_USERS_TABLE_RESOURCE)

    return register_user(dynamodb, email, password, first_name, last_name, profile_picture_base64)


def register_user(dynamodb, email, password, first_name, last_name, profile_picture_base64):
    # Getting user by email
    is_user_found = check_if_user_exists(dynamodb, email)

    if is_user_found:
        return build_response(
            400,
            {
                'message': 'User with this email already exists. Do you want to login instead?'
            }
        )
    
    # Add the new user to the table
    hashed_password = hash_password(password)
    
    add_user_to_the_table(dynamodb, {
        'email': email,
        'password': hashed_password,
        'first_name': first_name,
        'last_name': last_name
    })

    logger.info('Saving profile picture.')

    return build_response(
        201,
        {
            'message': 'Registered successfully, welcome!'
        }
    )


def check_if_user_exists(dynamodb, email):
    logger.info('Checking if user exists.')

    response = dynamodb.table.get_item(
        Key={
            'email': email
        }
    )

    return response.get('Item')


def add_user_to_the_table(dynamodb, user_item):
    logger.info('Adding user to the table.')

    dynamodb.table.put_item(
        Item=user_item
    )
