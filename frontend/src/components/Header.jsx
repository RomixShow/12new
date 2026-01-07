import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
  };

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/services', label: t('nav.services') },
    { path: '/invest', label: t('nav.invest') },
    { path: '/partners', label: t('nav.partners') },
    { path: '/events', label: t('nav.events') },
    { path: '/cases', label: t('nav.cases') },
    { path: '/insights', label: t('nav.insights') },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
        isScrolled ? 'glass' : 'bg-transparent'
      } rounded-2xl lg:rounded-full px-4 md:px-6 py-3 md:py-4`}
      data-testid="main-header"
    >
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
          <span className="text-2xl font-black font-heading text-white">AICHIN</span>
          <span className="text-sm text-[#E11D2E] font-mono">GROUP</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8" data-testid="desktop-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-[#E11D2E] ${
                location.pathname === item.path ? 'text-[#E11D2E]' : 'text-white/70'
              }`}
              data-testid={`nav-link-${item.path.replace('/', '') || 'home'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLanguage}
            className="text-sm font-mono text-white/70 hover:text-[#E11D2E] transition-colors"
            data-testid="language-switcher"
          >
            {i18n.language.toUpperCase()}
          </button>
          <Button
            asChild
            className="hidden lg:inline-flex bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full px-6 py-3 glow-red"
            data-testid="header-cta-button"
          >
            <Link to="/contact">{t('nav.request')}</Link>
          </Button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white"
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 pt-4 border-t border-white/10"
            data-testid="mobile-menu"
          >
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-[#E11D2E] ${
                    location.pathname === item.path ? 'text-[#E11D2E]' : 'text-white/70'
                  }`}
                  data-testid={`mobile-nav-link-${item.path.replace('/', '') || 'home'}`}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                asChild
                className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full"
                data-testid="mobile-cta-button"
              >
                <Link to="/contact">{t('nav.request')}</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}