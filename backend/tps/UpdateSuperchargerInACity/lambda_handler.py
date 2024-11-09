import logging
import json
from boto3.dynamodb.types import Decimal

logger = logging.getLogger("UpdateSuperchargerInACity")
logger.setLevel(logging.INFO)

from common.common import (
    lambda_middleware,
    build_response,
    LambdaDynamoDBClass,
    _LAMBDA_SUPERCHARGERS_TABLE_RESOURCE
)

@lambda_middleware
def lambda_handler(event, context):
    # Getting charger id
    charger_id = event.get('pathParameters', {}).get('charger_id')

    # Getting body data
    body = json.loads(event.get('body'))

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
    
    longitude = body.get('longitude')
    latitude = body.get('latitude')
    charger_name = body.get('charger_name')

    update_supercharger(dynamodb, charger_id, longitude, latitude, charger_name)
    
    return build_response(
        200,
        {
            'message': 'Supercharger data updated'
        }
    )

def update_supercharger(dynamodb, charger_id, longitude, latitude, charger_name):
    # Update user's public info
    update_expression = "SET "
    expression_attribute_values = {}

    if longitude is not None:
        update_expression += "longitude = :longitude, "
        expression_attribute_values[':longitude'] = Decimal(longitude)

    if latitude is not None:
        update_expression += "latitude = :latitude, "
        expression_attribute_values[':latitude'] = Decimal(latitude)

    if charger_name is not None:
        update_expression += "charger_name = :charger_name, "
        expression_attribute_values[':charger_name'] = charger_name

    # Check if there is anything to update
    if expression_attribute_values:
        update_expression = update_expression.rstrip(', ')
        
        dynamodb.table.update_item(
            Key={
                'id': charger_id
            },
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values
        )