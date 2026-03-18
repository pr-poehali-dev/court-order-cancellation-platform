"""
Генерирует PDF по данным формы, сохраняет запись в БД и отправляет на email пользователя.
Вызывается после успешной оплаты со страницы payment-success.
"""
import json
import os
import io
import smtplib
import psycopg2
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib import colors

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p72586878_court_order_cancella')

GROUNDS_MAP = {
    'not_notified': 'я не был уведомлён надлежащим образом о вынесении судебного приказа',
    'disagreement':  'я не согласен с взысканной суммой долга',
    'debt_paid':     'задолженность мной полностью погашена',
    'wrong_debtor':  'я не являюсь должником по данному обязательству',
    'other':         'имеются иные основания для отмены судебного приказа',
}


def build_pdf(data: dict) -> bytes:
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4,
        rightMargin=2.5*cm, leftMargin=3*cm, topMargin=2*cm, bottomMargin=2*cm)

    normal = ParagraphStyle('N', fontName='Helvetica', fontSize=12, leading=18, alignment=TA_JUSTIFY)
    right  = ParagraphStyle('R', fontName='Helvetica', fontSize=12, leading=18, alignment=TA_RIGHT)
    center = ParagraphStyle('C', fontName='Helvetica-Bold', fontSize=13, leading=20, alignment=TA_CENTER)
    bold   = ParagraphStyle('B', fontName='Helvetica-Bold', fontSize=12, leading=18, alignment=TA_JUSTIFY)
    small  = ParagraphStyle('S', fontName='Helvetica', fontSize=10, leading=14, alignment=TA_LEFT, textColor=colors.HexColor('#555555'))

    def p(text, style=None): return Paragraph(text or '', style or normal)
    def sp(h=0.3): return Spacer(1, h*cm)

    today = datetime.today().strftime('%d.%m.%Y')
    grounds_text = GROUNDS_MAP.get(data.get('groundsType', 'other'), 'имеются основания для отмены')
    creditor = data.get('creditorName') or data.get('orderIssued', '')

    story = [
        p(f'Мировому судье', right), p(data.get('courtName', ''), right),
        p(f'г. {data.get("courtCity", "")}', right), p(data.get('courtAddress', ''), right), sp(0.5),
        p(f'от: {data.get("fullName", "")}', right),
        p(f'дата рождения: {data.get("birthDate", "")}', right),
        p(f'адрес: {data.get("address", "")}', right),
        p(f'тел.: {data.get("phone", "")}', right),
        p(f'email: {data.get("email", "")}', right), sp(1),
        p('ЗАЯВЛЕНИЕ', center), p('об отмене судебного приказа', center), sp(1),
        p(f'«{today}» года {data.get("courtName", "")} был вынесен судебный приказ '
          f'№ {data.get("orderNumber", "")} от {data.get("orderDate", "")} о взыскании с меня, '
          f'{data.get("fullName", "")}, в пользу {creditor} задолженности в размере {data.get("debtAmount", "")}.'),
        sp(0.5),
        p(f'Считаю данный судебный приказ подлежащим отмене, поскольку {grounds_text}.'),
        sp(0.5),
    ]
    if data.get('groundsDetails'):
        story += [p(data['groundsDetails']), sp(0.5)]

    story += [
        p('В соответствии со статьёй 129 Гражданского процессуального кодекса Российской Федерации,'),
        sp(0.3), p('ПРОШУ:', bold), sp(0.3),
        p(f'Отменить судебный приказ № {data.get("orderNumber", "")} от {data.get("orderDate", "")}, '
          f'вынесенный о взыскании с {data.get("fullName", "")} в пользу {creditor} '
          f'задолженности в размере {data.get("debtAmount", "")}.'),
        sp(1),
        p('Приложения:', bold), sp(0.2),
        p('1. Копия настоящего заявления.'),
        p('2. Копия документа, подтверждающего основания для отмены (при наличии).'),
        sp(1.5),
        p(f'«___» ____________ {datetime.today().year} г.'), sp(0.5),
        p(f'_______________________  /  {data.get("fullName", "")}'), sp(1.5),
        p('* Документ создан автоматически сервисом ЮрДоки от Даббл. '
          'Проверьте корректность данных перед подачей в суд.', small),
    ]
    doc.build(story)
    return buf.getvalue()


def handler(event: dict, context) -> dict:
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    form_data  = body.get('form_data', {})
    user_email = body.get('user_email', '') or form_data.get('email', '')
    payment_id = body.get('payment_id', '')

    if not form_data or not user_email:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Нет данных формы или email'})}

    pdf_bytes = build_pdf(form_data)

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        f'''INSERT INTO {SCHEMA}.documents
            (user_email, payment_id, court_name, creditor_name, debt_amount, order_number, order_date, form_data, pdf_sent)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, FALSE) RETURNING id''',
        (
            user_email, payment_id,
            form_data.get('courtName', ''),
            form_data.get('creditorName') or form_data.get('orderIssued', ''),
            form_data.get('debtAmount', ''),
            form_data.get('orderNumber', ''),
            form_data.get('orderDate', ''),
            json.dumps(form_data, ensure_ascii=False),
        )
    )
    doc_id = str(cur.fetchone()[0])

    smtp_user = os.environ['SMTP_USER']
    smtp_pass = os.environ['SMTP_PASS']

    msg = MIMEMultipart()
    msg['Subject'] = 'Ваше заявление об отмене судебного приказа — ЮрДоки от Даббл'
    msg['From'] = smtp_user
    msg['To'] = user_email

    html = f"""
    <p>Здравствуйте, {form_data.get('fullName', '')}!</p>
    <p>Ваше заявление об отмене судебного приказа № {form_data.get('orderNumber', '')} успешно сформировано.</p>
    <p>Документ во вложении. Проверьте данные и подайте заявление в суд.</p>
    <br>
    <p>С уважением,<br><b>ЮрДоки от Даббл</b></p>
    """
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    part = MIMEBase('application', 'pdf')
    part.set_payload(pdf_bytes)
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', 'attachment', filename='zayavlenie_otmena_sudprikaza.pdf')
    msg.attach(part)

    with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, user_email, msg.as_string())

    cur.execute(f'UPDATE {SCHEMA}.documents SET pdf_sent=TRUE WHERE id=%s', (doc_id,))
    conn.commit()
    cur.close()
    conn.close()

    return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True, 'doc_id': doc_id})}
