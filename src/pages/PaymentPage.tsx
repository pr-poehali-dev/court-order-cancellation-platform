import { useState } from 'react';
import Icon from '@/components/ui/icon';
import func2url from '../../backend/func2url.json';

interface PaymentPageProps {
  onNavigate: (page: string) => void;
}

const plans = [
  {
    id: 'basic', name: 'Базовый', price: 499, popular: false,
    features: ['Одно заявление', 'Формат PDF', 'Проверка корректности', 'Доступ 30 дней'],
  },
  {
    id: 'standard', name: 'Стандарт', price: 1490, popular: true,
    features: ['5 заявлений', 'Формат PDF', 'Проверка корректности', 'Доступ 90 дней', 'Email-уведомления', 'Приоритетная поддержка'],
  },
  {
    id: 'pro', name: 'Профессиональный', price: 3990, popular: false,
    features: ['Неограниченно заявлений', 'Формат PDF', 'Проверка корректности', 'Доступ 1 год', 'Email и SMS', 'Личный консультант'],
  },
];

export default function PaymentPage({ onNavigate }: PaymentPageProps) {
  const [plan, setPlan] = useState('standard');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selected = plans.find(p => p.id === plan);
  const inp = "w-full rounded-xl border border-grey-200 bg-grey-50 px-4 py-3 font-onest text-sm placeholder:text-grey-500 focus:outline-none focus:border-blue focus:bg-white transition-all";
  const lbl = "block font-onest text-xs font-medium text-grey-500 uppercase tracking-wider mb-1.5";

  const handlePay = async () => {
    if (!agreed) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(func2url['create-payment'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: plan,
          email,
          return_url: window.location.href,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка оплаты');
      window.location.href = data.confirmation_url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось создать платёж. Попробуйте позже.');
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="bg-white border-b border-grey-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="section-chip mb-3">Оплата</div>
          <h1 className="font-syne font-bold text-grey-900 text-3xl md:text-4xl">Тарифы и оплата</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="font-syne font-bold text-grey-900 text-2xl mb-6">Выберите тариф</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map(p => (
              <button
                key={p.id}
                onClick={() => setPlan(p.id)}
                className={`text-left p-6 rounded-2xl border-2 transition-all hover-lift relative ${
                  plan === p.id ? 'border-blue bg-white shadow-card-hover' : 'border-grey-200 bg-white shadow-card hover:border-blue/40'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-6 bg-gold text-grey-900 font-onest text-xs font-semibold px-3 py-1 rounded-full">
                    Популярный
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-onest font-semibold text-grey-900">{p.name}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    plan === p.id ? 'border-blue' : 'border-grey-200'
                  }`}>
                    {plan === p.id && <div className="w-2.5 h-2.5 rounded-full bg-blue" />}
                  </div>
                </div>
                <div className="font-syne font-bold text-grey-900 text-4xl mb-5">
                  {p.price.toLocaleString('ru')} <span className="text-xl font-onest font-normal text-grey-500">₽</span>
                </div>
                <ul className="space-y-2">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Icon name="Check" size={14} className="text-blue flex-shrink-0" />
                      <span className="font-onest text-sm text-grey-500">{f}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-8">
            <h2 className="font-syne font-bold text-grey-900 text-2xl mb-6">Данные для оплаты</h2>

            <div className="space-y-5">
              <div>
                <label className={lbl}>Email для квитанции *</label>
                <input
                  type="email"
                  required
                  className={inp}
                  placeholder="ivan@mail.ru"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <p className="font-onest text-xs text-grey-500 mt-1.5">На этот адрес придёт квитанция и доступ к сервису</p>
              </div>

              <div className="p-5 bg-blue-50 rounded-xl flex items-start gap-3">
                <Icon name="ShieldCheck" size={20} className="text-blue flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-onest text-sm font-medium text-grey-900 mb-1">Оплата через ЮКассу</div>
                  <div className="font-onest text-xs text-grey-500">После нажатия «Оплатить» вы перейдёте на защищённую страницу ЮКассы. Принимаем карты Visa, МИР, МастерКард, СБП и электронные кошельки.</div>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 mt-6 cursor-pointer">
              <button
                onClick={() => setAgreed(!agreed)}
                className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                  agreed ? 'bg-blue border-blue' : 'border-grey-200'
                }`}
              >
                {agreed && <Icon name="Check" size={11} className="text-white" />}
              </button>
              <span className="font-onest text-sm text-grey-500">
                Я принимаю{' '}
                <button onClick={() => onNavigate('terms')} className="text-blue underline">условия использования</button>
                {' '}и согласен с обработкой персональных данных
              </span>
            </label>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h3 className="font-syne font-bold text-grey-900 text-xl mb-5">Итог</h3>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between">
                  <span className="font-onest text-sm text-grey-500">Тариф</span>
                  <span className="font-onest text-sm font-medium text-grey-900">{selected?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-onest text-sm text-grey-500">Стоимость</span>
                  <span className="font-onest text-sm text-grey-900">{selected?.price.toLocaleString('ru')} ₽</span>
                </div>
              </div>
              <div className="border-t border-grey-200 pt-4 mb-6 flex justify-between items-center">
                <span className="font-onest font-semibold text-grey-900">Итого</span>
                <span className="font-syne font-bold text-grey-900 text-3xl">{selected?.price.toLocaleString('ru')} ₽</span>
              </div>

              {error && <p className="font-onest text-xs text-red-500 mb-3">{error}</p>}

              <button
                onClick={handlePay}
                disabled={!agreed || !email || loading}
                className="w-full py-3.5 rounded-full bg-blue text-white font-onest font-medium shadow-blue hover:bg-blue-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Icon name={loading ? 'Loader' : 'Lock'} size={16} className={loading ? 'animate-spin' : ''} />
                {loading ? 'Переходим...' : 'Оплатить'}
              </button>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Icon name="ShieldCheck" size={13} className="text-grey-500" />
                <span className="font-onest text-xs text-grey-500">Безопасная оплата через ЮКассу</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}