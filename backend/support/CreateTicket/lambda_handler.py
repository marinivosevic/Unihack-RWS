import logging
import uuid

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
            city = event['city']
            ticket = event['ticket']
            picture = event['picture']
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
    id = str(uuid.uuid4())
    
    add_ticket_to_the_table(dynamodb, {
        'id': id,
        'sender': sender,
        'city': city,
        'ticket': ticket,
        'picture': picture
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
