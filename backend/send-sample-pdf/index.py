"""
Генерирует образец PDF-заявления и отправляет на почту поддержки.
"""
import json
import base64
import io
import os
import smtplib
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


SAMPLE_DATA = {
    'courtName': 'судебного участка № 123 Пресненского района',
    'courtCity': 'Москва',
    'courtAddress': 'ул. Пресненский Вал, д. 14',
    'fullName': 'Серебренникова Галина Сергеевна',
    'birthDate': '15.03.1980',
    'address': '625000, г. Тюмень, ул. Республики, д. 52, кв. 18',
    'phone': '+7 (922) 000-00-00',
    'email': 'telegraf.dbbr@bk.ru',
    'orderNumber': '2-1234/2026',
    'orderDate': '10.01.2026',
    'orderIssued': 'ООО МФО «Пример»',
    'creditorName': 'ООО МФО «Пример»',
    'debtAmount': '45 000 рублей 00 копеек',
    'groundsType': 'not_notified',
    'groundsDetails': 'Копию судебного приказа я не получала, о его существовании узнала только при списании средств с банковского счёта.',
}

GROUNDS_MAP = {
    'not_notified': 'я не была уведомлена надлежащим образом о вынесении судебного приказа',
    'disagreement':  'я не согласна с взысканной суммой долга',
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
    center = ParagraphStyle('C', fontName='Helvetica-Bold', fontSize=13, leading=20, alignment=TA_CENTER, spaceAfter=4)
    bold   = ParagraphStyle('B', fontName='Helvetica-Bold', fontSize=12, leading=18, alignment=TA_JUSTIFY)
    small  = ParagraphStyle('S', fontName='Helvetica', fontSize=10, leading=14, alignment=TA_LEFT, textColor=colors.HexColor('#555555'))

    def p(text, style=None): return Paragraph(text, style or normal)
    def sp(h=0.3): return Spacer(1, h*cm)

    today = datetime.today().strftime('%d.%m.%Y')
    d = data
    grounds_text = GROUNDS_MAP.get(d['groundsType'], 'имеются основания для отмены')

    story = [
        p(f'Мировому судье', right), p(d['courtName'], right),
        p(f'г. {d["courtCity"]}', right), p(d['courtAddress'], right), sp(0.5),
        p(f'от: {d["fullName"]}', right), p(f'дата рождения: {d["birthDate"]}', right),
        p(f'адрес: {d["address"]}', right), p(f'тел.: {d["phone"]}', right),
        p(f'email: {d["email"]}', right), sp(1),
        p('ЗАЯВЛЕНИЕ', center), p('об отмене судебного приказа', center), sp(1),
        p(f'«{today}» года {d["courtName"]} был вынесен судебный приказ '
          f'№ {d["orderNumber"]} от {d["orderDate"]} о взыскании с меня, {d["fullName"]}, '
          f'в пользу {d["creditorName"]} задолженности в размере {d["debtAmount"]}.'),
        sp(0.5),
        p(f'Считаю данный судебный приказ подлежащим отмене, поскольку {grounds_text}.'),
        sp(0.5),
        p(d['groundsDetails']), sp(0.5),
        p('В соответствии со статьёй 129 Гражданского процессуального кодекса Российской Федерации,'),
        sp(0.3), p('ПРОШУ:', bold), sp(0.3),
        p(f'Отменить судебный приказ № {d["orderNumber"]} от {d["orderDate"]}, '
          f'вынесенный о взыскании с {d["fullName"]} в пользу {d["creditorName"]} '
          f'задолженности в размере {d["debtAmount"]}.'),
        sp(1),
        p('Приложения:', bold), sp(0.2),
        p('1. Копия настоящего заявления.'),
        p('2. Копия документа, подтверждающего основания для отмены (при наличии).'),
        sp(1.5),
        p(f'«___» ____________ {datetime.today().year} г.'), sp(0.5),
        p(f'_______________________  /  {d["fullName"]}'), sp(1.5),
        p('* Документ создан автоматически сервисом ЮрДоки от Даббл. '
          'Проверьте корректность данных перед подачей в суд.', small),
    ]
    doc.build(story)
    return buf.getvalue()


def handler(event: dict, context) -> dict:
    """Генерирует образец PDF и отправляет его на почту поддержки"""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    pdf_bytes = build_pdf(SAMPLE_DATA)

    smtp_user = os.environ['SMTP_USER']
    smtp_pass = os.environ['SMTP_PASS']

    msg = MIMEMultipart()
    msg['Subject'] = 'Образец заявления — ЮрДоки от Даббл'
    msg['From'] = smtp_user
    msg['To'] = smtp_user

    msg.attach(MIMEText(
        '<p>Привет!</p><p>Во вложении — образец заполненного заявления об отмене судебного приказа.</p>'
        '<p><b>ЮрДоки от Даббл</b></p>',
        'html', 'utf-8'
    ))

    part = MIMEBase('application', 'pdf')
    part.set_payload(pdf_bytes)
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', 'attachment', filename='obrazets_zayavleniya.pdf')
    msg.attach(part)

    with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, smtp_user, msg.as_string())

    return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}
