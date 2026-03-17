import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Главная' },
  { id: 'constructor', label: 'Конструктор' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contacts', label: 'Контакты' },
];

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-navy flex items-center justify-center">
              <span className="text-gold font-cormorant font-bold text-sm">П</span>
            </div>
            <div className="text-left">
              <div className="font-cormorant font-bold text-navy text-lg leading-none">ПриказОтмена</div>
              <div className="text-[10px] text-muted-foreground font-ibm tracking-widest uppercase leading-none">Юридический сервис</div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`nav-link font-ibm text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-navy active'
                    : 'text-muted-foreground hover:text-navy'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA + Auth */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onNavigate('cabinet')}
              className={`nav-link font-ibm text-sm font-medium transition-colors ${
                currentPage === 'cabinet'
                  ? 'text-navy active'
                  : 'text-muted-foreground hover:text-navy'
              }`}
            >
              Личный кабинет
            </button>
            <button
              onClick={() => onNavigate('constructor')}
              className="bg-navy text-white font-ibm text-sm font-medium px-4 py-2 hover:bg-navy-dark transition-colors"
            >
              Создать заявление
            </button>
          </div>

          {/* Mobile menu */}
          <button
            className="md:hidden p-2 text-navy"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border animate-fade-in">
          <div className="container px-6 py-4 flex flex-col gap-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                className={`text-left font-ibm text-sm font-medium py-1 ${
                  currentPage === item.id ? 'text-navy' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { onNavigate('cabinet'); setMobileOpen(false); }}
              className="text-left font-ibm text-sm text-muted-foreground py-1"
            >
              Личный кабинет
            </button>
            <button
              onClick={() => { onNavigate('constructor'); setMobileOpen(false); }}
              className="bg-navy text-white font-ibm text-sm font-medium px-4 py-2 text-center"
            >
              Создать заявление
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
