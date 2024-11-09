import logging

logger = logging.getLogger("DeleteSuperchargerInACity")
logger.setLevel(logging.INFO)

from common.common import (
    lambda_middleware,
    build_response,
    _LAMBDA_SUPERCHARGERS_TABLE_RESOURCE,
    LambdaDynamoDBClass
)

@lambda_middleware
def lambda_handler(event, context):
    # Getting charger_id
    charger_id = event.get('pathParameters', {}).get('charger_id')

    if not charger_id:
        return build_response(
            400,
            {
                'message': 'Charger id is required'
            }
        )
    
    # Create database instance
    global _LAMBDA_SUPERCHARGERS_TABLE_RESOURCE
    dynamodb = LambdaDynamoDBClass(_LAMBDA_SUPERCHARGERS_TABLE_RESOURCE)

    dynamodb.table.delete_item(
        Key={
            'id': charger_id
        }
    )
    
    return build_response(
        200,
        {
            'message': 'Deleting supercharger'
        }
    )
