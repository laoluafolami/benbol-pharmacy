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
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import InvoiceGeneratorPage from './pages/InvoiceGeneratorPage';
import BackupRestorePage from './pages/BackupRestorePage';

function App() {
  const getPageFromHash = () => {
    const hash = window.location.hash.slice(1);
    
    // Check if this is a password reset link (has access_token and type=recovery in hash)
    if (hash.includes('access_token') && hash.includes('type=recovery')) {
      return 'reset-password';
    }
    
    // Extract page name (before any # or & characters)
    const pageName = hash.split(/[#&]/)[0];
    return pageName || 'home';
  };

  const [currentPage, setCurrentPage] = useState(getPageFromHash());

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Check URL for password reset flow
  useEffect(() => {
    const urlHash = window.location.hash;
    const pathname = window.location.pathname;
    const search = window.location.search;
    
    // Check if this is a password reset callback from Supabase
    // Supabase can send tokens in hash (#access_token=...) or query params (?access_token=...)
    if (urlHash.includes('type=recovery') || 
        urlHash.includes('access_token') || 
        search.includes('type=recovery') || 
        search.includes('access_token') ||
        pathname === '/reset-password') {
      console.log('Detected password reset flow, navigating to reset-password page');
      
      // If tokens are in query params, move them to hash for SPA routing
      if (search.includes('access_token') || search.includes('type=recovery')) {
        const searchParams = new URLSearchParams(search);
        const hashFragment = Array.from(searchParams.entries())
          .map(([key, value]) => `${key}=${value}`)
          .join('&');
        window.location.hash = `reset-password#${hashFragment}`;
      } else {
        setCurrentPage('reset-password');
      }
    }
  }, []);

  const handleNavigate = (page: string) => {
    window.location.hash = page;
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
        return <FAQPage onNavigate={handleNavigate} />;
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
        return <AdminDashboard
          onNavigateToUsers={() => setCurrentPage('admin-users')}
          onNavigateToBackup={() => setCurrentPage('backup-restore')}
          onNavigateToAnalytics={() => setCurrentPage('analytics')}
        />;
      case 'admin-users':
        return <AdminUsersPage onNavigateBack={() => setCurrentPage('admin')} />;
      case 'analytics':
        return <AdminAnalyticsPage onNavigate={() => setCurrentPage('admin')} />;
      case 'invoice':
        return <InvoiceGeneratorPage onNavigateBack={() => setCurrentPage('admin')} />;
      case 'backup-restore':
        return <BackupRestorePage onNavigateBack={() => setCurrentPage('admin')} />;
      case 'reset-password':
        return <ResetPasswordPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const isAdminPage = currentPage === 'admin' || currentPage === 'admin-users' || currentPage === 'analytics' || currentPage === 'invoice' || currentPage === 'backup-restore' || currentPage === 'reset-password';

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
