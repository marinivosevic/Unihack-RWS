import logging

logger = logging.getLogger("CreateTicket")
logger.setLevel(logging.INFO)

from common.common import (
    _LAMBDA_TICKETS_TABLE_RESOURCE,
    lambda_middleware,
    get_email_from_jwt_token,
    build_response,
    LambdaDynamoDBClass
)


@lambda_middleware
def lambda_handler(event, context):
    try:
        jwt_token = event.get('headers').get('x-access-token')
        email = get_email_from_jwt_token(jwt_token)

        if not email:
            return build_response(
                400,
                {
                    'error_msg': 'Failed to extract email from JWT token.',
                    'message': 'We could not create your ticket. Please try again or contact support.'
                }
            )

        receiver = event.get('receiver')
        text = event.get('text')
        base64_image = event.get('base64_image', None)

        if not receiver or not text:
            return build_response(
                400,
                {
                    'message': 'The following parameters are missing: receiver, text'
                }
            )

        global _LAMBDA_TICKETS_TABLE_RESOURCE
        dynamodb = LambdaDynamoDBClass(_LAMBDA_TICKETS_TABLE_RESOURCE)

        return create_ticket(dynamodb, email, receiver, text, base64_image)

    except Exception as e:
        logger.error(f"Couldn't create ticket: {str(e)}")
        return build_response(
            400,
            {
                'message': 'We could not create your ticket. Please try again or contact support.'
            }
        )


def create_ticket(dynamodb, sender, receiver, text, base64_image):
    if not check_if_user_exists(dynamodb, sender):
        return build_response(
            400,
            {
                'message': 'Sender does not exist.'
            }
        )

    if not check_if_city_exists(dynamodb, receiver):
        return build_response(
            400,
            {
                'message': 'Receiver does not exist.'
            }
        )

    add_ticket_to_the_table(dynamodb, {
        'sender': sender,
        'receiver': receiver,
        'text': text,
        'base64_image': base64_image
    })

    logger.info('Ticket created successfully.')

    return build_response(
        201,
        {
            'message': 'Ticket created successfully.'
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


def check_if_city_exists(dynamodb, city):
    logger.info('Checking if city exists.')

    response = dynamodb.table.get_item(
        Key={
            'city': city
        }
    )

    return response.get('Item')


def add_ticket_to_the_table(dynamodb, ticket_item):
    logger.info('Adding ticket to the table.')

    dynamodb.table.put_item(
        Item=ticket_item
    )
