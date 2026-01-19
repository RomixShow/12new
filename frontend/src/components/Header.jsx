import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useSiteSettings } from '../hooks/useSiteSettings';

export default function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { settings } = useSiteSettings();
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

  const fallbackNavItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/services', label: t('nav.services') },
    { path: '/invest', label: t('nav.invest') },
    { path: '/partners', label: t('nav.partners') },
    { path: '/events', label: t('nav.events') },
    { path: '/cases', label: t('nav.cases') },
    { path: '/insights', label: t('nav.insights') },
  ];

  const navItems = settings?.header?.menu?.length
    ? settings.header.menu.map((item) => ({
      ...item,
      label: i18n.language === 'en' && item.label_en ? item.label_en : item.label,
      children: (item.children || []).map((child) => ({
        ...child,
        label: i18n.language === 'en' && child.label_en ? child.label_en : child.label,
      })),
    }))
    : fallbackNavItems;

  const logoText = settings?.header?.logo_text || 'AICHIN';
  const logoTagline = settings?.header?.logo_tagline || 'GROUP';
  const ctaLabel = i18n.language === 'en' && settings?.header?.cta_label_en
    ? settings.header.cta_label_en
    : settings?.header?.cta_label || t('nav.request');
  const ctaHref = settings?.header?.cta_href || '/contact';

  const renderLink = (href, label, className, onClick) => {
    if (href?.startsWith('http')) {
      return (
        <a href={href} className={className} onClick={onClick}>
          {label}
        </a>
      );
    }
    return (
      <Link to={href || '/'} className={className} onClick={onClick}>
        {label}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 hidden lg:block ${
          isScrolled ? 'glass' : 'bg-transparent'
        } rounded-full px-6 py-4`}
        data-testid="main-header"
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
            <span className="text-2xl font-black font-heading text-white">{logoText}</span>
            <span className="text-sm text-[#E11D2E] font-mono">{logoTagline}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-8" data-testid="desktop-nav">
            {navItems.map((item) => (
              <div key={item.href || item.path} className="relative group">
                {renderLink(
                  item.href || item.path,
                  item.label,
                  `text-sm font-medium transition-colors hover:text-[#E11D2E] ${
                    location.pathname === (item.href || item.path) ? 'text-[#E11D2E]' : 'text-white/70'
                  }`,
                )}
                {item.children?.length > 0 && (
                  <div className="absolute left-0 top-full pt-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                    <div className="glass rounded-2xl p-3 min-w-[220px] space-y-2">
                      {item.children.map((child) => (
                        <div key={child.href || child.path}>
                          {renderLink(
                            child.href || child.path,
                            child.label,
                            'block text-sm text-white/70 hover:text-[#E11D2E] px-3 py-2 rounded-lg hover:bg-white/5',
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
              className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full px-6 py-3 glow-red"
              data-testid="header-cta-button"
            >
              <Link to={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 lg:hidden ${
          isScrolled || isMobileMenuOpen ? 'bg-[#0A0A0A]/95 backdrop-blur-xl' : 'bg-transparent'
        } px-4 py-4`}
        data-testid="mobile-header"
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link-mobile">
            <span className="text-xl font-black font-heading text-white">{logoText}</span>
            <span className="text-xs text-[#E11D2E] font-mono">{logoTagline}</span>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleLanguage}
              className="text-sm font-mono text-white/70 hover:text-[#E11D2E] transition-colors"
              data-testid="language-switcher-mobile"
            >
              {i18n.language.toUpperCase()}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2"
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
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-[#0A0A0A] border-t border-white/10 shadow-2xl"
              data-testid="mobile-menu"
            >
              <nav className="flex flex-col px-4 py-6">
                {navItems.map((item) => (
                  <div key={item.href || item.path} className="border-b border-white/5">
                    {renderLink(
                      item.href || item.path,
                      item.label,
                      `py-3 text-base font-medium transition-colors hover:text-[#E11D2E] ${
                        location.pathname === (item.href || item.path) ? 'text-[#E11D2E]' : 'text-white/80'
                      }`,
                      () => setIsMobileMenuOpen(false),
                    )}
                    {item.children?.length > 0 && (
                      <div className="pl-4 pb-2 space-y-2">
                        {item.children.map((child) => (
                          <div key={child.href || child.path}>
                            {renderLink(
                              child.href || child.path,
                              child.label,
                              'text-sm text-white/60 hover:text-[#E11D2E] block py-2',
                              () => setIsMobileMenuOpen(false),
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Button
                  asChild
                  className="mt-6 bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-xl py-4 text-base font-bold"
                  data-testid="mobile-cta-button"
                >
                  <Link to={ctaHref} onClick={() => setIsMobileMenuOpen(false)}>
                    {ctaLabel}
                  </Link>
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
