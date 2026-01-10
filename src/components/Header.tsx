import { Menu, X, Phone, Moon, Sun, Clock } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About Us', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Health Resources', id: 'blog' },
    { name: 'FAQ', id: 'faq' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-200 border-b border-gray-200 dark:border-gray-800">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-700 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Mon-Sat: 8AM-8PM | Sun: 9AM-5PM</span>
                <span className="sm:hidden">Open Daily</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <a href="tel:09167858304" className="font-semibold hover:text-yellow-300 transition-colors">
                  09167858304
                </a>
              </div>
              <button
                onClick={() => handleNavigate('admin')}
                className="bg-white text-teal-600 px-4 py-1 rounded-lg font-semibold hover:bg-yellow-300 transition-colors text-xs sm:text-sm"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavigate('home')}
          >
            <div className="relative">
              <img
                src="/image.png"
                alt="Benbol Global Services Ltd"
                className="h-20 w-auto transition-transform group-hover:scale-105"
              />
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform rounded-full"></div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`group relative px-4 py-2 font-bold text-sm uppercase tracking-wide transition-all duration-300 rounded-2xl overflow-hidden ${
                  currentPage === item.id
                    ? 'text-white shadow-2xl transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:text-white hover:scale-105 hover:shadow-xl'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 transition-all duration-500 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 opacity-100'
                    : 'bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100'
                }`}></div>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Floating Particles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0ms' }}></div>
                  <div className="absolute top-2 right-3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '200ms' }}></div>
                  <div className="absolute bottom-2 left-4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '400ms' }}></div>
                </div>
                
                {/* Glass Morphism Overlay */}
                <div className={`absolute inset-0 backdrop-blur-sm border border-white/20 rounded-2xl transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-white/10 shadow-inner'
                    : 'bg-white/5 group-hover:bg-white/10'
                }`}></div>
                
                {/* Text Content */}
                <span className="relative z-10 flex items-center space-x-2">
                  <span>{item.name}</span>
                  {currentPage === item.id && (
                    <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                  )}
                </span>
                
                {/* Bottom Glow */}
                {currentPage === item.id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent rounded-full animate-pulse"></div>
                )}
                
                {/* Hover Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-30 blur-sm transition-all duration-300 -z-10"></div>
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="group relative p-2 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 transition-all duration-300 hover:scale-110 hover:shadow-xl overflow-hidden"
              aria-label="Toggle theme"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative z-10">
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-gray-700 group-hover:text-purple-600 transition-colors" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                )}
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-sm transition-all duration-300 -z-10"></div>
            </button>
            
            <button
              onClick={() => handleNavigate('appointment')}
              className="group relative bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 text-white px-6 py-2 rounded-2xl font-bold text-sm uppercase tracking-wide hover:shadow-2xl hover:scale-110 transition-all duration-300 overflow-hidden"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Floating Particles */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-1 left-3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0ms' }}></div>
                <div className="absolute top-2 right-4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '300ms' }}></div>
                <div className="absolute bottom-2 left-6 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '600ms' }}></div>
              </div>
              
              {/* Glass Morphism Overlay */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl"></div>
              
              {/* Text Content */}
              <span className="relative z-10 flex items-center space-x-2">
                <span>Book Now</span>
                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              </span>
              
              {/* Outer Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-40 blur-lg transition-all duration-500 -z-10"></div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </button>
            <button
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-6 space-y-3 animate-fade-in">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`group relative block w-full text-left px-6 py-4 rounded-2xl font-bold transition-all duration-300 overflow-hidden ${
                  currentPage === item.id
                    ? 'text-white shadow-xl transform scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:text-white hover:scale-105 hover:shadow-lg'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 transition-all duration-500 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 opacity-100'
                    : 'bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100'
                }`}></div>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Glass Morphism Overlay */}
                <div className={`absolute inset-0 backdrop-blur-sm border border-white/20 rounded-2xl transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-white/10 shadow-inner'
                    : 'bg-white/5 group-hover:bg-white/10'
                }`}></div>
                
                {/* Text Content */}
                <span className="relative z-10 flex items-center justify-between">
                  <span>{item.name}</span>
                  {currentPage === item.id && (
                    <div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
                  )}
                </span>
                
                {/* Outer Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-sm transition-all duration-300 -z-10"></div>
              </button>
            ))}
            
            <button
              onClick={() => handleNavigate('appointment')}
              className="group relative w-full bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 text-white px-6 py-4 rounded-2xl font-bold shadow-2xl mt-4 overflow-hidden"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Glass Morphism Overlay */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl"></div>
              
              {/* Text Content */}
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>Book Consultation</span>
                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              </span>
            </button>
            
            <a
              href="tel:09167858304"
              className="group relative flex items-center justify-center space-x-3 px-6 py-4 text-white font-bold border-2 border-transparent rounded-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 opacity-90"></div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Glass Morphism Overlay */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl"></div>
              
              {/* Content */}
              <Phone className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Call: 09167858304</span>
              
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-30 blur-sm transition-all duration-300 -z-10"></div>
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
