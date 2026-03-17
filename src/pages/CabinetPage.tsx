import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface CabinetPageProps {
  onNavigate: (page: string) => void;
}

const docs = [
  { id: 1, title: 'Заявление об отмене судебного приказа', court: 'Мировой судья судебного участка №1 Ленинского района г. Москвы', creditor: 'ООО «МФО Пример»', amount: '25 000 ₽', date: '12.03.2024', status: 'ready' },
  { id: 2, title: 'Заявление об отмене судебного приказа', court: 'Мировой судья судебного участка №5 Советского района г. СПб', creditor: 'ПАО «Сбербанк»', amount: '48 500 ₽', date: '28.02.2024', status: 'pending' },
  { id: 3, title: 'Заявление об отмене судебного приказа', court: 'Мировой судья судебного участка №12 Октябрьского района', creditor: 'ООО «Коллектор Плюс»', amount: '12 300 ₽', date: '15.01.2024', status: 'ready' },
];

const statusCfg: Record<string, { label: string; cls: string }> = {
  ready:   { label: 'Готово',       cls: 'bg-emerald-50 text-emerald-700' },
  pending: { label: 'В обработке',  cls: 'bg-amber-50 text-amber-700' },
  draft:   { label: 'Черновик',     cls: 'bg-grey-100 text-grey-500' },
};

type Tab = 'documents' | 'profile' | 'notifications';

export default function CabinetPage({ onNavigate }: CabinetPageProps) {
  const [tab, setTab] = useState<Tab>('documents');

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Top */}
      <div className="bg-white border-b border-grey-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="section-chip mb-3">Личный кабинет</div>
              <h1 className="font-syne font-bold text-grey-900 text-3xl">Иванов Иван Иванович</h1>
              <p className="font-onest text-grey-500 text-sm mt-1">ivan.ivanov@mail.ru</p>
            </div>
            <button
              onClick={() => onNavigate('constructor')}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue text-white font-onest text-sm font-medium shadow-blue hover:bg-blue-dark transition-colors"
            >
              <Icon name="Plus" size={16} />
              Новое заявление
            </button>
          </div>

          <div className="flex gap-1 mt-6">
            {([
              { id: 'documents',     label: 'Заявления',    icon: 'FileText' },
              { id: 'profile',       label: 'Профиль',      icon: 'User' },
              { id: 'notifications', label: 'Уведомления',  icon: 'Bell' },
            ] as { id: Tab; label: string; icon: string }[]).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-onest text-sm transition-all ${
                  tab === t.id ? 'bg-blue-50 text-blue font-medium' : 'text-grey-500 hover:bg-grey-100 hover:text-grey-900'
                }`}
              >
                <Icon name={t.icon} fallback="FileText" size={15} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {tab === 'documents' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-syne font-bold text-grey-900 text-2xl">Мои заявления</h2>
              <button
                onClick={() => onNavigate('constructor')}
                className="md:hidden flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue text-white font-onest text-sm font-medium"
              >
                <Icon name="Plus" size={15} />Создать
              </button>
            </div>

            <div className="space-y-3">
              {docs.map(doc => (
                <div key={doc.id} className="bg-white rounded-2xl shadow-card p-5 hover-lift">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Icon name="FileText" size={18} className="text-blue" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-onest font-semibold text-grey-900 text-sm">{doc.title}</span>
                          <span className={`font-onest text-xs px-2.5 py-0.5 rounded-full ${statusCfg[doc.status].cls}`}>
                            {statusCfg[doc.status].label}
                          </span>
                        </div>
                        <p className="font-onest text-xs text-grey-500 truncate">{doc.court}</p>
                        <div className="flex flex-wrap gap-3 mt-1">
                          <span className="font-onest text-xs text-grey-500">Взыскатель: <span className="text-grey-800">{doc.creditor}</span></span>
                          <span className="font-onest text-xs text-grey-500">Сумма: <span className="text-grey-800">{doc.amount}</span></span>
                          <span className="font-onest text-xs text-grey-500">{doc.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {doc.status === 'ready' && (
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-blue text-blue font-onest text-xs font-medium hover:bg-blue hover:text-white transition-all">
                          <Icon name="Download" size={13} />
                          Скачать PDF
                        </button>
                      )}
                      <button className="w-8 h-8 rounded-full flex items-center justify-center text-grey-500 hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <Icon name="Trash2" size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div className="max-w-xl">
            <h2 className="font-syne font-bold text-grey-900 text-2xl mb-6">Мои данные</h2>
            <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
              {[
                { label: 'ФИО', value: 'Иванов Иван Иванович' },
                { label: 'Email', value: 'ivan.ivanov@mail.ru' },
                { label: 'Телефон', value: '+7 (900) 123-45-67' },
                { label: 'Дата рождения', value: '01.01.1985' },
                { label: 'Адрес', value: 'г. Москва, ул. Примерная, д. 1, кв. 1' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center border-b border-grey-200 pb-5 last:border-0 last:pb-0">
                  <div>
                    <div className="font-onest text-xs text-grey-500 uppercase tracking-wider mb-0.5">{item.label}</div>
                    <div className="font-onest text-sm text-grey-900">{item.value}</div>
                  </div>
                  <button className="font-onest text-xs text-blue hover:underline">Изменить</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'notifications' && (
          <div className="max-w-xl space-y-3">
            {[
              { icon: 'CheckCircle', color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Заявление готово', text: 'Заявление по делу №2-1234/2024 сформировано и готово к скачиванию.', time: '12.03.2024, 14:23', read: false },
              { icon: 'CreditCard', color: 'text-blue', bg: 'bg-blue-50', title: 'Оплата принята', text: 'Оплата на сумму 499 ₽ успешно получена. Обработка документа начата.', time: '12.03.2024, 14:10', read: false },
              { icon: 'Info', color: 'text-gold', bg: 'bg-gold-50', title: 'Напоминание', text: 'Срок подачи заявления — 10 дней с момента получения приказа.', time: '10.03.2024, 09:00', read: true },
            ].map((n, i) => (
              <div key={i} className={`bg-white rounded-2xl shadow-card p-5 flex gap-4 ${n.read ? 'opacity-60' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.bg}`}>
                  <Icon name={n.icon} fallback="Bell" size={18} className={n.color} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-onest font-semibold text-sm text-grey-900">{n.title}</span>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-blue" />}
                  </div>
                  <p className="font-onest text-sm text-grey-500">{n.text}</p>
                  <p className="font-onest text-xs text-grey-500/60 mt-1.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}