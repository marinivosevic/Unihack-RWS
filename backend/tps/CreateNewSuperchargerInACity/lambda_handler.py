import logging
import json
import uuid

logger = logging.getLogger("CreateNewSuperchargerInACity")
logger.setLevel(logging.INFO)

from common.common import (
    lambda_middleware,
    build_response,
    _LAMBDA_SUPERCHARGERS_TABLE_RESOURCE,
    LambdaDynamoDBClass
)

@lambda_middleware
def lambda_handler(event, context):
    # Getting city name
    city = event.get('pathParameters', {}).get('city')

    # Getting body data
    body = json.loads(event.get('body'))

    if not city:
        return build_response(
            400,
            {
                'message': 'City name is required'
            }
        )
    
    try:
        longitude = body['longitude']
        latitude = body['latitude']
        charger_name = body['charger_name']
    except Exception as e:
        logger.info(f'longitude, latitude, charger_name are required')

    # Create database instance
    global _LAMBDA_SUPERCHARGERS_TABLE_RESOURCE
    dynamodb = LambdaDynamoDBClass(_LAMBDA_SUPERCHARGERS_TABLE_RESOURCE)

    charger_id = str(uuid.uuid4())

    dynamodb.table.put_item(
        Item={
            'id': charger_id,
            'city': city,
            'longitude': longitude,
            'latitude': latitude,
            'charger_name': charger_name
        }
    )
    
    return build_response(
        200,
        {
            'message': f'Creating new supercharger with id: {charger_id}'
        }
    )
