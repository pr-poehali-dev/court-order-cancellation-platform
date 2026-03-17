import { useState } from 'react';
import Icon from '@/components/ui/icon';

export default function ContactsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const inputClass = "w-full border border-border bg-white px-3 py-2.5 font-ibm text-sm placeholder:text-muted-foreground focus:outline-none focus:border-navy transition-colors";
  const labelClass = "block font-ibm text-xs text-muted-foreground uppercase tracking-wider mb-1.5";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="bg-navy py-10">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="font-ibm text-xs text-gold/70 uppercase tracking-widest mb-2">Контакты</div>
          <h1 className="font-cormorant font-bold text-white text-3xl md:text-4xl">
            Свяжитесь с нами
          </h1>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-cormorant font-bold text-navy text-2xl mb-6 decor-line">Реквизиты</h2>
              <div className="space-y-5">
                {[
                  {
                    icon: 'Mail',
                    title: 'Email',
                    lines: ['support@prikazotmena.ru', 'legal@prikazotmena.ru'],
                  },
                  {
                    icon: 'Phone',
                    title: 'Телефон',
                    lines: ['+7 (800) 555-00-00', 'Бесплатно по России'],
                  },
                  {
                    icon: 'Clock',
                    title: 'Режим работы',
                    lines: ['Пн–Пт: 9:00 – 19:00', 'Сб: 10:00 – 16:00'],
                  },
                  {
                    icon: 'MapPin',
                    title: 'Юридический адрес',
                    lines: ['127000, г. Москва,', 'ул. Примерная, д. 1, офис 1'],
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-navy flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon} fallback="Info" size={16} className="text-gold" />
                    </div>
                    <div>
                      <div className="font-ibm text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{item.title}</div>
                      {item.lines.map((l, j) => (
                        <div key={j} className="font-ibm text-sm text-navy">{l}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border p-5 bg-white">
              <div className="font-cormorant font-bold text-navy text-lg mb-3">ООО «ПриказОтмена»</div>
              <div className="space-y-1">
                {[
                  ['ИНН', '7700000000'],
                  ['ОГРН', '1234567890000'],
                  ['КПП', '770000000'],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <span className="font-ibm text-xs text-muted-foreground w-12">{k}</span>
                    <span className="font-ibm text-xs text-foreground">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2 bg-white border border-border p-8">
            {sent ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="w-16 h-16 bg-gold/15 flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={32} className="text-gold" />
                </div>
                <h3 className="font-cormorant font-bold text-navy text-2xl mb-2">Сообщение отправлено</h3>
                <p className="font-ibm text-muted-foreground text-sm">
                  Мы ответим в течение 2 рабочих часов на указанный email
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-cormorant font-bold text-navy text-2xl mb-6 decor-line">Написать нам</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Ваше имя *</label>
                      <input
                        required
                        className={inputClass}
                        placeholder="Иван Иванов"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Email *</label>
                      <input
                        required
                        type="email"
                        className={inputClass}
                        placeholder="ivan@mail.ru"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Тема обращения</label>
                    <select
                      className={inputClass}
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                    >
                      <option value="">Выберите тему</option>
                      <option value="technical">Технический вопрос</option>
                      <option value="payment">Вопрос по оплате</option>
                      <option value="legal">Юридический вопрос</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Сообщение *</label>
                    <textarea
                      required
                      className={`${inputClass} resize-none h-36`}
                      placeholder="Опишите ваш вопрос или проблему..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-navy text-white font-ibm font-semibold px-8 py-3 hover:bg-navy-dark transition-colors flex items-center gap-2"
                  >
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
