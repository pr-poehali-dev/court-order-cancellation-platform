import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет сообщение из контактной формы на почту поддержки"""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    email = body.get('email', '').strip()
    subject = body.get('subject', 'Другое').strip()
    message = body.get('message', '').strip()

    if not name or not email or not message:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Заполните все обязательные поля'})}

    smtp_user = os.environ['SMTP_USER']
    smtp_pass = os.environ['SMTP_PASS']
    to_email = os.environ['SMTP_USER']

    subjects_map = {
        'technical': 'Технический вопрос',
        'payment': 'Вопрос по оплате',
        'legal': 'Юридический вопрос',
        'other': 'Другое',
    }
    subject_label = subjects_map.get(subject, subject or 'Другое')

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'[ЮрДоки от Даббл] {subject_label} от {name}'
    msg['From'] = smtp_user
    msg['To'] = to_email

    html = f"""
    <h2>Новое сообщение с сайта ЮрДоки от Даббл</h2>
    <p><b>Имя:</b> {name}</p>
    <p><b>Email:</b> {email}</p>
    <p><b>Тема:</b> {subject_label}</p>
    <p><b>Сообщение:</b></p>
    <p>{message.replace(chr(10), '<br>')}</p>
    """
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, to_email, msg.as_string())

    return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}