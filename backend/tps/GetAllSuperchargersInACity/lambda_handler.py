import logging

logger = logging.getLogger("GetAllSuperchargersInACity")
logger.setLevel(logging.INFO)

from common.common import (
    lambda_middleware,
    build_response
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
    
    try:
        return build_response(
            200,
            {
                'message': 'Returning all superchargers in your area'
            }
        )
    except Exception as e:
        logger.info(f'Error happened while predicting {e}')
        
        return build_response(
            500,
            {
                'message': 'Error happened while getting superchargers'
            }
        )
