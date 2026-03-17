import { useState } from 'react';
import Icon from '@/components/ui/icon';

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

const methods = [
  { id: 'card',      label: 'Банковская карта', icon: 'CreditCard', desc: 'Visa, MasterCard, МИР' },
  { id: 'yookassa', label: 'ЮKassa',           icon: 'Wallet',     desc: 'Электронные кошельки' },
  { id: 'sbp',       label: 'СБП',              icon: 'Smartphone', desc: 'Быстрые платежи' },
];

const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
const formatDate = (v: string) => v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(?=\d)/, '$1/');

export default function PaymentPage({ onNavigate }: PaymentPageProps) {
  const [plan, setPlan] = useState('standard');
  const [method, setMethod] = useState('card');
  const [cardNum, setCardNum] = useState('');
  const [cardDate, setCardDate] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [agreed, setAgreed] = useState(false);

  const selected = plans.find(p => p.id === plan);
  const inp = "w-full rounded-xl border border-grey-200 bg-grey-50 px-4 py-3 font-onest text-sm placeholder:text-grey-500 focus:outline-none focus:border-blue focus:bg-white transition-all";
  const lbl = "block font-onest text-xs font-medium text-grey-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="bg-white border-b border-grey-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="section-chip mb-3">Оплата</div>
          <h1 className="font-syne font-bold text-grey-900 text-3xl md:text-4xl">Тарифы и оплата</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Plans */}
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
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-8">
            <h2 className="font-syne font-bold text-grey-900 text-2xl mb-6">Способ оплаты</h2>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {methods.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    method === m.id ? 'border-blue bg-blue-50' : 'border-grey-200 hover:border-blue/40'
                  }`}
                >
                  <Icon name={m.icon} fallback="CreditCard" size={22} className={`mx-auto mb-1.5 ${method === m.id ? 'text-blue' : 'text-grey-500'}`} />
                  <div className={`font-onest text-xs font-semibold ${method === m.id ? 'text-blue' : 'text-grey-900'}`}>{m.label}</div>
                  <div className="font-onest text-xs text-grey-500 mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>

            {method === 'card' && (
              <div className="space-y-5">
                <div>
                  <label className={lbl}>Номер карты *</label>
                  <input className={inp} placeholder="0000 0000 0000 0000" value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))} maxLength={19} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Срок действия *</label>
                    <input className={inp} placeholder="ММ/ГГ" value={cardDate} onChange={e => setCardDate(formatDate(e.target.value))} maxLength={5} />
                  </div>
                  <div>
                    <label className={lbl}>CVV *</label>
                    <input className={inp} placeholder="•••" type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g,'').slice(0,3))} maxLength={3} />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Имя на карте *</label>
                  <input className={inp} placeholder="IVAN IVANOV" value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} />
                </div>
              </div>
            )}

            {method !== 'card' && (
              <div className="p-8 bg-grey-50 rounded-xl text-center">
                <Icon name={method === 'sbp' ? 'QrCode' : 'ExternalLink'} fallback="Info" size={28} className="text-grey-500 mx-auto mb-3" />
                <p className="font-onest text-sm text-grey-500">
                  {method === 'yookassa'
                    ? 'После нажатия «Оплатить» вы будете перенаправлены на страницу ЮKassa.'
                    : 'После нажатия «Оплатить» вам будет показан QR-код для оплаты через СБП.'}
                </p>
              </div>
            )}

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

          {/* Summary */}
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

              <button
                disabled={!agreed}
                className="w-full py-3.5 rounded-full bg-blue text-white font-onest font-medium shadow-blue hover:bg-blue-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Icon name="Lock" size={16} />
                Оплатить
              </button>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Icon name="ShieldCheck" size={13} className="text-grey-500" />
                <span className="font-onest text-xs text-grey-500">Безопасная оплата</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}