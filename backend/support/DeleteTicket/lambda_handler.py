import logging

logger = logging.getLogger("DeleteTicket")
logger.setLevel(logging.INFO)

from common.common import (
    _LAMBDA_TICKETS_TABLE_RESOURCE,
    _LAMBDA_S3_CLIENT_FOR_TICKET_PICTURES,
    lambda_middleware,
    build_response,
    LambdaDynamoDBClass,
    LambdaS3Class,
    delete_image_from_s3
)

@lambda_middleware
def lambda_handler(event, context):
    try:
        # Getting city name
        ticket_id = event.get('pathParameters', {}).get('ticket_id')

        logger.info(f'Deleting ticket with id: {ticket_id}')

        if not ticket_id:
            return build_response(
                400,
                {
                    'message': 'Please provide ticket id'
                }
            )

        # Setting up table for tickets
        global _LAMBDA_TICKETS_TABLE_RESOURCE
        dynamodb = LambdaDynamoDBClass(_LAMBDA_TICKETS_TABLE_RESOURCE)

        # Deleting ticket from the table
        dynamodb.table.delete_item(
            Key={
                'id': ticket_id
            }
        )

        logger.info(f'Ticket with id: {ticket_id} deleted successfully.')

        # Deleting ticket picture from s3
        global _LAMBDA_S3_CLIENT_FOR_TICKET_PICTURES
        s3 = LambdaS3Class(_LAMBDA_S3_CLIENT_FOR_TICKET_PICTURES)

        delete_image_from_s3(s3.client, s3.bucket_name, ticket_id)

        logger.info(f'Ticket picture with id: {ticket_id} deleted successfully.')

        return build_response(
            200,
            {
                'message': f'Ticket with id: {ticket_id} deleted successfully.'
            }
        )

    except Exception as e:
        logger.error(f"Couldn't delete ticket: {str(e)}")

        return build_response(
            400,
            {
                'message': 'We could not delete your ticket. Please try again or contact support.'
            }
        )
