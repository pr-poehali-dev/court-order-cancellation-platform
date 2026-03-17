import { useState } from 'react';
import Icon from '@/components/ui/icon';

export default function ContactsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const inp = "w-full rounded-xl border border-grey-200 bg-grey-50 px-4 py-3 font-ibm text-sm placeholder:text-grey-500 focus:outline-none focus:border-blue focus:bg-white transition-all";
  const lbl = "block font-ibm text-xs font-medium text-grey-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="bg-white border-b border-grey-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="section-chip mb-3">Контакты</div>
          <h1 className="font-cormorant font-bold text-grey-900 text-3xl md:text-4xl">Свяжитесь с нами</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-5">
            {[
              { icon: 'Mail',   title: 'Email',          lines: ['support@prikazotmena.ru', 'legal@prikazotmena.ru'] },
              { icon: 'Phone',  title: 'Телефон',        lines: ['+7 (800) 555-00-00', 'Бесплатно по России'] },
              { icon: 'Clock',  title: 'Режим работы',   lines: ['Пн–Пт: 9:00 – 19:00', 'Сб: 10:00 – 16:00'] },
              { icon: 'MapPin', title: 'Юридический адрес', lines: ['127000, г. Москва,', 'ул. Примерная, д. 1'] },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Icon name={item.icon} fallback="Info" size={18} className="text-blue" />
                </div>
                <div>
                  <div className="font-ibm text-xs text-grey-500 uppercase tracking-wider mb-0.5">{item.title}</div>
                  {item.lines.map((l, j) => (
                    <div key={j} className="font-ibm text-sm text-grey-900">{l}</div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl shadow-card p-5">
              <div className="font-ibm font-semibold text-grey-900 text-sm mb-3">ООО «ПриказОтмена»</div>
              {[['ИНН', '7700000000'], ['ОГРН', '1234567890000'], ['КПП', '770000000']].map(([k, v]) => (
                <div key={k} className="flex gap-3 mb-1.5 last:mb-0">
                  <span className="font-ibm text-xs text-grey-500 w-12">{k}</span>
                  <span className="font-ibm text-xs text-grey-900">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-8">
            {sent ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={32} className="text-emerald-600" />
                </div>
                <h3 className="font-cormorant font-bold text-grey-900 text-2xl mb-2">Сообщение отправлено</h3>
                <p className="font-ibm text-grey-500 text-sm">Ответим в течение 2 рабочих часов на указанный email</p>
              </div>
            ) : (
              <>
                <h2 className="font-cormorant font-bold text-grey-900 text-2xl mb-6">Написать нам</h2>
                <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={lbl}>Ваше имя *</label>
                      <input required className={inp} placeholder="Иван Иванов" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                      <label className={lbl}>Email *</label>
                      <input required type="email" className={inp} placeholder="ivan@mail.ru" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>Тема</label>
                    <select className={inp} value={subject} onChange={e => setSubject(e.target.value)}>
                      <option value="">Выберите тему</option>
                      <option value="technical">Технический вопрос</option>
                      <option value="payment">Вопрос по оплате</option>
                      <option value="legal">Юридический вопрос</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Сообщение *</label>
                    <textarea required className={`${inp} resize-none h-36`} placeholder="Опишите ваш вопрос..." value={message} onChange={e => setMessage(e.target.value)} />
                  </div>
                  <button type="submit" className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-blue text-white font-ibm font-medium shadow-blue hover:bg-blue-dark transition-colors">
                    <Icon name="Send" size={16} />
                    Отправить сообщение
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
