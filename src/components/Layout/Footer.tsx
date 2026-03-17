interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const cols = [
    {
      title: 'Сервис',
      links: [
        { id: 'constructor', label: 'Конструктор заявлений' },
        { id: 'payment', label: 'Тарифы' },
        { id: 'faq', label: 'FAQ' },
        { id: 'contacts', label: 'Контакты' },
      ],
    },
    {
      title: 'Правовое',
      links: [
        { id: 'terms', label: 'Условия использования' },
        { id: 'privacy', label: 'Конфиденциальность' },
        { id: 'cabinet', label: 'Личный кабинет' },
      ],
    },
  ];

  return (
    <footer className="bg-grey-900 text-white/70">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-blue flex items-center justify-center">
                <span className="text-white font-bold text-sm">П</span>
              </div>
              <span className="font-syne font-bold text-white text-xl">ПриказОтмена</span>
            </div>
            <p className="font-onest text-sm text-white/50 leading-relaxed max-w-xs">
              Автоматическое создание заявлений об отмене судебных приказов. Быстро, надёжно, законно.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center hover:bg-white/14 transition-colors cursor-pointer">
                <span className="text-sm">📧</span>
              </div>
              <div>
                <div className="font-onest text-xs text-white/35 uppercase tracking-wider">Поддержка</div>
                <div className="font-onest text-sm text-white/70 mt-0.5">support@prikazotmena.ru</div>
              </div>
            </div>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <div className="font-onest text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.id}>
                    <button
                      onClick={() => onNavigate(link.id)}
                      className="font-onest text-sm text-white/55 hover:text-gold transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-onest text-xs text-white/30">© 2024 ПриказОтмена. Все права защищены.</p>
          <p className="font-onest text-xs text-white/30 text-center">
            Шаблоны документов. Не является юридической консультацией.
          </p>
        </div>
      </div>
    </footer>
  );
}