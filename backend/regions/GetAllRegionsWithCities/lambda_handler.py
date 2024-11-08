import logging

logger = logging.getLogger("GetAllRegionsWithCities")
logger.setLevel(logging.INFO)

from common.common import (
    _LAMBDA_REGIONS_TABLE_RESOURCE,
    build_response,
    LambdaDynamoDBClass
)

def lambda_handler(event, context):
    # Setting up table for users
    global _LAMBDA_REGIONS_TABLE_RESOURCE
    dynamodb = LambdaDynamoDBClass(_LAMBDA_REGIONS_TABLE_RESOURCE)

    regions = dynamodb.table.scan().get('Items', [])
    
    return build_response(
        200,
        {
            'message': "List of all regions returned successfully",
            'regions': regions
        }
    )
