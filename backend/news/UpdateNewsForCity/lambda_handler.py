import logging

logger = logging.getLogger("UpdateNewsForCity")
logger.setLevel(logging.INFO)

from common.common import (
    _LAMBDA_NEWS_TABLE_RESOURCE,
    lambda_middleware,
    build_response,
    LambdaDynamoDBClass
)

@lambda_middleware
def lambda_handler(event, context):
    # Getting city name
    city = event.get('pathParameters', {}).get('city')

    if not city:
        return build_response(
            400,
            {
                'message': 'City name is required'
            }
        )
    
    # Setting up table for users
    global _LAMBDA_NEWS_TABLE_RESOURCE
    dynamodb = LambdaDynamoDBClass(_LAMBDA_NEWS_TABLE_RESOURCE)
    
    return build_response(
        200,
        {
            'message': 'Update news for city'
        }
    )
