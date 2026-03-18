import { useState, useEffect } from 'react';
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
import func2url from '../../backend/func2url.json';

type Page = 'home' | 'constructor' | 'payment' | 'cabinet' | 'faq' | 'contacts' | 'terms' | 'privacy';

interface AuthUser { id: string; email: string; full_name: string }

export default function Index() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      const email = params.get('email') || '';
      const paymentId = localStorage.getItem('pending_payment_id') || '';
      const formRaw = localStorage.getItem('constructor_form');
      const formData = formRaw ? JSON.parse(formRaw) : null;
      window.history.replaceState({}, '', window.location.pathname);

      if (formData && email) {
        setPaymentProcessing(true);
        fetch(func2url['deliver-document'], {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ form_data: formData, user_email: email, payment_id: paymentId }),
        }).finally(() => {
          localStorage.removeItem('constructor_form');
          localStorage.removeItem('pending_payment_id');
          setPaymentProcessing(false);
          const savedUser = localStorage.getItem('auth_user');
          if (savedUser) setUser(JSON.parse(savedUser));
          setCurrentPage('cabinet');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    } else {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}
      <Header currentPage={currentPage} onNavigate={navigate} user={user} onLoginClick={() => setShowAuth(true)} onLogout={handleLogout} />

      {paymentProcessing && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-blue border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="font-syne font-bold text-grey-900 text-xl mb-1">Формируем заявление</p>
            <p className="font-onest text-sm text-grey-500">Отправляем документ на вашу почту...</p>
          </div>
        </div>
      )}

      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={navigate} />}
        {currentPage === 'constructor' && <ConstructorPage onNavigate={navigate} />}
        {currentPage === 'payment' && <PaymentPage onNavigate={navigate} />}
        {currentPage === 'cabinet' && <CabinetPage onNavigate={navigate} user={user} />}
        {currentPage === 'faq' && <FaqPage />}
        {currentPage === 'contacts' && <ContactsPage />}
        {(currentPage === 'terms' || currentPage === 'privacy') && <TermsPage />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}