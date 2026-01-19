import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const { settings } = useSiteSettings();

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
    { path: '/nda', label: t('footer.nda') },
  ];

  const sections = settings?.footer?.sections?.length
    ? settings.footer.sections.map((section) => ({
      title: i18n.language === 'en' && section.title_en ? section.title_en : section.title,
      links: (section.links || []).map((link) => ({
        ...link,
        label: i18n.language === 'en' && link.label_en ? link.label_en : link.label,
      })),
    }))
    : [
      { title: t('footer.company'), links: companyLinks },
      { title: t('footer.services'), links: serviceLinks },
      { title: t('footer.resources'), links: resourceLinks },
      { title: t('footer.legal'), links: legalLinks },
    ];

  const socials = settings?.footer?.socials?.length
    ? settings.footer.socials
    : [
      { label: 'LinkedIn', href: 'https://linkedin.com' },
      { label: 'WeChat', href: 'https://wechat.com' },
      { label: 'Telegram', href: 'https://telegram.org' },
    ];

  const address = i18n.language === 'en' && settings?.footer?.address_en
    ? settings.footer.address_en
    : settings?.footer?.address || t('footer.address');
  const email = settings?.footer?.email || 'mail@aichin.org';
  const phone = settings?.footer?.phone;

  return (
    <footer className="relative bg-[#0A0A0A] border-t border-white/10 overflow-hidden" data-testid="main-footer">
      {/* Massive background text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <span className="font-heading font-black text-[15vw] leading-none">AICHIN</span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-heading font-bold text-white mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href || link.path}>
                    {link.href?.startsWith('http') ? (
                      <a
                        href={link.href}
                        className="text-sm text-white/60 hover:text-[#E11D2E] transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href || link.path}
                        className="text-sm text-white/60 hover:text-[#E11D2E] transition-colors"
                        data-testid={`footer-link-${(link.href || link.path || '').replace('/', '')}`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-white mb-6">{t('footer.contact_title')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-white/60">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail size={16} className="mt-1 flex-shrink-0 text-white/60" />
                <a
                  href={`mailto:${email}`}
                  className="text-sm text-[#E11D2E] hover:underline"
                  data-testid="footer-email-link"
                >
                  {email}
                </a>
              </li>
              {phone && (
                <li className="text-sm text-white/60">Phone: {phone}</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-sm text-white/40">{t('footer.rights')}</p>
          <div className="flex items-center space-x-4">
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[#E11D2E] transition-colors"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
