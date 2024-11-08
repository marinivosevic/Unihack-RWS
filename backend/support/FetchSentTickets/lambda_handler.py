from boto3.dynamodb.conditions import Attr
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
        # Getting email from jwt token
        jwt_token = event.get('headers').get('x-access-token')
        email = get_email_from_jwt_token(jwt_token)

        if not email:
            return build_response(
                400,
                {
                    'message': 'We could not fetch your sent tickets. Please try again or contact support.'
                }
            )

        # Setting up table for tickets
        global _LAMBDA_TICKETS_TABLE_RESOURCE
        dynamodb = LambdaDynamoDBClass(_LAMBDA_TICKETS_TABLE_RESOURCE)

        # Getting tickets for the user
        tickets = dynamodb.table.scan(
            FilterExpression=Attr('sender').eq(email)
        ).get('Items', [])

        return build_response(
            200,
            {
                'tickets': tickets
            }
        )

    except Exception as e:
        logger.error(f"Couldn't fetch sent tickets: {str(e)}")
        
        return build_response(
            400,
            {
                'message': 'We could not fetch your sent tickets. Please try again or contact support.'
            }
        )
