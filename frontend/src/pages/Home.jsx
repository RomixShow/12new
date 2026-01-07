import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Package, Plane, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import ParticleBackground from '../components/ParticleBackground';
import CountUp from 'react-countup';
import Marquee from 'react-fast-marquee';
import { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Home() {
  const { t } = useTranslation();
  const [cases, setCases] = useState([]);
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesRes, eventsRes, projectsRes, partnersRes] = await Promise.all([
          axios.get(`${API}/cases`),
          axios.get(`${API}/events`),
          axios.get(`${API}/projects`),
          axios.get(`${API}/partners`),
        ]);
        setCases(casesRes.data.slice(0, 6));
        setEvents(eventsRes.data.slice(0, 3));
        setProjects(projectsRes.data.slice(0, 3));
        setPartners(partnersRes.data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const services = [
    {
      icon: Package,
      name: t('services.trade.name'),
      desc: t('services.trade.desc'),
      link: '/services/trade-manufacturing',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400',
    },
    {
      icon: Globe,
      name: t('services.logistics.name'),
      desc: t('services.logistics.desc'),
      link: '/services/logistics-qc',
      image: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=400',
    },
    {
      icon: Plane,
      name: t('services.travel.name'),
      desc: t('services.travel.desc'),
      link: '/services/corporate-travel-events',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400',
    },
    {
      icon: TrendingUp,
      name: t('services.investments.name'),
      desc: t('services.investments.desc'),
      link: '/services/investments-partnerships',
      image: 'https://images.pexels.com/photos/3076002/pexels-photo-3076002.jpeg?auto=compress&w=400',
    },
  ];

  const stats = [
    { value: 12, label: t('stats.years'), suffix: '+' },
    { value: 25, label: t('stats.countries'), suffix: '+' },
    { value: 500, label: t('stats.projects'), suffix: '+' },
    { value: 45, label: t('stats.launch'), suffix: ' days' },
  ];

  const processSteps = [
    t('process.step1'),
    t('process.step2'),
    t('process.step3'),
    t('process.step4'),
    t('process.step5'),
    t('process.step6'),
  ];

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero" data-testid="hero-section">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black font-heading text-white mb-6 tracking-tighter uppercase leading-tight text-shadow-red">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full px-8 py-6 text-lg font-bold glow-red"
                data-testid="hero-cta-primary"
              >
                <Link to="/contact">{t('hero.cta_primary')}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="glass text-white border-white/10 hover:border-[#E11D2E]/50 rounded-full px-8 py-6 text-lg"
                data-testid="hero-cta-secondary"
              >
                <Link to="/services">{t('hero.cta_secondary')}</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-[#E11D2E] rounded-full" />
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-[#0A0A0A] border-y border-white/10" data-testid="trust-bar-section">
        <Marquee gradient={false} speed={50}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="mx-8 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
              <div className="w-32 h-16 bg-white/5 rounded-lg flex items-center justify-center text-white/40 text-xs">
                Partner {i}
              </div>
            </div>
          ))}
        </Marquee>
      </section>

      {/* Services */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-4 md:px-8" data-testid="services-section">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold font-heading text-white mb-16 tracking-tight">
            {t('services.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={service.link}
                  className="group relative block h-full bg-black/40 border border-white/10 rounded-3xl p-8 hover:border-[#E11D2E]/50 transition-all duration-500 overflow-hidden"
                  data-testid={`service-card-${idx}`}
                >
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                    <img src={service.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                  <div className="relative z-10">
                    <service.icon className="w-12 h-12 text-[#E11D2E] mb-6" />
                    <h3 className="text-2xl md:text-3xl font-bold font-heading text-white mb-4">{service.name}</h3>
                    <p className="text-white/60 mb-6">{service.desc}</p>
                    <div className="flex items-center text-[#E11D2E] font-medium group-hover:translate-x-2 transition-transform">
                      {t('common.learn_more')}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Process */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]" data-testid="process-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl md:text-6xl font-bold font-heading text-white mb-16 tracking-tight text-center">
            {t('process.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                <div className="glass rounded-2xl p-6">
                  <div className="text-6xl font-black font-heading text-[#E11D2E]/20 mb-4">{String(idx + 1).padStart(2, '0')}</div>
                  <p className="text-white/80">{step}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-4 md:px-8" data-testid="stats-section">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-8 text-center"
              data-testid={`stat-card-${idx}`}
            >
              <div className="text-4xl md:text-5xl font-black font-heading text-[#E11D2E] mb-2">
                <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} enableScrollSpy scrollSpyOnce />
              </div>
              <p className="text-sm text-white/60 font-mono uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-r from-[#E11D2E]/10 to-transparent" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold font-heading text-white mb-8 tracking-tight">
            {t('nav.request')}
          </h2>
          <p className="text-lg text-white/70 mb-12">
            {t('hero.subtitle')}
          </p>
          <Button
            asChild
            className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full px-12 py-6 text-lg font-bold glow-red"
            data-testid="cta-button"
          >
            <Link to="/contact">{t('common.schedule_call')}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}