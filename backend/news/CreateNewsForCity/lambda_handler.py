import logging
import json
import uuid
import datetime

logger = logging.getLogger("CreateNewsForCity")
logger.setLevel(logging.INFO)

from common.common import (
    _LAMBDA_NEWS_TABLE_RESOURCE,
    lambda_middleware,
    build_response,
    LambdaDynamoDBClass,
    save_news_pictures
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
    
    # Getting data for news
    body = json.loads(event.get('body'))

    try:
        title = body['title']
        description = body['description']
        pictures = body['pictures']
    except Exception as e:
        return build_response(
            400,
            {
                'message': f'{e} is required'
            }
        )
    
    # Setting up table for users
    global _LAMBDA_NEWS_TABLE_RESOURCE
    dynamodb = LambdaDynamoDBClass(_LAMBDA_NEWS_TABLE_RESOURCE)

    id = str(uuid.uuid4())
    # Creating news for city
    dynamodb.table.put_item(
        Item={
            'id': id,
            'city': city,
            'title': title,
            'published_at': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'description': description
        }
    )

    # Upload pictures to S3
    save_news_pictures(pictures, id)
    
    return build_response(
        200,
        {
            'message': f'Created news for city with id: {id}'
        }
    )
