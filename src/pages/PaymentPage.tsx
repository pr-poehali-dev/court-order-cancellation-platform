import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface PaymentPageProps {
  onNavigate: (page: string) => void;
}

const plans = [
  {
    id: 'basic',
    name: 'Базовый',
    price: 499,
    features: [
      'Одно заявление',
      'Форматы DOCX и PDF',
      'Проверка корректности',
      'Доступ 30 дней',
    ],
    popular: false,
  },
  {
    id: 'standard',
    name: 'Стандарт',
    price: 1490,
    features: [
      '5 заявлений',
      'Форматы DOCX и PDF',
      'Проверка корректности',
      'Доступ 90 дней',
      'Email-уведомления',
      'Приоритетная поддержка',
    ],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Профессиональный',
    price: 3990,
    features: [
      'Неограниченно заявлений',
      'Форматы DOCX и PDF',
      'Проверка корректности',
      'Доступ 1 год',
      'Email и SMS уведомления',
      'Приоритетная поддержка',
      'Личный консультант',
    ],
    popular: false,
  },
];

const paymentMethods = [
  { id: 'card', label: 'Банковская карта', icon: 'CreditCard', desc: 'Visa, MasterCard, МИР' },
  { id: 'yookassa', label: 'ЮKassa', icon: 'Wallet', desc: 'Электронные кошельки' },
  { id: 'sbp', label: 'СБП', icon: 'Smartphone', desc: 'Быстрые платежи' },
];

export default function PaymentPage({ onNavigate }: PaymentPageProps) {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [cardNum, setCardNum] = useState('');
  const [cardDate, setCardDate] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [agreed, setAgreed] = useState(false);

  const plan = plans.find(p => p.id === selectedPlan);

  const formatCard = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

  const formatDate = (val: string) =>
    val.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(?=\d)/, '$1/');

  const inputClass = "w-full border border-border bg-white px-3 py-2.5 font-ibm text-sm placeholder:text-muted-foreground focus:outline-none focus:border-navy transition-colors";
  const labelClass = "block font-ibm text-xs text-muted-foreground uppercase tracking-wider mb-1.5";

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="bg-navy py-10">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="font-ibm text-xs text-gold/70 uppercase tracking-widest mb-2">Оплата</div>
          <h1 className="font-cormorant font-bold text-white text-3xl md:text-4xl">
            Тарифы и оплата
          </h1>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-6 py-12">
        {/* Plans */}
        <div className="mb-12">
          <h2 className="font-cormorant font-bold text-navy text-2xl mb-6 decor-line">Выберите тариф</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className={`text-left p-6 border-2 transition-all hover-scale relative ${
                  selectedPlan === p.id
                    ? 'border-navy bg-white'
                    : 'border-border bg-white hover:border-navy/30'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy font-ibm text-xs font-semibold px-3 py-1">
                    Популярный
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className="font-cormorant font-bold text-navy text-xl">{p.name}</div>
                  <div className={`w-5 h-5 border-2 flex items-center justify-center ${
                    selectedPlan === p.id ? 'border-navy' : 'border-border'
                  }`}>
                    {selectedPlan === p.id && <div className="w-2.5 h-2.5 bg-navy" />}
                  </div>
                </div>
                <div className="font-cormorant font-bold text-navy text-4xl mb-4">
                  {p.price.toLocaleString('ru')} <span className="text-xl font-ibm font-normal">₽</span>
                </div>
                <ul className="space-y-2">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Icon name="Check" size={14} className="text-gold flex-shrink-0 mt-0.5" />
                      <span className="font-ibm text-sm text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment form */}
          <div className="lg:col-span-2 bg-white border border-border p-8">
            <h2 className="font-cormorant font-bold text-navy text-2xl mb-6 decor-line">Способ оплаты</h2>

            {/* Method selector */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {paymentMethods.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  className={`p-3 border text-center transition-colors ${
                    selectedMethod === m.id ? 'border-navy bg-navy/5' : 'border-border hover:border-navy/30'
                  }`}
                >
                  <Icon name={m.icon} fallback="CreditCard" size={20} className={`mx-auto mb-1 ${selectedMethod === m.id ? 'text-navy' : 'text-muted-foreground'}`} />
                  <div className={`font-ibm text-xs font-semibold ${selectedMethod === m.id ? 'text-navy' : 'text-muted-foreground'}`}>
                    {m.label}
                  </div>
                  <div className="font-ibm text-xs text-muted-foreground/60">{m.desc}</div>
                </button>
              ))}
            </div>

            {selectedMethod === 'card' && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Номер карты *</label>
                  <input
                    className={inputClass}
                    placeholder="0000 0000 0000 0000"
                    value={cardNum}
                    onChange={e => setCardNum(formatCard(e.target.value))}
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Срок действия *</label>
                    <input
                      className={inputClass}
                      placeholder="ММ/ГГ"
                      value={cardDate}
                      onChange={e => setCardDate(formatDate(e.target.value))}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>CVV *</label>
                    <input
                      className={inputClass}
                      placeholder="•••"
                      type="password"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Имя держателя *</label>
                  <input
                    className={inputClass}
                    placeholder="IVAN IVANOV"
                    value={cardName}
                    onChange={e => setCardName(e.target.value.toUpperCase())}
                  />
                </div>
              </div>
            )}

            {selectedMethod === 'yookassa' && (
              <div className="p-6 bg-secondary border border-border text-center">
                <Icon name="ExternalLink" size={24} className="text-muted-foreground mx-auto mb-3" />
                <p className="font-ibm text-sm text-muted-foreground">
                  После нажатия «Оплатить» вы будете перенаправлены на страницу ЮKassa для завершения оплаты.
                </p>
              </div>
            )}

            {selectedMethod === 'sbp' && (
              <div className="p-6 bg-secondary border border-border text-center">
                <Icon name="QrCode" size={24} className="text-muted-foreground mx-auto mb-3" />
                <p className="font-ibm text-sm text-muted-foreground">
                  После нажатия «Оплатить» вам будет показан QR-код для оплаты через систему быстрых платежей.
                </p>
              </div>
            )}

            <div className="mt-6 flex items-start gap-3">
              <button
                onClick={() => setAgreed(!agreed)}
                className={`w-4 h-4 border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                  agreed ? 'bg-navy border-navy' : 'border-border'
                }`}
              >
                {agreed && <Icon name="Check" size={10} className="text-white" />}
              </button>
              <label className="font-ibm text-sm text-muted-foreground">
                Я принимаю{' '}
                <button onClick={() => onNavigate('terms')} className="text-navy underline">
                  условия использования
                </button>{' '}
                и согласен с обработкой персональных данных
              </label>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white border border-border p-6 sticky top-24">
              <h3 className="font-cormorant font-bold text-navy text-xl mb-5">Итог заказа</h3>
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between">
                  <span className="font-ibm text-sm text-muted-foreground">Тариф</span>
                  <span className="font-ibm text-sm font-semibold text-navy">{plan?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-ibm text-sm text-muted-foreground">Стоимость</span>
                  <span className="font-ibm text-sm text-foreground">{plan?.price.toLocaleString('ru')} ₽</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-ibm text-sm text-muted-foreground">НДС (20%)</span>
                  <span className="font-ibm text-sm text-foreground">
                    {Math.round((plan?.price || 0) * 0.2).toLocaleString('ru')} ₽
                  </span>
                </div>
              </div>
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-ibm font-semibold text-navy">Итого</span>
                  <span className="font-cormorant font-bold text-navy text-2xl">
                    {plan?.price.toLocaleString('ru')} ₽
                  </span>
                </div>
              </div>

              <button
                disabled={!agreed}
                className="w-full bg-gold text-navy font-ibm font-semibold py-3.5 hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Icon name="Lock" size={16} />
                Оплатить
              </button>

              <div className="flex items-center justify-center gap-2 mt-4">
                <Icon name="ShieldCheck" size={14} className="text-muted-foreground" />
                <span className="font-ibm text-xs text-muted-foreground">Безопасная оплата</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
