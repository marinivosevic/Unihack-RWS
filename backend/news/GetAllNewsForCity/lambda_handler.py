import logging
from boto3.dynamodb.conditions import Attr

logger = logging.getLogger("GetAllNewsForCity")
logger.setLevel(logging.INFO)

from common.common import (
    _LAMBDA_NEWS_TABLE_RESOURCE,
    lambda_middleware,
    build_response,
    LambdaDynamoDBClass,
    get_news_pictures_as_base64
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

    news = dynamodb.table.scan(
        FilterExpression=Attr('city').eq(city)
    ).get('Items', [])

    logger.info(f'Found {len(news)} news for city {city}')

    pictures = {}

    for n in news:
        pictures[n['id']] = get_news_pictures_as_base64(n['id'])

    logger.info(f"Returning news and pictures: {pictures}")
    
    return build_response(
        200,
        {
            'message': 'Get all news for city',
            'news': news,
            'pictures': pictures
        }
    )
