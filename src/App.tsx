import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import FAQPage from './pages/FAQPage';
import RefillFormPage from './pages/RefillFormPage';
import AppointmentFormPage from './pages/AppointmentFormPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Check URL for password reset flow
  useEffect(() => {
    const urlHash = window.location.hash;
    
    // Check if this is a password reset callback from Supabase
    if (urlHash.includes('type=recovery') || window.location.pathname === '/reset-password') {
      setCurrentPage('reset-password');
    }
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update URL for password reset page
    if (page === 'reset-password') {
      window.history.pushState({}, '', '/reset-password');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage />;
      case 'services':
        return <ServicesPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage />;
      case 'blog':
        return <BlogPage />;
      case 'faq':
        return <FAQPage />;
      case 'refill':
        return <RefillFormPage onNavigate={handleNavigate} />;
      case 'appointment':
        return <AppointmentFormPage onNavigate={handleNavigate} />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'cookies':
        return <CookiePolicyPage />;
      case 'terms':
        return <TermsOfUsePage />;
      case 'admin':
        return <AdminDashboard onNavigateToUsers={() => setCurrentPage('admin-users')} />;
      case 'admin-users':
        return <AdminUsersPage onNavigateBack={() => setCurrentPage('admin')} />;
      case 'reset-password':
        return <ResetPasswordPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const isAdminPage = currentPage === 'admin' || currentPage === 'admin-users' || currentPage === 'reset-password';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {!isAdminPage && <Header currentPage={currentPage} onNavigate={handleNavigate} />}
      <main>{renderPage()}</main>
      {!isAdminPage && <Footer onNavigate={handleNavigate} />}
      {!isAdminPage && <Chatbot onNavigate={handleNavigate} />}
    </div>
  );
}

export default App;
