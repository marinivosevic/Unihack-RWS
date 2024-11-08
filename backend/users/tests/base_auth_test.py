import unittest
import os
from moto import mock_aws
from boto3 import resource


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


@mock_aws
class BaseAuthTest(unittest.TestCase):
    def setUp(self):
        self.test_ddb_table_name = "test_table"
        os.environ["USERS_TABLE"] = self.test_ddb_table_name
        os.environ["SECRET_KEY"] = "secret"

        mocked_dynamodb_resource = {
            "resource": resource('dynamodb'),
            "table_name": self.test_ddb_table_name
        }
        mocked_dynamodb_resource['resource'].create_table(
            TableName=self.test_ddb_table_name,
            KeySchema=[{"AttributeName": "email", "KeyType": "HASH"}],
            AttributeDefinitions=[{"AttributeName": "email", "AttributeType": "S"}],
            BillingMode='PAY_PER_REQUEST'
        )

        self.mocked_dynamodb = LambdaDynamoDBClass(mocked_dynamodb_resource)
