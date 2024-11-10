from boto3.dynamodb.conditions import Attr
from datetime import datetime
import logging

logger = logging.getLogger("FetchReceivedTickets")
logger.setLevel(logging.INFO)

from common.common import (
    _LAMBDA_TICKETS_TABLE_RESOURCE,
    _LAMBDA_S3_CLIENT_FOR_TICKET_PICTURES,
    lambda_middleware,
    build_response,
    LambdaDynamoDBClass,
    LambdaS3Class,
    get_image_from_s3
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

        # Getting pictures for the tickets
        global _LAMBDA_S3_CLIENT_FOR_TICKET_PICTURES
        s3 = LambdaS3Class(_LAMBDA_S3_CLIENT_FOR_TICKET_PICTURES)

        for ticket in tickets:
            ticket['picture'], _ = get_image_from_s3(s3.client, s3.bucket_name, ticket['id'])

        sorted_tickets = sort_tickets(tickets)

        return build_response(
            200,
            {
                'tickets': sorted_tickets
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

def sort_tickets(tickets):
    logger.info("Sorting tickets.")
    sorted_tickets = sorted(tickets, key=lambda x: datetime.strptime(x.get('published_at', '2024-01-01 10:10:10'), "%Y-%m-%d %H:%M:%S"), reverse=True)

    logger.info(f"Sorted tickets: {sorted_tickets}")
    return sorted_tickets