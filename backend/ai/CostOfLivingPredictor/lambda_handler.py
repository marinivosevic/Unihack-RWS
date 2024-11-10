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


logger = logging.getLogger("CostOfLivingPredictor")
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        logger.info(f'Checking if every required attribute is found: {event}')

        body = json.loads(event.get('body')) if 'body' in event else event

        logger.info('Loading the model')

        xgb_reg = XGBRegressor(**best_xgb_parameters)

        logger.info('Preparing features')

        # Prepare the features array
        electricity_features = [[
            body.get('num_rooms'),
            body.get('num_people'),
            body.get('housearea'),
            body.get('is_ac'),
            body.get('is_tv'),
            body.get('is_flat'),
            body.get('ave_monthly_income'),
            body.get('num_children'),
            body.get('is_urban'),
        ]]

        rent_features = [[
            body.get('num_rooms'), # n_bedrooms
            body.get('year'), # TIME_PERIOD
            body.get('housearea'),
            body.get('is_flat'),
            determine_cities(body.get('city'))
        ]]

        electricity_prediction = get_electricity_bill_prediction(xgb_reg, electricity_features)
        rent_prediction = get_rent_bill_prediction(xgb_reg, rent_features)

        total_cost = (electricity_prediction.tolist()[0] + rent_prediction.tolist()[0])
        
        # 20% of the total cost for electricity and rent is considered as other costs for 90% of the towns by the data on the internet
        other_costs = (total_cost * 0.2)
        total_cost += other_costs

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'electricity_bill': electricity_prediction.tolist()[0],
                'rent_bill': rent_prediction.tolist()[0],
                'other_costs': other_costs,
                'potential_cost_of_living': total_cost
            })
        }
    except Exception as e:
        logger.info(f'Error happened while predicting {e}')
        
        return{
            "statusCode": 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                "message": f'Error happened while predicting {e}'
            })
        }

def get_electricity_bill_prediction(xgb_reg, features):
    xgb_reg.load_model('model.json')

    logger.info('Predicting electricity...')

    return xgb_reg.predict(features)

def get_rent_bill_prediction(xgb_reg, features):
    xgb_reg.load_model('rent_model.json')

    logger.info('Predicting rent...')

    return xgb_reg.predict(features)

def determine_cities(value):
    if str(value) == 'Rijeka':
        return 1
    if str(value) == 'Zagreb':
        return 2
    if str(value) == 'Timisoara':
        return 3