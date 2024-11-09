import logging
import uuid
import json
import base64
from datetime import datetime

logger = logging.getLogger("CreateTicket")
logger.setLevel(logging.INFO)

from common.common import (
    _LAMBDA_TICKETS_TABLE_RESOURCE,
    _LAMBDA_S3_CLIENT_FOR_TICKET_PICTURES,
    lambda_middleware,
    get_email_from_jwt_token,
    build_response,
    LambdaDynamoDBClass,
    LambdaS3Class,
    save_image_to_s3
)

@lambda_middleware
def lambda_handler(event, context):
    try:
        # Getting body from event
        body = json.loads(event['body'])

        # Getting email from jwt token
        jwt_token = event.get('headers').get('x-access-token')
        email = get_email_from_jwt_token(jwt_token)

        if not email:
            return build_response(
                400,
                {
                    'message': 'We could not create your ticket. Please try again or contact support.'
                }
            )

        # Setting up table for tickets
        global _LAMBDA_TICKETS_TABLE_RESOURCE
        dynamodb = LambdaDynamoDBClass(_LAMBDA_TICKETS_TABLE_RESOURCE)
        
        try:
            city = body['city']
            ticket = body['ticket']
            picture = body['picture']
        except Exception as e:
            return build_response(
                400,
                {
                    'message': f'{e} is missing'
                }
            )

        return create_ticket(dynamodb, email, city, ticket, picture)

    except Exception as e:
        logger.error(f"Couldn't create ticket: {str(e)}")

        return build_response(
            400,
            {
                'message': 'We could not create your ticket. Please try again or contact support.'
            }
        )


def create_ticket(dynamodb, sender, city, ticket, picture):
    logger.info('Adding ticket picture to s3.')

    decoded_picture = base64.b64decode(picture)

    global _LAMBDA_S3_CLIENT_FOR_TICKET_PICTURES
    s3 = LambdaS3Class(_LAMBDA_S3_CLIENT_FOR_TICKET_PICTURES)

    is_saved = save_image_to_s3(s3.client, s3.bucket_name, id, decoded_picture)

    if not is_saved:
        return build_response(
            400,
            {
                'message': 'We could not create your ticket. Please try again or contact support.'
            }
        )
    
    id = str(uuid.uuid4())
    
    add_ticket_to_the_table(dynamodb, {
        'id': id,
        'sender': sender,
        'city': city,
        'ticket': ticket,
        'published_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    })

    logger.info('Ticket created successfully.')

    return build_response(
        201,
        {
            'message': f'Ticket with id: {id} created successfully.'
        }
    )

def add_ticket_to_the_table(dynamodb, ticket_item):
    logger.info('Adding ticket to the table.')

    dynamodb.table.put_item(
        Item=ticket_item
    )
