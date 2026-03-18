import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import func2url from '../../backend/func2url.json';

interface CabinetPageProps {
  onNavigate: (page: string) => void;
  user: { id: string; email: string; full_name: string } | null;
}

interface Doc {
  id: string;
  court_name: string;
  creditor_name: string;
  debt_amount: string;
  order_number: string;
  order_date: string;
  pdf_sent: boolean;
  created_at: string;
}

type Tab = 'documents' | 'profile';

export default function CabinetPage({ onNavigate, user }: CabinetPageProps) {
  const [tab, setTab] = useState<Tab>('documents');
  const [docs, setDocs] = useState<Doc[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);

  const displayName = user?.full_name || user?.email || '';

  useEffect(() => {
    if (!user?.email) return;
    setDocsLoading(true);
    fetch(func2url['get-documents'], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: user.email }),
    })
      .then(r => r.json())
      .then(data => setDocs(data.documents || []))
      .finally(() => setDocsLoading(false));
  }, [user?.email]);

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="bg-white border-b border-grey-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="section-chip mb-3">Личный кабинет</div>
              <h1 className="font-syne font-bold text-grey-900 text-3xl">{displayName}</h1>
              {user?.full_name && (
                <p className="font-onest text-grey-500 text-sm mt-1">{user.email}</p>
              )}
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
              { id: 'documents', label: 'Заявления', icon: 'FileText' },
              { id: 'profile',   label: 'Профиль',   icon: 'User' },
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

            {docsLoading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-4 border-blue border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : docs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-card p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <Icon name="FileText" size={28} className="text-blue" />
                </div>
                <h3 className="font-syne font-bold text-grey-900 text-xl mb-2">Заявлений пока нет</h3>
                <p className="font-onest text-sm text-grey-500 mb-6">Создайте первое заявление об отмене судебного приказа</p>
                <button
                  onClick={() => onNavigate('constructor')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue text-white font-onest text-sm font-medium shadow-blue hover:bg-blue-dark transition-colors"
                >
                  <Icon name="Plus" size={16} />
                  Создать заявление
                </button>
              </div>
            ) : (
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
                            <span className="font-onest font-semibold text-grey-900 text-sm">
                              Заявление об отмене судебного приказа
                            </span>
                            <span className={`font-onest text-xs px-2.5 py-0.5 rounded-full ${doc.pdf_sent ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                              {doc.pdf_sent ? 'Отправлено на почту' : 'В обработке'}
                            </span>
                          </div>
                          <p className="font-onest text-xs text-grey-500 truncate">{doc.court_name}</p>
                          <div className="flex flex-wrap gap-3 mt-1">
                            {doc.creditor_name && (
                              <span className="font-onest text-xs text-grey-500">Взыскатель: <span className="text-grey-800">{doc.creditor_name}</span></span>
                            )}
                            {doc.debt_amount && (
                              <span className="font-onest text-xs text-grey-500">Сумма: <span className="text-grey-800">{doc.debt_amount}</span></span>
                            )}
                            <span className="font-onest text-xs text-grey-500">{doc.created_at}</span>
                          </div>
                        </div>
                      </div>
                      {doc.pdf_sent && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-onest text-xs text-grey-500 flex items-center gap-1.5">
                            <Icon name="Mail" size={13} className="text-emerald-600" />
                            Документ отправлен на вашу почту
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'profile' && (
          <div className="max-w-xl">
            <h2 className="font-syne font-bold text-grey-900 text-2xl mb-6">Мои данные</h2>
            <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
              <div className="flex justify-between items-center border-b border-grey-200 pb-5">
                <div>
                  <div className="font-onest text-xs text-grey-500 uppercase tracking-wider mb-0.5">Имя</div>
                  <div className="font-onest text-sm text-grey-900">{user?.full_name || '—'}</div>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-grey-200 pb-5">
                <div>
                  <div className="font-onest text-xs text-grey-500 uppercase tracking-wider mb-0.5">Email</div>
                  <div className="font-onest text-sm text-grey-900">{user?.email}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-onest text-xs text-grey-500 uppercase tracking-wider mb-0.5">Согласие на обработку ПДн</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Icon name="CheckCircle" size={14} className="text-emerald-600" />
                    <span className="font-onest text-sm text-emerald-700">Дано при регистрации</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
