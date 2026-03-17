import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Главная' },
  { id: 'constructor', label: 'Конструктор' },
  { id: 'payment', label: 'Тарифы' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contacts', label: 'Контакты' },
];

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-grey-200">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue flex items-center justify-center shadow-blue">
            <Icon name="Scale" size={16} className="text-white" />
          </div>
          <span className="font-cormorant font-bold text-grey-900 text-xl leading-none">
            ПриказОтмена
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3.5 py-2 rounded-full font-ibm text-sm transition-all ${
                currentPage === item.id
                  ? 'bg-blue-50 text-blue font-medium'
                  : 'text-grey-500 hover:text-grey-900 hover:bg-grey-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => onNavigate('cabinet')}
            className={`px-3.5 py-2 rounded-full font-ibm text-sm transition-all ${
              currentPage === 'cabinet'
                ? 'bg-blue-50 text-blue font-medium'
                : 'text-grey-500 hover:text-grey-900 hover:bg-grey-100'
            }`}
          >
            Кабинет
          </button>
          <button
            onClick={() => onNavigate('constructor')}
            className="px-4 py-2 rounded-full bg-blue text-white font-ibm text-sm font-medium shadow-blue hover:bg-blue-dark transition-colors"
          >
            Создать заявление
          </button>
        </div>

        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-grey-100 transition-colors text-grey-800"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Icon name={mobileOpen ? 'X' : 'Menu'} size={20} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-grey-200 animate-fade-in">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
            {[...navItems, { id: 'cabinet', label: 'Личный кабинет' }].map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                className={`text-left px-4 py-2.5 rounded-xl font-ibm text-sm transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue font-medium'
                    : 'text-grey-500 hover:bg-grey-100 hover:text-grey-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { onNavigate('constructor'); setMobileOpen(false); }}
              className="mt-2 px-4 py-2.5 rounded-xl bg-blue text-white font-ibm text-sm font-medium text-center"
            >
              Создать заявление
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
