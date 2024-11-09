import logging
import pandas as pd

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
    
    return get_all_superchargers_in_a_city(city)

def get_all_superchargers_in_a_city(city):
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
        return build_response(
            200,
            {
                'message': 'Returning all superchargers in your area',
                'chargers': list_of_chargers
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