"""
Регистрация и вход пользователей.
POST /register — создать аккаунт
POST /login    — войти, получить токен сессии
POST /logout   — выйти
GET  /me       — получить данные текущего пользователя
"""
import json
import os
import hashlib
import hmac
import secrets
import psycopg2
from datetime import datetime

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p72586878_court_order_cancella')
SECRET = os.environ.get('YUKASSA_SECRET_KEY', 'fallback-secret')[:32]


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_password(password: str) -> str:
    return hashlib.sha256((password + SECRET).encode()).hexdigest()


def make_token() -> str:
    return secrets.token_hex(32)


def cors():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
    }


def resp(status: int, data: dict, extra_headers: dict = None) -> dict:
    headers = {**cors(), 'Content-Type': 'application/json'}
    if extra_headers:
        headers.update(extra_headers)
    return {'statusCode': status, 'headers': headers, 'body': json.dumps(data, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors(), 'body': ''}

    method = event.get('httpMethod', 'GET')
    body = json.loads(event.get('body') or '{}')
    action = body.get('action', '')

    conn = get_conn()
    cur = conn.cursor()

    try:
        # ── Регистрация ────────────────────────────────────────────────────
        if action == 'register' and method == 'POST':
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''
            full_name = (body.get('full_name') or '').strip()
            pdp_agreed = body.get('pdp_agreed', False)

            if not email or not password:
                return resp(400, {'error': 'Email и пароль обязательны'})
            if len(password) < 6:
                return resp(400, {'error': 'Пароль должен быть не менее 6 символов'})
            if not pdp_agreed:
                return resp(400, {'error': 'Необходимо согласие на обработку персональных данных'})

            cur.execute(f'SELECT id FROM {SCHEMA}.users WHERE email=%s', (email,))
            if cur.fetchone():
                return resp(409, {'error': 'Пользователь с таким email уже существует'})

            pwd_hash = hash_password(password)
            token = make_token()
            cur.execute(
                f'''INSERT INTO {SCHEMA}.users (email, password_hash, full_name, pdp_agreed, pdp_agreed_at)
                    VALUES (%s, %s, %s, %s, NOW()) RETURNING id''',
                (email, pwd_hash, full_name, True)
            )
            user_id = cur.fetchone()[0]
            conn.commit()
            return resp(200, {'ok': True, 'token': token, 'user': {'id': str(user_id), 'email': email, 'full_name': full_name}})

        # ── Вход ───────────────────────────────────────────────────────────
        if action == 'login' and method == 'POST':
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''

            if not email or not password:
                return resp(400, {'error': 'Email и пароль обязательны'})

            pwd_hash = hash_password(password)
            cur.execute(
                f'SELECT id, email, full_name FROM {SCHEMA}.users WHERE email=%s AND password_hash=%s',
                (email, pwd_hash)
            )
            row = cur.fetchone()
            if not row:
                return resp(401, {'error': 'Неверный email или пароль'})

            cur.execute(f'UPDATE {SCHEMA}.users SET last_login_at=NOW() WHERE id=%s', (row[0],))
            conn.commit()
            token = make_token()
            return resp(200, {'ok': True, 'token': token, 'user': {'id': str(row[0]), 'email': row[1], 'full_name': row[2] or ''}})

        return resp(400, {'error': 'Неизвестное действие'})

    finally:
        cur.close()
        conn.close()