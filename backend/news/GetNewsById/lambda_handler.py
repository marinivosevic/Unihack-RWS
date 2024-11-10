import logging

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
    news_id = event.get('pathParameters', {}).get('news_id')

    if not news_id:
        return build_response(
            400,
            {
                'message': 'News id is required'
            }
        )
    
    # Setting up table for users
    global _LAMBDA_NEWS_TABLE_RESOURCE
    dynamodb = LambdaDynamoDBClass(_LAMBDA_NEWS_TABLE_RESOURCE)

    news = dynamodb.table.get_item(
        Key={
            'id': news_id
        }
    ).get('Item')

    logger.info(f'Found {news}')

    news['pictures'] = get_news_pictures_as_base64(news['id'])

    logger.info(f"Returning news and it's pictures")
    
    return build_response(
        200,
        {
            'message': f'Getting news for id: {news_id}',
            'news': news
        }
    )
