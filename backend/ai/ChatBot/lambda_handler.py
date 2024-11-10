from os import environ
import json
import logging
import requests
import boto3

logger = logging.getLogger("ChatBotLambda")
logger.setLevel(logging.INFO)

API_URL = "https://api.openai.com/v1/chat/completions"
STARTING_PROMPT = "You are a helpful assistant. Please answer the following question about city of Rijeka in Croatia. Don't mention you are ChatGPT or that your dataset is limited by time. Question: "

def get_secrets_from_aws_secrets_manager(secret_id, region_name):
    try:
        secrets_manager = boto3.client(
            service_name='secretsmanager', 
            region_name=region_name
        )

        secret_string = secrets_manager.get_secret_value(
            SecretId=secret_id
        )

        return json.loads(secret_string['SecretString'])
    except Exception as e:
        logger.error(f'Failed to retrieve secrets: {str(e)}')
        return None

def lambda_handler(event, context):
    try:
        logger.info('Received event: %s', event)

        # Extract the body from the event
        body = json.loads(event.get('body')) if 'body' in event else event

        # Retrieve OpenAI API Key from Secrets Manager
        secrets = get_secrets_from_aws_secrets_manager(
            environ.get('JWT_SECRET_NAME'),
            environ.get('SECRETS_REGION_NAME')
        )
        api_key = secrets['openai_api_key']

        if not api_key:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'Cannot find api key'
                })
            }

        # Extract the question from the body
        question = body.get('question', 'What is the capital of Croatia?')

        # Prepare the prompt for the API
        prompt = f"{STARTING_PROMPT} {question}"

        # Create the payload for the OpenAI API
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 500,
            "temperature": 0.7
        }

        # Set headers for the request
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

        # Make the API request
        response = requests.post(API_URL, headers=headers, json=payload)

        # Check for a successful response
        if response.status_code == 200:
            response_json = response.json()
            answer = response_json['choices'][0]['message']['content']
            logger.info("ChatGPT Response: %s", answer)

            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'answer': answer
                })
            }
        else:
            logger.error('Error from OpenAI API: %s', response.text)
            return {
                'statusCode': response.status_code,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': response.text
                })
            }

    except Exception as e:
        logger.error('Error occurred: %s', str(e))
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': str(e)
            })
        }
