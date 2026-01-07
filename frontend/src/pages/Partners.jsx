import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Partners() {
  const { t, i18n } = useTranslation();
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const lang = i18n.language;
        const response = await axios.get(`${API}/partners?lang=${lang}`);
        setPartners(response.data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };
    fetchPartners();
  }, [i18n.language]);

  const getLocalizedField = (item, field) => {
    if (i18n.language === 'en' && item[`${field}_en`]) {
      return item[`${field}_en`];
    }
    return item[field];
  };

  return (
    <div className="min-h-screen pt-32" data-testid="partners-page">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-6xl md:text-8xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            {t('nav.partners')}
          </h1>
          <p className="text-xl text-white/70 mb-12 max-w-3xl">
            {t('partners.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
          {partners.map((partner, idx) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={`/partners/${partner.slug}`}
                className="group block h-full glass rounded-3xl p-8 hover:border-[#E11D2E]/50 transition-all"
                data-testid={`partner-card-${partner.id}`}
              >
                <div className="w-24 h-24 rounded-2xl bg-white/5 mb-6 overflow-hidden">
                  <img src={partner.logo_url} alt={getLocalizedField(partner, 'name')} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#E11D2E] transition-colors">
                  {getLocalizedField(partner, 'name')}
                </h3>
                <p className="text-white/60 mb-4">{getLocalizedField(partner, 'description')}</p>
                <div className="flex flex-wrap gap-2">
                  {partner.categories.map((cat, cidx) => (
                    <span key={cidx} className="text-xs bg-white/5 text-white/70 px-3 py-1 rounded-full">{cat}</span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}