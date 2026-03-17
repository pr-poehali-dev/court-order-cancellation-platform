interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-navy text-white/80">
      <div className="container max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gold flex items-center justify-center">
                <span className="text-navy font-cormorant font-bold text-sm">П</span>
              </div>
              <span className="font-cormorant font-bold text-white text-xl">ПриказОтмена</span>
            </div>
            <p className="font-ibm text-sm text-white/60 leading-relaxed max-w-xs">
              Автоматическое создание юридически грамотных заявлений об отмене судебных приказов. Быстро, надёжно, законно.
            </p>
            <div className="flex gap-4 mt-6">
              <div className="w-1 h-8 bg-gold opacity-60" />
              <div>
                <div className="font-ibm text-xs text-white/40 uppercase tracking-wider">Поддержка</div>
                <div className="font-ibm text-sm text-white/80 mt-1">support@prikazotmena.ru</div>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="font-cormorant text-gold text-lg mb-4">Сервис</div>
            <ul className="space-y-2">
              {[
                { id: 'constructor', label: 'Конструктор заявлений' },
                { id: 'payment', label: 'Тарифы и оплата' },
                { id: 'faq', label: 'Часто задаваемые вопросы' },
                { id: 'contacts', label: 'Контакты' },
              ].map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="font-ibm text-sm text-white/60 hover:text-gold transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-cormorant text-gold text-lg mb-4">Правовое</div>
            <ul className="space-y-2">
              {[
                { id: 'terms', label: 'Условия использования' },
                { id: 'privacy', label: 'Политика конфиденциальности' },
                { id: 'cabinet', label: 'Личный кабинет' },
              ].map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="font-ibm text-sm text-white/60 hover:text-gold transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-ibm text-xs text-white/40">
            © 2024 ПриказОтмена. Все права защищены.
          </p>
          <p className="font-ibm text-xs text-white/40 text-center">
            Сервис предоставляет шаблоны документов. Не является юридической консультацией.
          </p>
        </div>
      </div>
    </footer>
  );
}
