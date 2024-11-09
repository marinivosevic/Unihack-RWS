import json
import logging
import requests

from common.common import build_response

# Configure logging
logger = logging.getLogger("FetchParkingData")
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info("Received request to fetch parking data.")
    
    api_url = "https://www.rijeka-plus.hr/wp-json/restAPI/v1/parkingAPI/"
    
    try:
        response = requests.get(api_url, timeout=10)  # Set a timeout for the request
        
        logger.info(f"External API responded with status code: {response.status_code}")
        
        if response.status_code != 200:
            logger.error(f"Failed to fetch data. Status code: {response.status_code}")
            return build_response(
                response.status_code,
                {"message": "Failed to fetch parking data from external service."}
            )
        
        parking_data = response.json()
        logger.info("Successfully fetched parking data from external API.")
        
        return build_response(
            200,
            parking_data
        )
    
    except requests.exceptions.Timeout:
        logger.error("Request to external API timed out.")
        return build_response(
            504,
            {"message": "The request to the parking data service timed out. Please try again later."}
        )
    
    except requests.exceptions.ConnectionError as e:
        logger.error(f"ConnectionError while fetching data: {str(e)}")
        return build_response(
            502,
            {"message": "Failed to connect to the parking data service."}
        )
    
    except requests.exceptions.HTTPError as e:
        logger.error(f"HTTPError while fetching data: {str(e)}")
        return build_response(
            500,
            {"message": "An HTTP error occurred while fetching parking data."}
        )
    
    except requests.exceptions.RequestException as e:
        logger.error(f"RequestException while fetching data: {str(e)}")
        return build_response(
            500,
            {"message": "An error occurred while fetching parking data."}
        )
    
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return build_response(
            500,
            {"message": "An unexpected error occurred."}
        )
