import logging
import pandas as pd
from boto3.dynamodb.conditions import Attr

logger = logging.getLogger("GetAllSuperchargersInACity")
logger.setLevel(logging.INFO)

from common.common import (
    lambda_middleware,
    build_response,
    LambdaDynamoDBClass,
    _LAMBDA_SUPERCHARGERS_TABLE_RESOURCE
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
    
    # Create database instance
    global _LAMBDA_SUPERCHARGERS_TABLE_RESOURCE
    dynamodb = LambdaDynamoDBClass(_LAMBDA_SUPERCHARGERS_TABLE_RESOURCE)

    # Get all superchargers in a city
    db_superchargers = dynamodb.table.scan(
        FilterExpression=Attr('city').eq(city)
    ).get('Items', [])
    
    return get_all_superchargers_in_a_city(city, db_superchargers)

def get_all_superchargers_in_a_city(city, db_superchargers):
    try:
        csv = pd.read_csv('data/supercharge_locations.csv', encoding='ISO-8859-1')

        chargers = csv[csv['City'] == city]

        chargers['longitude'] = chargers['GPS'].apply(convert_to_longitude)
        chargers['latitude'] = chargers['GPS'].apply(convert_to_latitude)

        chargers = chargers.drop([
            'Street Address', 
            'City', 
            'State', 
            'Zip', 
            'Country', 
            'Stalls', 
            'kW', 
            'GPS', 
            'Elev(m)', 
            'Open Date', 
            'Unnamed: 11'
        ], axis=1)

        list_of_chargers = chargers.to_dict(orient='records')

        merged_list = []

        for charger in list_of_chargers:
            merged_list.append({
                'name': charger['Supercharger'],
                'latitude': charger['latitude'],
                'longitude': charger['longitude']
            })

        for charger in db_superchargers:
            merged_list.append({
                'name': charger['charger_name'],
                'latitude': charger['latitude'],
                'longitude': charger['longitude']
            })

        return build_response(
            200,
            {
                'message': 'Returning all superchargers in your area',
                'chargers': merged_list
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
    
def convert_to_longitude(gps):
    long_lat = gps.split(', ')
    long = float(long_lat[0])
    return long

def convert_to_latitude(gps):
    long_lat = gps.split(', ')
    lat = float(long_lat[1])
    return lat