from boto3.dynamodb.conditions import Attr
import logging

logger = logging.getLogger("FetchReceivedTickets")
logger.setLevel(logging.INFO)

from common.common import (
    _LAMBDA_TICKETS_TABLE_RESOURCE,
    lambda_middleware,
    build_response,
    LambdaDynamoDBClass
)

@lambda_middleware
def lambda_handler(event, context):
    try:
        # Getting city name
        city = event.get('pathParameters', {}).get('city')

        if not city:
            return build_response(
                400,
                {
                    'message': 'City name is required'
                }
            )
        
        # Setting up table for tickets
        global _LAMBDA_TICKETS_TABLE_RESOURCE
        dynamodb = LambdaDynamoDBClass(_LAMBDA_TICKETS_TABLE_RESOURCE)

        # Getting tickets for the city
        tickets = dynamodb.table.scan(
            FilterExpression=Attr('city').eq(city)
        ).get('Items', [])

        return build_response(
            200,
            {
                'tickets': tickets
            }
        )

    except Exception as e:
        logger.error(f"Couldn't fetch received tickets: {str(e)}")
        
        return build_response(
            400,
            {
                'message': 'We could not fetch tickets sent to you. Please try again or contact support.'
            }
        )
