import { useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import AuthModal from '@/components/AuthModal';
import HomePage from './HomePage';
import ConstructorPage from './ConstructorPage';
import PaymentPage from './PaymentPage';
import CabinetPage from './CabinetPage';
import FaqPage from './FaqPage';
import ContactsPage from './ContactsPage';
import TermsPage from './TermsPage';

type Page = 'home' | 'constructor' | 'payment' | 'cabinet' | 'faq' | 'contacts' | 'terms' | 'privacy';

interface AuthUser { id: string; email: string; full_name: string }

export default function Index() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const navigate = (page: string) => {
    if (page === 'cabinet' && !user) {
      setShowAuth(true);
      return;
    }
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (u: AuthUser, token: string) => {
    setUser(u);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(u));
    setShowAuth(false);
    setCurrentPage('cabinet');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}
      <Header currentPage={currentPage} onNavigate={navigate} user={user} onLoginClick={() => setShowAuth(true)} onLogout={handleLogout} />

      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={navigate} />}
        {currentPage === 'constructor' && <ConstructorPage onNavigate={navigate} />}
        {currentPage === 'payment' && <PaymentPage onNavigate={navigate} />}
        {currentPage === 'cabinet' && <CabinetPage onNavigate={navigate} />}
        {currentPage === 'faq' && <FaqPage />}
        {currentPage === 'contacts' && <ContactsPage />}
        {(currentPage === 'terms' || currentPage === 'privacy') && <TermsPage />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}