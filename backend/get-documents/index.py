"""
Возвращает список документов пользователя по email.
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p72586878_court_order_cancella')


def handler(event: dict, context) -> dict:
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    user_email = body.get('user_email', '').strip().lower()

    if not user_email:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Email обязателен'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        f'''SELECT id, court_name, creditor_name, debt_amount, order_number, order_date, pdf_sent, created_at
            FROM {SCHEMA}.documents WHERE user_email=%s ORDER BY created_at DESC''',
        (user_email,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    docs = [
        {
            'id': str(r[0]),
            'court_name': r[1],
            'creditor_name': r[2],
            'debt_amount': r[3],
            'order_number': r[4],
            'order_date': r[5],
            'pdf_sent': r[6],
            'created_at': r[7].strftime('%d.%m.%Y') if r[7] else '',
        }
        for r in rows
    ]

    return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'documents': docs}, ensure_ascii=False)}
