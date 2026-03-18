"""
Генерация PDF-заявления об отмене судебного приказа.
Принимает данные формы, возвращает PDF в base64.
"""
import json
import base64
import io
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors


GROUNDS_MAP = {
    'not_notified': 'я не был уведомлён надлежащим образом о вынесении судебного приказа',
    'disagreement':  'я не согласен с взысканной суммой долга',
    'debt_paid':     'задолженность мной полностью погашена',
    'wrong_debtor':  'я не являюсь должником по данному обязательству',
    'other':         'имеются иные основания для отмены судебного приказа',
}


def build_pdf(data: dict) -> bytes:
    buf = io.BytesIO()

    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        rightMargin=2.5 * cm,
        leftMargin=3 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    W = A4[0] - 5.5 * cm

    normal_style = ParagraphStyle(
        'Normal', fontName='Helvetica', fontSize=12, leading=18,
        alignment=TA_JUSTIFY, spaceAfter=0,
    )
    right_style = ParagraphStyle(
        'Right', fontName='Helvetica', fontSize=12, leading=18,
        alignment=TA_RIGHT,
    )
    center_style = ParagraphStyle(
        'Center', fontName='Helvetica-Bold', fontSize=13, leading=20,
        alignment=TA_CENTER, spaceAfter=4,
    )
    bold_style = ParagraphStyle(
        'Bold', fontName='Helvetica-Bold', fontSize=12, leading=18,
        alignment=TA_JUSTIFY,
    )
    small_style = ParagraphStyle(
        'Small', fontName='Helvetica', fontSize=10, leading=14,
        alignment=TA_LEFT, textColor=colors.HexColor('#555555'),
    )

    # ── Helpers ─────────────────────────────────────────────────────────────
    def line(text='', style=normal_style):
        return Paragraph(text, style)

    def sp(h=0.3):
        return Spacer(1, h * cm)

    today = datetime.today().strftime('%d.%m.%Y')
    full_name  = data.get('fullName', '')
    birth_date = data.get('birthDate', '')
    address    = data.get('address', '')
    phone      = data.get('phone', '')
    email      = data.get('email', '')
    court_name = data.get('courtName', '')
    court_city = data.get('courtCity', '')
    court_addr = data.get('courtAddress', '')
    order_num  = data.get('orderNumber', '')
    order_date = data.get('orderDate', '')
    creditor   = data.get('creditorName', '') or data.get('orderIssued', '')
    debt_amt   = data.get('debtAmount', '')
    g_type     = data.get('groundsType', 'other')
    g_details  = data.get('groundsDetails', '')

    grounds_text = GROUNDS_MAP.get(g_type, 'имеются основания для отмены')

    story = []

    # ── Шапка (реквизиты) ────────────────────────────────────────────────────
    story.append(line(f'Мировому судье', right_style))
    story.append(line(f'{court_name}', right_style))
    if court_city:
        story.append(line(f'г. {court_city}', right_style))
    if court_addr:
        story.append(line(court_addr, right_style))
    story.append(sp(0.5))

    story.append(line(f'от: {full_name}', right_style))
    if birth_date:
        story.append(line(f'дата рождения: {birth_date}', right_style))
    story.append(line(f'адрес: {address}', right_style))
    if phone:
        story.append(line(f'тел.: {phone}', right_style))
    if email:
        story.append(line(f'email: {email}', right_style))

    story.append(sp(1))

    # ── Заголовок ─────────────────────────────────────────────────────────────
    story.append(line('ЗАЯВЛЕНИЕ', center_style))
    story.append(line('об отмене судебного приказа', center_style))
    story.append(sp(1))

    # ── Тело ──────────────────────────────────────────────────────────────────
    story.append(line(
        f'«{today}» года {court_name} был вынесен судебный приказ '
        f'№ {order_num} от {order_date} о взыскании с меня, {full_name}, '
        f'в пользу {creditor} задолженности в размере {debt_amt}.',
        normal_style
    ))
    story.append(sp(0.5))

    story.append(line(
        f'Считаю данный судебный приказ подлежащим отмене, поскольку '
        f'{grounds_text}.',
        normal_style
    ))
    story.append(sp(0.5))

    if g_details:
        story.append(line(g_details, normal_style))
        story.append(sp(0.5))

    story.append(line(
        'В соответствии со статьёй 129 Гражданского процессуального кодекса Российской Федерации,',
        normal_style
    ))
    story.append(sp(0.3))

    story.append(line('ПРОШУ:', bold_style))
    story.append(sp(0.3))

    story.append(line(
        f'Отменить судебный приказ № {order_num} от {order_date}, '
        f'вынесенный о взыскании с {full_name} в пользу {creditor} '
        f'задолженности в размере {debt_amt}.',
        normal_style
    ))
    story.append(sp(1))

    # ── Приложения ─────────────────────────────────────────────────────────────
    story.append(line('Приложения:', bold_style))
    story.append(sp(0.2))
    story.append(line('1. Копия настоящего заявления.', normal_style))
    story.append(line('2. Копия документа, подтверждающего основания для отмены (при наличии).', normal_style))
    story.append(sp(1.5))

    # ── Подпись ────────────────────────────────────────────────────────────────
    story.append(line(f'«___» ____________ {datetime.today().year} г.', normal_style))
    story.append(sp(0.5))
    story.append(line(
        f'_______________________  /  {full_name}',
        normal_style
    ))
    story.append(sp(1.5))

    # ── Примечание ──────────────────────────────────────────────────────────────
    story.append(Spacer(1, 0.5 * cm))
    story.append(line(
        '* Документ создан автоматически сервисом ЮрДоки от Даббл. '
        'Проверьте корректность данных перед подачей в суд.',
        small_style
    ))

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

    try:
        body = json.loads(event.get('body') or '{}')
        pdf_bytes = build_pdf(body)
        pdf_b64 = base64.b64encode(pdf_bytes).decode('utf-8')

        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'pdf': pdf_b64, 'filename': 'zayavlenie_otmena_sudprikaza.pdf'}),
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
        }