"""
Обрабатывает вебхуки от ЮКассы: обновляет статус платежа и активирует подписку.
"""
import json
import os
import hashlib
import hmac
from datetime import datetime, timedelta
import psycopg2


SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p72586878_court_order_cancella')

PLANS = {
    'basic':    {'docs': 1,   'days': 30},
    'standard': {'docs': 5,   'days': 90},
    'pro':      {'docs': 9999,'days': 365},
}


def handler(event: dict, context) -> dict:
    cors = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'}
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    event_type = body.get('event', '')
    obj = body.get('object', {})

    if event_type not in ('payment.succeeded', 'payment.canceled'):
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

    payment_id = obj.get('id')
    status     = 'succeeded' if event_type == 'payment.succeeded' else 'canceled'
    metadata   = obj.get('metadata', {})
    plan_id    = metadata.get('plan_id', 'basic')
    user_email = metadata.get('user_email', '')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur  = conn.cursor()

    cur.execute(
        f'UPDATE {SCHEMA}.payments SET status=%s, updated_at=NOW() WHERE yukassa_payment_id=%s',
        (status, payment_id)
    )

    if status == 'succeeded' and user_email and plan_id in PLANS:
        plan = PLANS[plan_id]
        expires_at = datetime.utcnow() + timedelta(days=plan['days'])
        cur.execute(
            f'''INSERT INTO {SCHEMA}.subscriptions (user_email, plan_id, status, expires_at, documents_total)
                VALUES (%s, %s, 'active', %s, %s)
                ON CONFLICT DO NOTHING''',
            (user_email, plan_id, expires_at, plan['docs'])
        )

    conn.commit()
    cur.close()
    conn.close()

    return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}
