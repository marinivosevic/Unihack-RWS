from boto3 import resource
from os import environ
import logging
import logging
import json

logger = logging.getLogger("RegionsCommon")
logger.setLevel(logging.INFO)

_LAMBDA_REGIONS_TABLE_RESOURCE = {
    "resource" : resource('dynamodb'),
    "table_name" : environ.get("REGIONS_TABLE_NAME", "test_table")
}

class LambdaDynamoDBClass:
    """
    AWS DynamoDB Resource Class
    """
    def __init__(self, lambda_dynamodb_resource):
        """
        Initialize a DynamoDB Resource
        """
        self.resource = lambda_dynamodb_resource["resource"]
        self.table_name = lambda_dynamodb_resource["table_name"]
        self.table = self.resource.Table(self.table_name)

def build_response(status_code, body, headers=None):
    return {
        'statusCode': status_code,
        headers if headers else 'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps(body)
    }
