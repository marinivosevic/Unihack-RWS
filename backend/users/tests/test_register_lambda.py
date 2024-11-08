import unittest
from unittest.mock import patch
import json
import boto3
from moto import mock_aws

from base_auth_test import BaseAuthTest

import sys
sys.path.append('..')
from RegisterUser.lambda_handler import lambda_handler

@mock_aws
class TestRegisterLambdaFunction(BaseAuthTest):

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

    def test_registration_success(self):
        event = {
            "body": json.dumps({
                "email": "test@mail.com",
                "password": "password123",
                "first_name": "John",
                "last_name": "Travolta",
                "age": 30,
                "profile_picture_base64": "base64_encoded_image"
            })
        }
        response = lambda_handler(event, {})

        self.assertEqual(response['statusCode'], 201)
        body = json.loads(response['body'])
        self.assertEqual(body['message'], 'Registered successfully, welcome!')

    def test_missing_input(self):
        event = {
            "body": json.dumps({
                "email": "",
                "password": "password123",
                "first_name": "John",
                "last_name": "Travolta",
                "age": 30,
                "profile_picture_base64": "base64_encoded_image"
            })
        }
        response = lambda_handler(event, {})

        self.assertEqual(response['statusCode'], 400)
        body = json.loads(response['body'])
        print(body)
        self.assertEqual(body['message'], 'The following parameters are missing: email')

    def test_multiple_missing_input(self):
        event = {
            "body": json.dumps({
                "email": "",
                "password": "password123",
                "first_name": "",
                "last_name": "",
                "age": 30,
                "profile_picture_base64": "base64_encoded_image"
            })
        }
        response = lambda_handler(event, {})

        self.assertEqual(response['statusCode'], 400)
        body = json.loads(response['body'])
        print(body)
        self.assertEqual(body['message'], 'The following parameters are missing: email, first_name, last_name')

    def test_existing_user(self):
        # Pre-populate the table with an existing user
        self.mocked_dynamodb.table.put_item(Item={
            'email': 'test@mail.com',
            'password': 'password123',
            'first_name': 'John',
            'last_name': 'Travolta',
            'age': 30,
            "profile_picture_base64": "base64_encoded_image"
        })

        # Attempt to register the same user
        event = {
            "body": json.dumps({
                "email": "test@mail.com",
                "password": "password123",
                "first_name": "John",
                "last_name": "Travolta",
                "age": 30,
                "profile_picture_base64": "base64_encoded_image"
            })
        }
        response = lambda_handler(event, {})

        self.assertEqual(response['statusCode'], 400)
        body = json.loads(response['body'])
        print(body)
        self.assertEqual(body['message'], 'User with this email already exists. Do you want to login instead?')

    def test_invalid_age(self):
        print("test_invalid_age")
        event = {
            "body": json.dumps({
                "email": "test@mail.com",
                "password": "password123",
                "first_name": "John",
                "last_name": "Travolta",
                "age": "string",
                "profile_picture_base64": "base64_encoded_image"
            })
        }
        response = lambda_handler(event, {})

        self.assertEqual(response['statusCode'], 400)
        body = json.loads(response['body'])
        print(body)
        self.assertEqual(body['message'], 'The parameter age must be an integer.')


if __name__ == '__main__':
    unittest.main()
