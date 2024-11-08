import unittest
import json
import bcrypt
from base_auth_test import BaseAuthTest
import boto3
from moto import mock_aws
import time

import sys
sys.path.append('..')
from LoginUser.lambda_handler import lambda_handler

@mock_aws
class TestLoginLambdaFunction(BaseAuthTest):

    def setUp(self):
        super().setUp()
        self.dynamodb = boto3.resource('dynamodb', region_name='us-west-2')
        self.table = self.dynamodb.create_table(
            TableName='test_table',
            KeySchema=[
                {
                    'AttributeName': 'email',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'email',
                    'AttributeType': 'S'
                }
            ],
            BillingMode='PAY_PER_REQUEST'
        )
        self.table.meta.client.get_waiter('table_exists').wait(TableName='test_table')
        
        # Adding a sample user to the table for successful login tests
        password_hash = bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        self.table.put_item(Item={
            'email': 'test@mail.com',
            'password': password_hash,
            'refresh_token': ''
        })
        time.sleep(1)

    def test_missing_fields(self):
        """Test response when required fields are missing."""
        event = {
            "body": json.dumps({
                "email": "test@mail.com"
            })
        }
        response = lambda_handler(event, {})
        body = json.loads(response['body'])
        
        # self.assertEqual(response['statusCode'], 400)
        self.assertIn("'password' is missing, please check and try again", body['message'])

    def test_wrong_credentials(self):
        """Test login with incorrect password."""
        event = {
            "body": json.dumps({
                "email": "test@mail.com",
                "password": "wrongpassword"
            })
        }
        response = lambda_handler(event, {})
        self.assertEqual(response['statusCode'], 400)
        body = json.loads(response['body'])
        self.assertEqual(body['message'], 'Wrong email or password. Please try again.')

if __name__ == '__main__':
    unittest.main()
