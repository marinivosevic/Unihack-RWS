import logging

logger = logging.getLogger("FetchSentTickets")
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
                    'message': 'We could not fetch your sent tickets. Please try again or contact support.'
                }
            )

        global _LAMBDA_TICKETS_TABLE_RESOURCE
        dynamodb = LambdaDynamoDBClass(_LAMBDA_TICKETS_TABLE_RESOURCE)

        return fetch_sent_tickets(dynamodb, email)

    except Exception as e:
        logger.error(f"Couldn't fetch sent tickets: {str(e)}")
        return build_response(
            400,
            {
                'message': 'We could not fetch your sent tickets. Please try again or contact support.'
            }
        )


def fetch_sent_tickets(dynamodb, sender):
    if not check_if_user_exists(dynamodb, sender):
        return build_response(
            400,
            {
                'message': 'User does not exist.'
            }
        )

    response = dynamodb.query(
        KeyConditionExpression='sender = :sender',
        ExpressionAttributeValues={
            ':sender': sender
        }
    )

    logger.info('Tickets fetched successfully.')

    return build_response(
        200,
        {
            'tickets': response.get('Items')
        }
    )


def check_if_user_exists(dynamodb, email):
    response = dynamodb.get_item(
        Key={
            'email': email
        }
    )

    return bool(response.get('Item'))
