import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  const companyLinks = [
    { path: '/about', label: t('nav.about') },
    { path: '/cases', label: t('nav.cases') },
    { path: '/insights', label: t('nav.insights') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const serviceLinks = [
    { path: '/services/trade-manufacturing', label: t('services.trade.name') },
    { path: '/services/logistics-qc', label: t('services.logistics.name') },
    { path: '/services/corporate-travel-events', label: t('services.travel.name') },
    { path: '/services/investments-partnerships', label: t('services.investments.name') },
  ];

  const resourceLinks = [
    { path: '/invest', label: t('nav.invest') },
    { path: '/partners', label: t('nav.partners') },
    { path: '/events', label: t('nav.events') },
    { path: '/download', label: t('common.download_presentation') },
  ];

  const legalLinks = [
    { path: '/privacy', label: t('footer.privacy') },
    { path: '/terms', label: t('footer.terms') },
    { path: '/nda', label: 'NDA' },
  ];

  return (
    <footer className="relative bg-[#0A0A0A] border-t border-white/10 overflow-hidden" data-testid="main-footer">
      {/* Massive background text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <span className="font-heading font-black text-[15vw] leading-none">AICHIN</span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Company */}
          <div>
            <h3 className="font-heading font-bold text-white mb-6">{t('footer.company')}</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/60 hover:text-[#E11D2E] transition-colors"
                    data-testid={`footer-link-${link.path.replace('/', '')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-bold text-white mb-6">{t('footer.services')}</h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/60 hover:text-[#E11D2E] transition-colors"
                    data-testid={`footer-service-link-${link.path.split('/').pop()}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading font-bold text-white mb-6">{t('footer.resources')}</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/60 hover:text-[#E11D2E] transition-colors"
                    data-testid={`footer-resource-link-${link.path.replace('/', '')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading font-bold text-white mb-6">{t('footer.legal')}</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/60 hover:text-[#E11D2E] transition-colors"
                    data-testid={`footer-legal-link-${link.path.replace('/', '')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-white mb-6">{t('footer.contact_title')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-white/60">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail size={16} className="mt-1 flex-shrink-0 text-white/60" />
                <a
                  href="mailto:mail@aichin.org"
                  className="text-sm text-[#E11D2E] hover:underline"
                  data-testid="footer-email-link"
                >
                  {t('footer.email')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-sm text-white/40">{t('footer.rights')}</p>
          <div className="flex items-center space-x-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-[#E11D2E] transition-colors"
              data-testid="footer-linkedin-link"
            >
              LinkedIn
            </a>
            <a
              href="https://wechat.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-[#E11D2E] transition-colors"
              data-testid="footer-wechat-link"
            >
              WeChat
            </a>
            <a
              href="https://telegram.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-[#E11D2E] transition-colors"
              data-testid="footer-telegram-link"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}