from xgboost import XGBRegressor
import json
import logging

best_xgb_parameters = {
    'n_estimators': 67,
    'max_depth': 2,
    'learning_rate': 0.26,
    'min_child_weight': 4,
    'gamma': 0.18
}

logger = logging.getLogger("AvgRentPricePredictor")
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    try:
        logger.info(f'Checking if every required attribute is found: {event}')

        body = json.loads(event.get('body')) if 'body' in event else event

        logger.info('Loading the model')

        xgb_reg = XGBRegressor(**best_xgb_parameters)
        xgb_reg.load_model('model.json')

        logger.info('Preparing features')

        features = [[
            body.get('LAST UPDATE'),
            body.get('freq'),
            body.get('building'),
            body.get('n_bedrooms'),
            body.get('currency'),
            body.get('geo'),
            body.get('TIME_PERIOD'),
            body.get('value')
        ]]

        logger.info('Predicting...')

        prediction = xgb_reg.predict(features)

        logger.info("Prediction " + json.dumps({'prediction': prediction.tolist()}))

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'predictionResult': prediction.tolist()[0]
            })
        }

    except Exception as e:
        logger.info(f'Error happened while predicting {e}')

        return{
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'error': str(e)
            })
        }