"""
Создаёт платёж в ЮКассе и сохраняет запись в БД.
Возвращает ссылку для перехода на страницу оплаты.
"""
import json
import os
import uuid
import psycopg2
from yookassa import Configuration, Payment


SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p72586878_court_order_cancella')

PLANS = {
    'basic':    {'name': 'Базовый',           'amount': 499,  'docs': 1,   'days': 30},
    'standard': {'name': 'Стандарт',          'amount': 1490, 'docs': 5,   'days': 90},
    'pro':      {'name': 'Профессиональный',  'amount': 3990, 'docs': 9999,'days': 365},
}


def handler(event: dict, context) -> dict:
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    plan_id    = body.get('plan_id', 'standard')
    user_email = body.get('email', '')
    return_url = body.get('return_url', 'https://poehali.dev')

    plan = PLANS.get(plan_id)
    if not plan:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Неверный тариф'})}

    Configuration.account_id = os.environ['YUKASSA_SHOP_ID']
    Configuration.secret_key  = os.environ['YUKASSA_SECRET_KEY']

    idempotency_key = str(uuid.uuid4())
    payment = Payment.create({
        'amount': {'value': str(plan['amount']) + '.00', 'currency': 'RUB'},
        'confirmation': {'type': 'redirect', 'return_url': return_url},
        'capture': True,
        'description': f'Тариф «{plan["name"]}» — ЮрДоки от Даббл',
        'receipt': {
            'customer': {'email': user_email} if user_email else {'phone': '70000000000'},
            'items': [{
                'description': f'Тариф «{plan["name"]}»',
                'quantity': '1',
                'amount': {'value': str(plan['amount']) + '.00', 'currency': 'RUB'},
                'vat_code': 1,
                'payment_subject': 'service',
                'payment_mode': 'full_prepayment',
            }]
        },
        'metadata': {'plan_id': plan_id, 'user_email': user_email},
    }, idempotency_key)

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur  = conn.cursor()
    cur.execute(
        f'INSERT INTO {SCHEMA}.payments (yukassa_payment_id, plan_id, amount, status, user_email) '
        f'VALUES (%s, %s, %s, %s, %s)',
        (payment.id, plan_id, plan['amount'], 'pending', user_email)
    )
    conn.commit()
    cur.close()
    conn.close()

    confirm_url = payment.confirmation.confirmation_url
    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'payment_id': payment.id, 'confirmation_url': confirm_url}),
    }
