import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface CabinetPageProps {
  onNavigate: (page: string) => void;
}

const mockDocuments = [
  {
    id: 1,
    title: 'Заявление об отмене судебного приказа',
    court: 'Мировой судья судебного участка №1 Ленинского района г. Москвы',
    creditor: 'ООО «МФО Пример»',
    amount: '25 000 ₽',
    date: '12.03.2024',
    status: 'ready',
  },
  {
    id: 2,
    title: 'Заявление об отмене судебного приказа',
    court: 'Мировой судья судебного участка №5 Советского района г. СПб',
    creditor: 'ПАО «Сбербанк»',
    amount: '48 500 ₽',
    date: '28.02.2024',
    status: 'pending',
  },
  {
    id: 3,
    title: 'Заявление об отмене судебного приказа',
    court: 'Мировой судья судебного участка №12 Октябрьского района',
    creditor: 'ООО «Коллектор Плюс»',
    amount: '12 300 ₽',
    date: '15.01.2024',
    status: 'ready',
  },
];

const statusMap: Record<string, { label: string; color: string }> = {
  ready: { label: 'Готово', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  pending: { label: 'В обработке', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  draft: { label: 'Черновик', color: 'text-muted-foreground bg-secondary border-border' },
};

export default function CabinetPage({ onNavigate }: CabinetPageProps) {
  const [activeTab, setActiveTab] = useState<'documents' | 'profile' | 'notifications'>('documents');

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="bg-navy py-10">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="font-ibm text-xs text-gold/70 uppercase tracking-widest mb-2">Личный кабинет</div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-cormorant font-bold text-white text-3xl md:text-4xl">
                Иванов Иван Иванович
              </h1>
              <p className="font-ibm text-white/50 text-sm mt-1">ivan.ivanov@mail.ru</p>
            </div>
            <button
              onClick={() => onNavigate('constructor')}
              className="hidden md:flex items-center gap-2 bg-gold text-navy font-ibm font-semibold px-5 py-2.5 hover:bg-gold-light transition-colors"
            >
              <Icon name="Plus" size={16} />
              Новое заявление
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-border">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex gap-0">
            {[
              { id: 'documents', label: 'Мои заявления', icon: 'FileText' },
              { id: 'profile', label: 'Профиль', icon: 'User' },
              { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-5 py-4 border-b-2 font-ibm text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-gold text-navy font-medium'
                    : 'border-transparent text-muted-foreground hover:text-navy'
                }`}
              >
                <Icon name={tab.icon} fallback="FileText" size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-6 py-8">

        {/* Documents tab */}
        {activeTab === 'documents' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-cormorant font-bold text-navy text-2xl">
                Мои заявления ({mockDocuments.length})
              </h2>
              <button
                onClick={() => onNavigate('constructor')}
                className="md:hidden flex items-center gap-2 bg-navy text-white font-ibm text-sm font-medium px-4 py-2"
              >
                <Icon name="Plus" size={16} />
                Создать
              </button>
            </div>

            <div className="space-y-4">
              {mockDocuments.map(doc => (
                <div key={doc.id} className="bg-white border border-border p-6 hover-scale">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-navy/8 flex items-center justify-center flex-shrink-0">
                          <Icon name="FileText" size={16} className="text-navy" />
                        </div>
                        <h3 className="font-ibm font-semibold text-navy text-sm">{doc.title}</h3>
                        <span className={`font-ibm text-xs px-2 py-0.5 border ${statusMap[doc.status].color}`}>
                          {statusMap[doc.status].label}
                        </span>
                      </div>
                      <div className="ml-11 space-y-1">
                        <p className="font-ibm text-xs text-muted-foreground">{doc.court}</p>
                        <div className="flex flex-wrap gap-4">
                          <span className="font-ibm text-xs text-muted-foreground">
                            <span className="text-navy/60">Взыскатель:</span> {doc.creditor}
                          </span>
                          <span className="font-ibm text-xs text-muted-foreground">
                            <span className="text-navy/60">Сумма:</span> {doc.amount}
                          </span>
                          <span className="font-ibm text-xs text-muted-foreground">
                            <span className="text-navy/60">Создано:</span> {doc.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-11 md:ml-0">
                      {doc.status === 'ready' && (
                        <>
                          <button className="flex items-center gap-1.5 border border-navy text-navy font-ibm text-xs font-medium px-3 py-1.5 hover:bg-navy hover:text-white transition-colors">
                            <Icon name="Download" size={12} />
                            DOCX
                          </button>
                          <button className="flex items-center gap-1.5 border border-navy text-navy font-ibm text-xs font-medium px-3 py-1.5 hover:bg-navy hover:text-white transition-colors">
                            <Icon name="Download" size={12} />
                            PDF
                          </button>
                        </>
                      )}
                      <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {mockDocuments.length === 0 && (
              <div className="text-center py-20">
                <Icon name="FileX" size={40} className="text-muted-foreground/30 mx-auto mb-4" />
                <p className="font-cormorant text-navy text-2xl mb-2">Нет заявлений</p>
                <p className="font-ibm text-muted-foreground text-sm mb-6">Создайте первое заявление</p>
                <button
                  onClick={() => onNavigate('constructor')}
                  className="bg-navy text-white font-ibm text-sm font-medium px-6 py-2.5"
                >
                  Создать заявление
                </button>
              </div>
            )}
          </div>
        )}

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <h2 className="font-cormorant font-bold text-navy text-2xl mb-6">Мои данные</h2>
            <div className="bg-white border border-border p-8 space-y-5">
              {[
                { label: 'ФИО', value: 'Иванов Иван Иванович', field: 'fullName' },
                { label: 'Email', value: 'ivan.ivanov@mail.ru', field: 'email' },
                { label: 'Телефон', value: '+7 (900) 123-45-67', field: 'phone' },
                { label: 'Дата рождения', value: '01.01.1985', field: 'birthDate' },
                { label: 'Адрес регистрации', value: 'г. Москва, ул. Примерная, д. 1, кв. 1', field: 'address' },
              ].map(item => (
                <div key={item.field} className="flex items-center justify-between border-b border-border pb-5 last:border-0 last:pb-0">
                  <div>
                    <div className="font-ibm text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.label}</div>
                    <div className="font-ibm text-sm text-foreground">{item.value}</div>
                  </div>
                  <button className="font-ibm text-xs text-navy hover:underline">
                    Изменить
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <button className="font-ibm text-sm text-muted-foreground hover:text-navy underline">
                Изменить пароль
              </button>
              <span className="text-border">|</span>
              <button className="font-ibm text-sm text-destructive hover:underline">
                Удалить аккаунт
              </button>
            </div>
          </div>
        )}

        {/* Notifications tab */}
        {activeTab === 'notifications' && (
          <div className="max-w-2xl">
            <h2 className="font-cormorant font-bold text-navy text-2xl mb-6">Уведомления</h2>
            <div className="space-y-3">
              {[
                { icon: 'CheckCircle', color: 'text-emerald-600', title: 'Заявление готово', text: 'Ваше заявление по делу №2-1234/2024 сформировано и готово к скачиванию.', time: '12.03.2024, 14:23', read: false },
                { icon: 'CreditCard', color: 'text-navy', title: 'Оплата принята', text: 'Оплата на сумму 499 ₽ успешно получена. Обработка документа начата.', time: '12.03.2024, 14:10', read: false },
                { icon: 'Info', color: 'text-gold', title: 'Напоминание', text: 'Срок подачи заявления об отмене судебного приказа — 10 дней с момента получения.', time: '10.03.2024, 09:00', read: true },
              ].map((n, i) => (
                <div key={i} className={`bg-white border p-5 flex gap-4 ${n.read ? 'border-border opacity-70' : 'border-border'}`}>
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full bg-secondary flex items-center justify-center`}>
                      <Icon name={n.icon} fallback="Bell" size={16} className={n.color} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-ibm font-semibold text-sm text-navy">{n.title}</span>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-gold" />}
                    </div>
                    <p className="font-ibm text-sm text-muted-foreground leading-relaxed">{n.text}</p>
                    <div className="font-ibm text-xs text-muted-foreground/60 mt-2">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
