import { useState } from 'react';
import axios from 'axios';
import Icon from '@/components/ui/icon';
import func2url from '../../backend/func2url.json';

interface ConstructorPageProps {
  onNavigate: (page: string) => void;
}

type Step = 'court' | 'claimant' | 'order' | 'grounds' | 'preview';

interface FormData {
  courtName: string; courtAddress: string; courtCity: string;
  fullName: string; birthDate: string; address: string; phone: string; email: string;
  orderNumber: string; orderDate: string; orderIssued: string; creditorName: string; debtAmount: string;
  groundsType: string; groundsDetails: string;
}

const STEPS: { id: Step; label: string; icon: string }[] = [
  { id: 'court',     label: 'Суд',        icon: 'Building2' },
  { id: 'claimant',  label: 'Заявитель',  icon: 'User' },
  { id: 'order',     label: 'Приказ',     icon: 'FileText' },
  { id: 'grounds',   label: 'Основания',  icon: 'MessageSquare' },
  { id: 'preview',   label: 'Проверка',   icon: 'CheckCircle' },
];

const GROUNDS = [
  { value: 'not_notified', label: 'Не был уведомлён о вынесении приказа' },
  { value: 'disagreement', label: 'Не согласен с суммой долга' },
  { value: 'debt_paid',    label: 'Долг уже погашен' },
  { value: 'wrong_debtor', label: 'Я не являюсь должником' },
  { value: 'other',        label: 'Иные основания' },
];

const initial: FormData = {
  courtName: '', courtAddress: '', courtCity: '',
  fullName: '', birthDate: '', address: '', phone: '', email: '',
  orderNumber: '', orderDate: '', orderIssued: '', creditorName: '', debtAmount: '',
  groundsType: '', groundsDetails: '',
};

export default function ConstructorPage({ onNavigate }: ConstructorPageProps) {
  const [step, setStep] = useState<Step>('court');
  const [form, setForm] = useState<FormData>(initial);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');

  const stepIndex = STEPS.findIndex(s => s.id === step);
  const upd = (f: keyof FormData, v: string) => setForm(p => ({ ...p, [f]: v }));

  const next = () => { if (stepIndex < STEPS.length - 1) setStep(STEPS[stepIndex + 1].id); };
  const prev = () => { if (stepIndex > 0) setStep(STEPS[stepIndex - 1].id); };

  const downloadPdf = async () => {
    setPdfLoading(true);
    setPdfError('');
    try {
      const res = await axios.post(func2url['generate-pdf'], form);
      const { pdf, filename } = res.data;
      const binary = atob(pdf);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'zayavlenie.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setPdfError('Не удалось сформировать PDF. Проверьте данные и попробуйте снова.');
    } finally {
      setPdfLoading(false);
    }
  };

  const inp = "w-full rounded-xl border border-grey-200 bg-grey-50 px-4 py-3 font-onest text-sm text-foreground placeholder:text-grey-500 focus:outline-none focus:border-blue focus:bg-white transition-all";
  const lbl = "block font-onest text-xs font-medium text-grey-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero bar */}
      <div className="bg-white border-b border-grey-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="section-chip mb-3">Конструктор</div>
          <h1 className="font-syne font-bold text-grey-900 text-3xl md:text-4xl">
            Заявление об отмене судебного приказа
          </h1>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white border-b border-grey-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex overflow-x-auto gap-0">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => i <= stepIndex ? setStep(s.id) : undefined}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-all flex-shrink-0 ${
                  s.id === step
                    ? 'border-blue text-blue'
                    : i < stepIndex
                    ? 'border-transparent text-grey-500 hover:text-grey-900 cursor-pointer'
                    : 'border-transparent text-grey-200 cursor-default'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-onest font-semibold flex-shrink-0 transition-all ${
                  i < stepIndex ? 'bg-blue text-white'
                    : s.id === step ? 'bg-blue-50 text-blue'
                    : 'bg-grey-100 text-grey-500'
                }`}>
                  {i < stepIndex ? <Icon name="Check" size={12} /> : i + 1}
                </div>
                <span className="font-onest text-sm hidden sm:block">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-card p-8 animate-fade-in">

          {step === 'court' && (
            <div>
              <h2 className="font-syne font-bold text-grey-900 text-2xl mb-1">Данные суда</h2>
              <p className="font-onest text-grey-500 text-sm mb-8">Укажите суд, который вынес судебный приказ</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={lbl}>Наименование суда *</label>
                  <input className={inp} placeholder="Мировой судья судебного участка №1 Ленинского района" value={form.courtName} onChange={e => upd('courtName', e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Город *</label>
                  <input className={inp} placeholder="Москва" value={form.courtCity} onChange={e => upd('courtCity', e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Адрес суда</label>
                  <input className={inp} placeholder="ул. Примерная, д. 1" value={form.courtAddress} onChange={e => upd('courtAddress', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 'claimant' && (
            <div>
              <h2 className="font-syne font-bold text-grey-900 text-2xl mb-1">Данные заявителя</h2>
              <p className="font-onest text-grey-500 text-sm mb-8">Ваши персональные данные для заявления</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={lbl}>ФИО полностью *</label>
                  <input className={inp} placeholder="Иванов Иван Иванович" value={form.fullName} onChange={e => upd('fullName', e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Дата рождения *</label>
                  <input type="date" className={inp} value={form.birthDate} onChange={e => upd('birthDate', e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Телефон *</label>
                  <input className={inp} placeholder="+7 (900) 000-00-00" value={form.phone} onChange={e => upd('phone', e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className={lbl}>Адрес регистрации *</label>
                  <input className={inp} placeholder="г. Москва, ул. Примерная, д. 1, кв. 1" value={form.address} onChange={e => upd('address', e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Email</label>
                  <input type="email" className={inp} placeholder="ivanov@mail.ru" value={form.email} onChange={e => upd('email', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 'order' && (
            <div>
              <h2 className="font-syne font-bold text-grey-900 text-2xl mb-1">Данные судебного приказа</h2>
              <p className="font-onest text-grey-500 text-sm mb-8">Заполните из текста судебного приказа</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={lbl}>Номер приказа *</label>
                  <input className={inp} placeholder="2-1234/2024" value={form.orderNumber} onChange={e => upd('orderNumber', e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Дата вынесения *</label>
                  <input type="date" className={inp} value={form.orderDate} onChange={e => upd('orderDate', e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className={lbl}>Взыскатель *</label>
                  <input className={inp} placeholder="ООО «МФО Пример»" value={form.orderIssued} onChange={e => upd('orderIssued', e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Наименование кредитора *</label>
                  <input className={inp} placeholder="ООО «МФО Пример»" value={form.creditorName} onChange={e => upd('creditorName', e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Сумма долга *</label>
                  <input className={inp} placeholder="25 000 рублей" value={form.debtAmount} onChange={e => upd('debtAmount', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 'grounds' && (
            <div>
              <h2 className="font-syne font-bold text-grey-900 text-2xl mb-1">Основания для отмены</h2>
              <p className="font-onest text-grey-500 text-sm mb-8">Укажите причину отмены судебного приказа</p>
              <div className="space-y-2.5 mb-6">
                {GROUNDS.map(g => (
                  <label
                    key={g.value}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      form.groundsType === g.value
                        ? 'border-blue bg-blue-50'
                        : 'border-grey-200 hover:border-blue/40 hover:bg-grey-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      form.groundsType === g.value ? 'border-blue' : 'border-grey-200'
                    }`}>
                      {form.groundsType === g.value && <div className="w-2.5 h-2.5 rounded-full bg-blue" />}
                    </div>
                    <input type="radio" className="sr-only" value={g.value} checked={form.groundsType === g.value} onChange={() => upd('groundsType', g.value)} />
                    <span className="font-onest text-sm text-grey-900">{g.label}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className={lbl}>Дополнительные сведения</label>
                <textarea
                  className={`${inp} resize-none h-28`}
                  placeholder="Укажите подробности, которые важны для вашего дела..."
                  value={form.groundsDetails}
                  onChange={e => upd('groundsDetails', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div>
              <h2 className="font-syne font-bold text-grey-900 text-2xl mb-1">Проверьте данные</h2>
              <p className="font-onest text-grey-500 text-sm mb-8">Убедитесь в правильности данных перед оплатой</p>

              <div className="space-y-4">
                {[
                  { title: 'Суд', items: [['Наименование', form.courtName], ['Город', form.courtCity], ['Адрес', form.courtAddress]] },
                  { title: 'Заявитель', items: [['ФИО', form.fullName], ['Дата рождения', form.birthDate], ['Адрес', form.address], ['Телефон', form.phone]] },
                  { title: 'Судебный приказ', items: [['Номер', form.orderNumber], ['Дата', form.orderDate], ['Взыскатель', form.orderIssued], ['Сумма', form.debtAmount]] },
                  { title: 'Основания', items: [['Причина', GROUNDS.find(g => g.value === form.groundsType)?.label || '—'], ['Детали', form.groundsDetails]] },
                ].map((sec, i) => (
                  <div key={i} className="bg-grey-50 rounded-xl p-5">
                    <div className="font-onest font-semibold text-grey-900 text-sm mb-3">{sec.title}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {sec.items.filter(([, v]) => v).map(([k, v]) => (
                        <div key={k}>
                          <div className="font-onest text-xs text-grey-500 uppercase tracking-wider">{k}</div>
                          <div className="font-onest text-sm text-grey-900 mt-0.5">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* PDF download */}
              <div className="mt-6 bg-white rounded-2xl border border-grey-200 p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div>
                    <div className="font-onest font-semibold text-grey-900 text-sm mb-1">Предварительный просмотр</div>
                    <p className="font-onest text-sm text-grey-500">Скачайте черновик заявления в PDF для проверки</p>
                  </div>
                  <button
                    onClick={downloadPdf}
                    disabled={pdfLoading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-grey-200 text-grey-800 font-onest text-sm font-medium hover:border-blue hover:text-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    {pdfLoading
                      ? <><Icon name="Loader" size={16} className="animate-spin" />Генерация...</>
                      : <><Icon name="FileDown" size={16} />Скачать черновик PDF</>
                    }
                  </button>
                </div>
                {pdfError && (
                  <div className="mt-3 p-3 bg-red-50 rounded-xl text-red-600 font-onest text-xs">{pdfError}</div>
                )}
              </div>

              <div className="mt-4 bg-blue rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <div className="font-onest text-xs text-white/70 uppercase tracking-wider">Стоимость полного тарифа</div>
                  <div className="font-syne font-bold text-white text-4xl mt-1">499 <span className="text-2xl">₽</span></div>
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem('constructor_form', JSON.stringify(form));
                    onNavigate('payment');
                  }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gold text-grey-900 font-onest font-semibold hover:bg-gold-light transition-colors"
                >
                  <Icon name="CreditCard" size={18} />
                  Перейти к оплате
                </button>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-grey-200">
            <button
              onClick={prev}
              disabled={stepIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full font-onest text-sm text-grey-500 hover:bg-grey-100 hover:text-grey-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Icon name="ArrowLeft" size={16} />
              Назад
            </button>

            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === stepIndex ? 'w-6 bg-blue' : i < stepIndex ? 'w-3 bg-blue/40' : 'w-3 bg-grey-200'
                  }`}
                />
              ))}
            </div>

            {step !== 'preview' && (
              <button
                onClick={next}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-blue text-white font-onest text-sm font-medium shadow-blue hover:bg-blue-dark transition-colors"
              >
                Далее
                <Icon name="ArrowRight" size={16} />
              </button>
            )}
            {step === 'preview' && <div />}
          </div>
        </div>
      </div>
    </div>
  );
}