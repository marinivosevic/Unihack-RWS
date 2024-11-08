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
                    'message': 'We could not fetch tickets sent to you. Please try again or contact support.'
                }
            )

        global _LAMBDA_TICKETS_TABLE_RESOURCE
        dynamodb = LambdaDynamoDBClass(_LAMBDA_TICKETS_TABLE_RESOURCE)

        return fetch_received_tickets(dynamodb, email)

    except Exception as e:
        logger.error(f"Couldn't fetch received tickets: {str(e)}")
        return build_response(
            400,
            {
                'message': 'We could not fetch tickets sent to you. Please try again or contact support.'
            }
        )


def fetch_received_tickets(dynamodb, receiver):
    if not check_if_city_exists(dynamodb, receiver):
        return build_response(
            400,
            {
                'message': 'City does not exist.'
            }
        )

    response = dynamodb.query(
        IndexName='receiver-index',
        KeyConditionExpression='receiver = :receiver',
        ExpressionAttributeValues={
            ':receiver': receiver
        }
    )

    return build_response(
        200,
        {
            'tickets': response.get('Items')
        }
    )


def check_if_city_exists(dynamodb, city):
    response = dynamodb.query(
        IndexName='city-index',
        KeyConditionExpression='city = :city',
        ExpressionAttributeValues={
            ':city': city
        }
    )

    return bool(response.get('Items'))
