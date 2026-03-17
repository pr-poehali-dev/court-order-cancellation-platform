import Icon from '@/components/ui/icon';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const stats = [
  { value: '15 000+', label: 'Заявлений создано' },
  { value: '98%', label: 'Принято судами' },
  { value: '10 мин', label: 'Среднее время' },
  { value: '24/7', label: 'Доступность' },
];

const steps = [
  { num: '01', icon: 'FileText', title: 'Заполните форму', desc: 'Введите данные приказа и свои личные данные в удобном пошаговом конструкторе.' },
  { num: '02', icon: 'CreditCard', title: 'Оплатите', desc: 'Безопасная оплата через Stripe или ЮKassa. Стоимость от 499 ₽.' },
  { num: '03', icon: 'FileDown', title: 'Скачайте PDF', desc: 'Получите готовое юридически верное заявление в формате PDF.' },
  { num: '04', icon: 'Send', title: 'Подайте в суд', desc: 'Лично, почтой или через ГАС Правосудие.' },
];

const features = [
  { icon: 'Shield', title: 'Юридически верные шаблоны', desc: 'Соответствует требованиям ГПК РФ и АПК РФ' },
  { icon: 'Zap', title: 'Автоматическое заполнение', desc: 'Форма подставляет правильные формулировки' },
  { icon: 'Bell', title: 'Уведомления о статусе', desc: 'SMS и email на каждом шаге' },
  { icon: 'Lock', title: 'Защита данных', desc: 'Данные зашифрованы, соответствие 152-ФЗ' },
  { icon: 'FileCheck', title: 'Проверка перед выдачей', desc: 'Автоматическая проверка полноты документа' },
  { icon: 'History', title: 'История в кабинете', desc: 'Все заявления сохраняются в личном кабинете' },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="mesh-bg min-h-[92vh] flex items-center">
        <div className="max-w-6xl mx-auto px-6 py-24 w-full">
          <div className="max-w-2xl animate-fade-in">
            <div className="section-chip mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue inline-block" />
              Юридический сервис
            </div>

            <h1 className="font-cormorant font-bold text-grey-900 text-5xl md:text-6xl lg:text-[72px] leading-[1.05] mb-6">
              Отмените судебный<br />
              приказ{' '}
              <span className="text-blue italic">онлайн</span>
            </h1>

            <p className="font-ibm text-grey-500 text-lg leading-relaxed mb-10 max-w-md">
              Заполните форму, оплатите и получите готовое заявление. Без юристов и очередей — документ за 10 минут.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate('constructor')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-blue text-white font-ibm font-medium shadow-blue hover:bg-blue-dark transition-colors"
              >
                <Icon name="FileText" size={18} />
                Создать заявление
              </button>
              <button
                onClick={() => onNavigate('faq')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white border border-grey-200 text-grey-800 font-ibm font-medium hover:border-grey-500 transition-colors shadow-card"
              >
                Как это работает?
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="glass rounded-2xl px-5 py-4">
                <div className="font-cormorant font-bold text-blue text-3xl">{s.value}</div>
                <div className="font-ibm text-grey-500 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-chip mb-4">Процесс</div>
            <h2 className="font-cormorant font-bold text-grey-900 text-4xl md:text-5xl">
              Четыре шага до результата
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <div key={i} className="relative bg-grey-50 rounded-2xl p-6 hover-lift">
                <span className="absolute top-3 right-5 font-cormorant font-bold text-5xl text-grey-200 leading-none pointer-events-none select-none">
                  {step.num}
                </span>
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <Icon name={step.icon} fallback="FileText" size={20} className="text-blue" />
                </div>
                <h3 className="font-ibm font-semibold text-grey-900 text-base mb-2">{step.title}</h3>
                <p className="font-ibm text-grey-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-chip gold mb-4">Преимущества</div>
            <h2 className="font-cormorant font-bold text-grey-900 text-4xl md:text-5xl">
              Почему выбирают нас
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-card hover-lift flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center flex-shrink-0">
                  <Icon name={f.icon} fallback="CheckCircle" size={18} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-ibm font-semibold text-grey-900 text-sm mb-1">{f.title}</h3>
                  <p className="font-ibm text-grey-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-blue rounded-3xl px-10 py-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 50%, white 0%, transparent 70%)' }} />
            <h2 className="font-cormorant font-bold text-white text-4xl md:text-5xl mb-4 relative">
              Готовы отменить судебный приказ?
            </h2>
            <p className="font-ibm text-white/70 text-base mb-8 max-w-md mx-auto relative">
              Начните прямо сейчас — заявление будет готово через 10 минут
            </p>
            <button
              onClick={() => onNavigate('constructor')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gold text-grey-900 font-ibm font-semibold hover:bg-gold-light transition-colors relative shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
            >
              Начать оформление
              <Icon name="ArrowRight" size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
