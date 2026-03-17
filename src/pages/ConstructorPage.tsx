import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ConstructorPageProps {
  onNavigate: (page: string) => void;
}

type Step = 'court' | 'claimant' | 'order' | 'grounds' | 'preview';

interface FormData {
  // Court info
  courtName: string;
  courtAddress: string;
  courtCity: string;
  // Claimant
  fullName: string;
  birthDate: string;
  address: string;
  phone: string;
  email: string;
  // Order info
  orderNumber: string;
  orderDate: string;
  orderIssued: string;
  creditorName: string;
  debtAmount: string;
  // Grounds
  groundsType: string;
  groundsDetails: string;
}

const STEPS: { id: Step; label: string; desc: string }[] = [
  { id: 'court', label: 'Суд', desc: 'Данные суда' },
  { id: 'claimant', label: 'Заявитель', desc: 'Ваши данные' },
  { id: 'order', label: 'Приказ', desc: 'Данные приказа' },
  { id: 'grounds', label: 'Основания', desc: 'Причины отмены' },
  { id: 'preview', label: 'Итог', desc: 'Проверка' },
];

const GROUNDS = [
  { value: 'not_notified', label: 'Не был уведомлён о вынесении приказа' },
  { value: 'disagreement', label: 'Не согласен с суммой долга' },
  { value: 'debt_paid', label: 'Долг уже погашен' },
  { value: 'wrong_debtor', label: 'Я не являюсь должником' },
  { value: 'other', label: 'Иные основания' },
];

const initialForm: FormData = {
  courtName: '', courtAddress: '', courtCity: '',
  fullName: '', birthDate: '', address: '', phone: '', email: '',
  orderNumber: '', orderDate: '', orderIssued: '', creditorName: '', debtAmount: '',
  groundsType: '', groundsDetails: '',
};

export default function ConstructorPage({ onNavigate }: ConstructorPageProps) {
  const [step, setStep] = useState<Step>('court');
  const [form, setForm] = useState<FormData>(initialForm);

  const stepIndex = STEPS.findIndex(s => s.id === step);

  const update = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const next = () => {
    const idx = STEPS.findIndex(s => s.id === step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].id);
  };

  const prev = () => {
    const idx = STEPS.findIndex(s => s.id === step);
    if (idx > 0) setStep(STEPS[idx - 1].id);
  };

  const inputClass = "w-full border border-border bg-white px-3 py-2.5 font-ibm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-navy transition-colors";
  const labelClass = "block font-ibm text-xs text-muted-foreground uppercase tracking-wider mb-1.5";

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-navy py-10">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="font-ibm text-xs text-gold/70 uppercase tracking-widest mb-2">Конструктор</div>
          <h1 className="font-cormorant font-bold text-white text-3xl md:text-4xl">
            Заявление об отмене судебного приказа
          </h1>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="bg-white border-b border-border">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="flex overflow-x-auto">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => i < stepIndex || i === stepIndex ? setStep(s.id) : undefined}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors flex-shrink-0 ${
                  s.id === step
                    ? 'border-gold text-navy'
                    : i < stepIndex
                    ? 'border-transparent text-muted-foreground hover:text-navy cursor-pointer'
                    : 'border-transparent text-muted-foreground/40 cursor-default'
                }`}
              >
                <div className={`w-6 h-6 flex items-center justify-center text-xs font-ibm font-semibold flex-shrink-0 ${
                  i < stepIndex
                    ? 'bg-gold text-navy'
                    : s.id === step
                    ? 'bg-navy text-white'
                    : 'bg-border text-muted-foreground'
                }`}>
                  {i < stepIndex ? <Icon name="Check" size={12} /> : i + 1}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-ibm text-xs font-semibold">{s.label}</div>
                  <div className="font-ibm text-xs opacity-60">{s.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="container max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white border border-border p-8 animate-fade-in">

          {/* Step: Court */}
          {step === 'court' && (
            <div>
              <h2 className="font-cormorant font-bold text-navy text-2xl mb-1 decor-line">Данные суда</h2>
              <p className="font-ibm text-muted-foreground text-sm mb-8 mt-4">
                Укажите суд, который вынес судебный приказ
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass}>Наименование суда *</label>
                  <input
                    className={inputClass}
                    placeholder="Мировой судья судебного участка №1 Ленинского района"
                    value={form.courtName}
                    onChange={e => update('courtName', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Город/населённый пункт *</label>
                  <input
                    className={inputClass}
                    placeholder="Москва"
                    value={form.courtCity}
                    onChange={e => update('courtCity', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Адрес суда</label>
                  <input
                    className={inputClass}
                    placeholder="ул. Примерная, д. 1"
                    value={form.courtAddress}
                    onChange={e => update('courtAddress', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step: Claimant */}
          {step === 'claimant' && (
            <div>
              <h2 className="font-cormorant font-bold text-navy text-2xl mb-1 decor-line">Данные заявителя</h2>
              <p className="font-ibm text-muted-foreground text-sm mb-8 mt-4">
                Ваши персональные данные для заявления
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass}>ФИО полностью *</label>
                  <input
                    className={inputClass}
                    placeholder="Иванов Иван Иванович"
                    value={form.fullName}
                    onChange={e => update('fullName', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Дата рождения *</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={form.birthDate}
                    onChange={e => update('birthDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Телефон *</label>
                  <input
                    className={inputClass}
                    placeholder="+7 (900) 000-00-00"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Адрес регистрации *</label>
                  <input
                    className={inputClass}
                    placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
                    value={form.address}
                    onChange={e => update('address', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    className={inputClass}
                    placeholder="ivanov@mail.ru"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step: Order */}
          {step === 'order' && (
            <div>
              <h2 className="font-cormorant font-bold text-navy text-2xl mb-1 decor-line">Данные судебного приказа</h2>
              <p className="font-ibm text-muted-foreground text-sm mb-8 mt-4">
                Заполните из текста судебного приказа
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Номер приказа *</label>
                  <input
                    className={inputClass}
                    placeholder="2-1234/2024"
                    value={form.orderNumber}
                    onChange={e => update('orderNumber', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Дата вынесения *</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={form.orderDate}
                    onChange={e => update('orderDate', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Кем выдан (взыскатель) *</label>
                  <input
                    className={inputClass}
                    placeholder="ООО «МФО Пример», ПАО «Банк России»"
                    value={form.orderIssued}
                    onChange={e => update('orderIssued', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Наименование кредитора *</label>
                  <input
                    className={inputClass}
                    placeholder="ООО «МФО Пример»"
                    value={form.creditorName}
                    onChange={e => update('creditorName', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Сумма долга по приказу *</label>
                  <input
                    className={inputClass}
                    placeholder="25 000 рублей"
                    value={form.debtAmount}
                    onChange={e => update('debtAmount', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step: Grounds */}
          {step === 'grounds' && (
            <div>
              <h2 className="font-cormorant font-bold text-navy text-2xl mb-1 decor-line">Основания для отмены</h2>
              <p className="font-ibm text-muted-foreground text-sm mb-8 mt-4">
                Укажите причину отмены судебного приказа
              </p>
              <div className="space-y-3 mb-6">
                {GROUNDS.map(g => (
                  <label
                    key={g.value}
                    className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                      form.groundsType === g.value
                        ? 'border-navy bg-navy/5'
                        : 'border-border hover:border-navy/40'
                    }`}
                  >
                    <div className={`w-4 h-4 border-2 flex items-center justify-center flex-shrink-0 ${
                      form.groundsType === g.value ? 'border-navy' : 'border-border'
                    }`}>
                      {form.groundsType === g.value && (
                        <div className="w-2 h-2 bg-navy" />
                      )}
                    </div>
                    <input
                      type="radio"
                      className="sr-only"
                      value={g.value}
                      checked={form.groundsType === g.value}
                      onChange={() => update('groundsType', g.value)}
                    />
                    <span className="font-ibm text-sm text-foreground">{g.label}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className={labelClass}>Дополнительные сведения</label>
                <textarea
                  className={`${inputClass} resize-none h-28`}
                  placeholder="Укажите подробности, которые важны для вашего дела..."
                  value={form.groundsDetails}
                  onChange={e => update('groundsDetails', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step: Preview */}
          {step === 'preview' && (
            <div>
              <h2 className="font-cormorant font-bold text-navy text-2xl mb-1 decor-line">Проверьте данные</h2>
              <p className="font-ibm text-muted-foreground text-sm mb-8 mt-4">
                Убедитесь в правильности введённых данных перед оплатой
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: 'Суд', items: [
                      ['Наименование', form.courtName],
                      ['Город', form.courtCity],
                      ['Адрес', form.courtAddress],
                    ]
                  },
                  {
                    title: 'Заявитель', items: [
                      ['ФИО', form.fullName],
                      ['Дата рождения', form.birthDate],
                      ['Адрес', form.address],
                      ['Телефон', form.phone],
                    ]
                  },
                  {
                    title: 'Судебный приказ', items: [
                      ['Номер', form.orderNumber],
                      ['Дата', form.orderDate],
                      ['Взыскатель', form.orderIssued],
                      ['Сумма долга', form.debtAmount],
                    ]
                  },
                  {
                    title: 'Основания', items: [
                      ['Причина', GROUNDS.find(g => g.value === form.groundsType)?.label || '—'],
                      ['Детали', form.groundsDetails],
                    ]
                  },
                ].map((section, i) => (
                  <div key={i} className="border border-border p-5">
                    <div className="font-cormorant font-bold text-navy text-lg mb-3">{section.title}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {section.items.filter(([, v]) => v).map(([k, v]) => (
                        <div key={k}>
                          <div className="font-ibm text-xs text-muted-foreground uppercase tracking-wider">{k}</div>
                          <div className="font-ibm text-sm text-foreground mt-0.5">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 bg-gold/8 border border-gold/25 flex items-start gap-3">
                <Icon name="Info" size={18} className="text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-ibm font-semibold text-sm text-navy mb-1">Готово к оплате</div>
                  <div className="font-ibm text-sm text-muted-foreground">
                    После оплаты заявление будет сформировано и доступно для скачивания в форматах DOCX и PDF.
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border border-border p-5">
                <div>
                  <div className="font-ibm text-xs text-muted-foreground uppercase tracking-wider">Стоимость</div>
                  <div className="font-cormorant font-bold text-navy text-3xl mt-1">499 ₽</div>
                </div>
                <button
                  onClick={() => onNavigate('payment')}
                  className="bg-gold text-navy font-ibm font-semibold px-8 py-3 hover:bg-gold-light transition-colors flex items-center gap-2"
                >
                  <Icon name="CreditCard" size={18} />
                  Перейти к оплате
                </button>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            <button
              onClick={prev}
              disabled={stepIndex === 0}
              className="flex items-center gap-2 font-ibm text-sm text-muted-foreground hover:text-navy transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Icon name="ArrowLeft" size={16} />
              Назад
            </button>

            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div key={i} className={`progress-dot ${i <= stepIndex ? 'active' : ''}`} />
              ))}
            </div>

            {step !== 'preview' ? (
              <button
                onClick={next}
                className="flex items-center gap-2 bg-navy text-white font-ibm text-sm font-medium px-6 py-2.5 hover:bg-navy-dark transition-colors"
              >
                Далее
                <Icon name="ArrowRight" size={16} />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
