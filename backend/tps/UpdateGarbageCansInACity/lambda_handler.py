import logging
import json
from boto3.dynamodb.types import Decimal

logger = logging.getLogger("UpdateGarbageCansInACity")
logger.setLevel(logging.INFO)

from common.common import (
    lambda_middleware,
    build_response,
    LambdaDynamoDBClass,
    _LAMBDA_GARBAGECANS_TABLE_RESOURCE
)

@lambda_middleware
def lambda_handler(event, context):
    # Getting charger id
    container_id = event.get('pathParameters', {}).get('container_id')

    # Getting body data
    body = json.loads(event.get('body'))

    if not container_id:
        return build_response(
            400,
            {
                'message': 'Container id is required'
            }
        )
    
    # Create database instance
    global _LAMBDA_GARBAGECANS_TABLE_RESOURCE
    dynamodb = LambdaDynamoDBClass(_LAMBDA_GARBAGECANS_TABLE_RESOURCE)
    
    X = body.get('X')
    Y = body.get('Y')

    update_container(dynamodb, container_id, X, Y)
    
    return build_response(
        200,
        {
            'message': 'Container data updated'
        }
    )

def update_container(dynamodb, container_id, X, Y):
    # Update user's public info
    update_expression = "SET "
    expression_attribute_values = {}

    if X is not None:
        update_expression += "X = :X, "
        expression_attribute_values[':X'] = Decimal(str(X))

    if Y is not None:
        update_expression += "Y = :Y, "
        expression_attribute_values[':Y'] = Decimal(str(Y))

    # Check if there is anything to update
    if expression_attribute_values:
        update_expression = update_expression.rstrip(', ')
        
        dynamodb.table.update_item(
            Key={
                'id': container_id
            },
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values
        )