import { useState } from 'react';
import Icon from '@/components/ui/icon';

const faqs = [
  {
    q: 'Что такое судебный приказ и когда его можно отменить?',
    a: 'Судебный приказ — это судебное постановление, вынесенное судьёй единолично без вызова сторон. Должник вправе подать заявление об его отмене в течение 10 дней с момента получения копии приказа. Основания: несогласие с требованиями, неполучение приказа, истечение срока исковой давности и другие.'
  },
  {
    q: 'В течение какого срока нужно подать заявление?',
    a: '10 календарных дней с момента получения копии судебного приказа. Если срок пропущен по уважительной причине (болезнь, командировка), суд может восстановить срок. Наш сервис поможет сформировать ходатайство о восстановлении срока при необходимости.'
  },
  {
    q: 'Как происходит создание заявления?',
    a: 'Вы заполняете форму в конструкторе: данные суда, ваши персональные данные, сведения о судебном приказе и основания для отмены. Система автоматически формирует юридически грамотное заявление с правильными формулировками согласно ГПК РФ.'
  },
  {
    q: 'В каком формате я получу документ?',
    a: 'Документ предоставляется в двух форматах: DOCX (для редактирования в Microsoft Word или LibreOffice) и PDF (для печати и подачи). Оба файла доступны в личном кабинете сразу после оплаты.'
  },
  {
    q: 'Как подать заявление в суд?',
    a: 'Готовое заявление можно подать: лично в канцелярию суда, заказным письмом с уведомлением о вручении, через систему ГАС Правосудие (электронная подача), через МФЦ. Мы рекомендуем подавать лично или заказным письмом для получения отметки о принятии.'
  },
  {
    q: 'Гарантируете ли вы отмену приказа?',
    a: 'Наш сервис создаёт юридически корректное заявление, однако гарантировать отмену судебного приказа мы не можем — это решение суда. При соблюдении срока (10 дней) и правильном оформлении суд обязан отменить приказ без выяснения причин несогласия.'
  },
  {
    q: 'Что происходит после отмены приказа?',
    a: 'После отмены судебного приказа взыскатель вправе обратиться в суд с исковым заявлением. Это даст вам возможность полноценно защититься: представить доказательства, привлечь юриста, оспорить сумму долга.'
  },
  {
    q: 'Безопасны ли мои персональные данные?',
    a: 'Все данные передаются по зашифрованному соединению (HTTPS) и хранятся на защищённых серверах. Мы не передаём данные третьим лицам. Политика конфиденциальности соответствует требованиям 152-ФЗ «О персональных данных».'
  },
  {
    q: 'Как работает оплата? Какие способы доступны?',
    a: 'Оплата принимается через: банковские карты (Visa, MasterCard, МИР), ЮKassa (электронные кошельки), систему быстрых платежей (СБП). Оплата безопасна и защищена. После успешной оплаты документ сразу доступен для скачивания.'
  },
  {
    q: 'Можно ли получить возврат средств?',
    a: 'Если документ не был скачан в течение 24 часов после оплаты — мы вернём деньги по запросу. После скачивания документа возврат невозможен, так как услуга считается оказанной. Для возврата обратитесь в поддержку.'
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="bg-navy py-10">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="font-ibm text-xs text-gold/70 uppercase tracking-widest mb-2">Справка</div>
          <h1 className="font-cormorant font-bold text-white text-3xl md:text-4xl">
            Часто задаваемые вопросы
          </h1>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-border overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 p-6 text-left hover:bg-secondary/30 transition-colors"
              >
                <span className="font-ibm font-semibold text-navy text-sm leading-relaxed">
                  {faq.q}
                </span>
                <Icon
                  name={openIndex === i ? 'ChevronUp' : 'ChevronDown'}
                  size={18}
                  className="text-muted-foreground flex-shrink-0 mt-0.5 transition-transform"
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 animate-fade-in">
                  <div className="border-t border-border pt-4">
                    <p className="font-ibm text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact block */}
        <div className="mt-12 bg-navy p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-cormorant font-bold text-white text-2xl mb-2">
              Не нашли ответ?
            </h3>
            <p className="font-ibm text-white/60 text-sm">
              Наша поддержка ответит в течение 2 рабочих часов
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 border border-white/30 text-white font-ibm text-sm px-5 py-2.5 hover:border-white/60 transition-colors">
              <Icon name="MessageCircle" size={16} />
              Написать
            </button>
            <button className="flex items-center gap-2 bg-gold text-navy font-ibm font-semibold px-5 py-2.5 hover:bg-gold-light transition-colors">
              <Icon name="Phone" size={16} />
              Позвонить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
