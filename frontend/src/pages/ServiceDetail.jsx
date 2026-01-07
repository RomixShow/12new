import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function ServiceDetail() {
  const { t } = useTranslation();
  const { slug } = useParams();

  const serviceKeys = {
    'trade-manufacturing': 'trade',
    'logistics-qc': 'logistics',
    'corporate-travel-events': 'travel',
    'investments-partnerships': 'investments',
  };

  const serviceImages = {
    'trade-manufacturing': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200',
    'logistics-qc': 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=1200',
    'corporate-travel-events': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200',
    'investments-partnerships': 'https://images.pexels.com/photos/3076002/pexels-photo-3076002.jpeg?auto=compress&w=1200',
  };

  const serviceKey = serviceKeys[slug];

  if (!serviceKey) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <p className="text-white text-2xl">Service not found</p>
      </div>
    );
  }

  const serviceName = t(`services.${serviceKey}.name`);
  const heroText = t(`service_detail.${serviceKey}.hero`);
  const description = t(`service_detail.${serviceKey}.description`);
  const features = t(`service_detail.${serviceKey}.features`, { returnObjects: true });
  const process = t(`service_detail.${serviceKey}.process`, { returnObjects: true });
  const packages = t(`service_detail.${serviceKey}.packages`, { returnObjects: true });

  return (
    <div className="min-h-screen" data-testid="service-detail-page">
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-end overflow-hidden">
        <img src={serviceImages[slug]} alt={serviceName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-12 md:pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black font-heading text-white mb-4 tracking-tight">
              {serviceName}
            </h1>
            <p className="text-base md:text-xl text-white/90 max-w-2xl">{heroText}</p>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8">
        <p className="text-lg md:text-2xl text-white/80 leading-relaxed">{description}</p>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-[#0A0A0A]" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-8 md:mb-12">
            {t('service_detail.features_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.isArray(features) && features.map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-3" data-testid={`feature-${idx}`}>
                <Check className="w-5 h-5 md:w-6 md:h-6 text-[#E11D2E] flex-shrink-0 mt-1" />
                <span className="text-base md:text-lg text-white/80">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8" data-testid="process-section">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-8 md:mb-12">
          {t('service_detail.process_title')}
        </h2>
        <div className="space-y-4 md:space-y-6">
          {Array.isArray(process) && process.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-5 md:p-6 flex items-start space-x-4 md:space-x-6"
              data-testid={`process-step-${idx}`}
            >
              <div className="text-3xl md:text-4xl font-black font-heading text-[#E11D2E]/30">{String(idx + 1).padStart(2, '0')}</div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{step.step}</h3>
                <p className="text-sm md:text-base text-white/60">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 md:py-24 bg-[#0A0A0A]" data-testid="packages-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-8 md:mb-12">
            {t('service_detail.packages_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {Array.isArray(packages) && packages.map((pkg, idx) => (
              <div key={idx} className="glass rounded-3xl p-6 md:p-8" data-testid={`package-${idx}`}>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-sm md:text-base text-white/60 mb-6 md:mb-8">{pkg.desc}</p>
                <ul className="space-y-3 mb-6 md:mb-8">
                  {Array.isArray(pkg.features) && pkg.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-[#E11D2E] flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs md:text-sm text-white/40 mb-4 md:mb-6">{t('service_detail.price_on_request')}</p>
                <Button
                  asChild
                  className="w-full bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full"
                  data-testid={`package-cta-${idx}`}
                >
                  <Link to="/contact">{t('service_detail.request_quote')}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8" data-testid="cta-section">
        <div className="glass rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
            {t('service_detail.ready_title')}
          </h2>
          <p className="text-base md:text-lg text-white/70 mb-6 md:mb-8 max-w-2xl mx-auto">
            {t('service_detail.ready_desc')}
          </p>
          <Button
            asChild
            className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-bold glow-red"
            data-testid="final-cta-button"
          >
            <Link to="/contact">
              {t('service_detail.contact_us')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
