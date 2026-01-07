import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Package, Globe, Plane, TrendingUp } from 'lucide-react';

export default function Services() {
  const { t } = useTranslation();

  const services = [
    {
      icon: Package,
      name: t('services.trade.name'),
      desc: t('services.trade.desc'),
      slug: 'trade-manufacturing',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600',
    },
    {
      icon: Globe,
      name: t('services.logistics.name'),
      desc: t('services.logistics.desc'),
      slug: 'logistics-qc',
      image: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=600',
    },
    {
      icon: Plane,
      name: t('services.travel.name'),
      desc: t('services.travel.desc'),
      slug: 'corporate-travel-events',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600',
    },
    {
      icon: TrendingUp,
      name: t('services.investments.name'),
      desc: t('services.investments.desc'),
      slug: 'investments-partnerships',
      image: 'https://images.pexels.com/photos/3076002/pexels-photo-3076002.jpeg?auto=compress&w=600',
    },
  ];

  return (
    <div className="min-h-screen pt-32" data-testid="services-page">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-heading text-white mb-6 md:mb-8 tracking-tighter uppercase leading-tight">
            {t('services.title')}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-white/70 mb-12 md:mb-16 max-w-3xl">
            {t('services.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pb-24">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={`/services/${service.slug}`}
                className="group relative block h-[350px] md:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden"
                data-testid={`service-card-${service.slug}`}
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  <service.icon className="w-12 h-12 md:w-16 md:h-16 text-[#E11D2E] mb-4 md:mb-6" />
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading text-white mb-3 md:mb-4">{service.name}</h2>
                  <p className="text-base md:text-lg text-white/80 mb-4 md:mb-6">{service.desc}</p>
                  <div className="flex items-center text-[#E11D2E] font-bold group-hover:translate-x-2 transition-transform">
                    {t('common.learn_more')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
