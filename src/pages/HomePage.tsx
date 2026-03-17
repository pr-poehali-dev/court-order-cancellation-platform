import Icon from '@/components/ui/icon';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const stats = [
  { value: '15 000+', label: 'Заявлений создано' },
  { value: '98%', label: 'Принято судами' },
  { value: '10 мин', label: 'Среднее время заполнения' },
  { value: '24/7', label: 'Доступность сервиса' },
];

const steps = [
  {
    num: '01',
    icon: 'FileText',
    title: 'Заполните форму',
    desc: 'Введите данные судебного приказа и ваши личные данные в удобном конструкторе.'
  },
  {
    num: '02',
    icon: 'CreditCard',
    title: 'Оплатите',
    desc: 'Безопасная оплата через Stripe или ЮKassa. Стоимость от 499 ₽.'
  },
  {
    num: '03',
    icon: 'Download',
    title: 'Скачайте документ',
    desc: 'Получите готовое заявление в формате DOCX и PDF для подачи в суд.'
  },
  {
    num: '04',
    icon: 'Send',
    title: 'Подайте в суд',
    desc: 'Подайте заявление лично, по почте или через систему ГАС Правосудие.'
  },
];

const features = [
  { icon: 'Shield', title: 'Юридически верные шаблоны', desc: 'Документы соответствуют требованиям ГПК РФ и АПК РФ' },
  { icon: 'Zap', title: 'Автоматическое заполнение', desc: 'Форма автоматически подставляет правильные формулировки' },
  { icon: 'Bell', title: 'Уведомления о статусе', desc: 'SMS и email-уведомления о каждом шаге процесса' },
  { icon: 'Lock', title: 'Защита данных', desc: 'Все данные зашифрованы и хранятся на защищённых серверах' },
  { icon: 'FileCheck', title: 'Проверка перед выдачей', desc: 'Автоматическая проверка полноты и корректности документа' },
  { icon: 'History', title: 'История заявлений', desc: 'Все ваши заявления сохраняются в личном кабинете' },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 60px,
              rgba(255,255,255,0.3) 60px,
              rgba(255,255,255,0.3) 61px
            ), repeating-linear-gradient(
              90deg,
              transparent,
              transparent 60px,
              rgba(255,255,255,0.3) 60px,
              rgba(255,255,255,0.3) 61px
            )`
          }} />
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/3 to-transparent" />

        <div className="container max-w-6xl mx-auto px-6 py-24 md:py-32 relative">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 px-3 py-1 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="font-ibm text-xs text-gold/90 tracking-wider uppercase">
                Юридический сервис
              </span>
            </div>

            <h1 className="font-cormorant font-bold text-white text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
              Отмена судебного<br />
              <span className="text-gold italic">приказа</span> — просто
            </h1>

            <p className="font-ibm text-white/70 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
              Заполните форму онлайн, оплатите и получите готовое заявление. Без юристов, без очередей — документ за 10 минут.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate('constructor')}
                className="bg-gold text-navy font-ibm font-semibold px-8 py-3.5 hover:bg-gold-light transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="FileText" size={18} />
                Создать заявление
              </button>
              <button
                onClick={() => onNavigate('faq')}
                className="border border-white/30 text-white font-ibm font-medium px-8 py-3.5 hover:border-white/60 transition-colors"
              >
                Как это работает?
              </button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10">
          <div className="container max-w-6xl mx-auto px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center md:text-left">
                  <div className="font-cormorant font-bold text-gold text-3xl">{stat.value}</div>
                  <div className="font-ibm text-white/50 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="font-ibm text-xs text-gold uppercase tracking-widest mb-3">Процесс</div>
            <h2 className="font-cormorant font-bold text-navy text-4xl md:text-5xl decor-line-center">
              Четыре шага до результата
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative bg-background border border-border p-6 hover-scale">
                <span className="step-number">{step.num}</span>
                <div className="w-10 h-10 bg-navy flex items-center justify-center mb-4 relative z-10">
                  <Icon name={step.icon} fallback="FileText" size={18} className="text-gold" />
                </div>
                <h3 className="font-cormorant font-bold text-navy text-xl mb-2">{step.title}</h3>
                <p className="font-ibm text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="font-ibm text-xs text-gold uppercase tracking-widest mb-3">Преимущества</div>
            <h2 className="font-cormorant font-bold text-navy text-4xl md:text-5xl decor-line-center">
              Почему выбирают нас
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white border border-border p-6 hover-scale group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/10 transition-colors">
                    <Icon name={f.icon} fallback="CheckCircle" size={18} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-ibm font-semibold text-navy text-sm mb-1">{f.title}</h3>
                    <p className="font-ibm text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-navy">
        <div className="container max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-cormorant font-bold text-white text-4xl md:text-5xl mb-4">
            Готовы отменить судебный приказ?
          </h2>
          <p className="font-ibm text-white/60 text-base mb-8 max-w-md mx-auto">
            Начните прямо сейчас — заявление будет готово через 10 минут
          </p>
          <button
            onClick={() => onNavigate('constructor')}
            className="bg-gold text-navy font-ibm font-semibold px-10 py-4 hover:bg-gold-light transition-colors inline-flex items-center gap-2"
          >
            <Icon name="ArrowRight" size={18} />
            Начать оформление
          </button>
        </div>
      </section>
    </div>
  );
}