import logging
from datetime import datetime
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

    for n in news:
        n['pictures'] = get_news_pictures_as_base64(n['id'])
    
    sorted_news = sort_news(news)

    logger.info(f"Returning news and pictures")
    
    return build_response(
        200,
        {
            'message': f'Getting all news for city: {city}',
            'news': sorted_news
        }
    )

def sort_news(news):
    logger.info("Sorting news.")
    sorted_news = sorted(news, key=lambda x: datetime.strptime(x.get('published_at', '2024-01-01 10:10:10'), "%Y-%m-%d %H:%M:%S"), reverse=True)

    logger.info(f"Sorted news: {sorted_news}")
    return sorted_news