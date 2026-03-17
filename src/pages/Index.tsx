import { useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import HomePage from './HomePage';
import ConstructorPage from './ConstructorPage';
import PaymentPage from './PaymentPage';
import CabinetPage from './CabinetPage';
import FaqPage from './FaqPage';
import ContactsPage from './ContactsPage';
import TermsPage from './TermsPage';

type Page = 'home' | 'constructor' | 'payment' | 'cabinet' | 'faq' | 'contacts' | 'terms' | 'privacy';

export default function Index() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onNavigate={navigate} />

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
