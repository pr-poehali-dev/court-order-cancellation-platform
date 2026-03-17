import { useState } from 'react';
import Icon from '@/components/ui/icon';

const faqs = [
  { q: 'Что такое судебный приказ и когда его можно отменить?', a: 'Судебный приказ — постановление, вынесенное судьёй единолично без вызова сторон. Должник вправе подать заявление об отмене в течение 10 дней с момента получения копии приказа.' },
  { q: 'В течение какого срока нужно подать заявление?', a: '10 календарных дней с момента получения копии судебного приказа. Если срок пропущен по уважительной причине, суд может его восстановить.' },
  { q: 'Как происходит создание заявления?', a: 'Вы заполняете форму в конструкторе: суд, личные данные, сведения о приказе и основания. Система автоматически формирует юридически корректное заявление.' },
  { q: 'В каком формате я получу документ?', a: 'Документ предоставляется в формате PDF. Файл доступен в личном кабинете сразу после оплаты.' },
  { q: 'Как подать заявление в суд?', a: 'Лично в канцелярию суда, заказным письмом с уведомлением, через ГАС Правосудие или МФЦ. Рекомендуем подавать лично или заказным письмом.' },
  { q: 'Гарантируете ли вы отмену приказа?', a: 'Мы создаём юридически корректное заявление, но гарантировать результат не можем — это решение суда. При соблюдении 10-дневного срока суд обязан отменить приказ.' },
  { q: 'Что происходит после отмены?', a: 'Взыскатель вправе обратиться с исковым заявлением. Это даёт вам возможность защититься: представить доказательства, привлечь юриста, оспорить сумму.' },
  { q: 'Безопасны ли мои данные?', a: 'Данные передаются по HTTPS и хранятся на защищённых серверах. Соответствие 152-ФЗ «О персональных данных». Данные не передаются третьим лицам.' },
  { q: 'Какие способы оплаты доступны?', a: 'Банковские карты (Visa, MasterCard, МИР), ЮKassa (электронные кошельки), СБП. Оплата защищена.' },
  { q: 'Можно ли получить возврат?', a: 'Если документ не был скачан в течение 24 часов — вернём деньги по запросу. После скачивания возврат невозможен.' },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="bg-white border-b border-grey-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="section-chip mb-3">Справка</div>
          <h1 className="font-syne font-bold text-grey-900 text-3xl md:text-4xl">Часто задаваемые вопросы</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 p-6 text-left hover:bg-grey-50 transition-colors"
              >
                <span className="font-onest font-medium text-grey-900 text-sm leading-relaxed">{faq.q}</span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${open === i ? 'bg-blue text-white' : 'bg-grey-100 text-grey-500'}`}>
                  <Icon name={open === i ? 'ChevronUp' : 'ChevronDown'} size={15} />
                </div>
              </button>
              {open === i && (
                <div className="px-6 pb-6 animate-fade-in">
                  <div className="pl-0 border-t border-grey-200 pt-4">
                    <p className="font-onest text-sm text-grey-500 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-syne font-bold text-white text-2xl mb-1.5">Не нашли ответ?</h3>
            <p className="font-onest text-white/70 text-sm">Ответим в течение 2 рабочих часов</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/30 text-white font-onest text-sm hover:border-white/60 transition-colors">
              <Icon name="MessageCircle" size={16} />Написать
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-grey-900 font-onest font-semibold hover:bg-gold-light transition-colors">
              <Icon name="Phone" size={16} />Позвонить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}