import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Cases() {
  const { t, i18n } = useTranslation();
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const lang = i18n.language;
        const response = await axios.get(`${API}/cases?lang=${lang}`);
        setCases(response.data);
      } catch (error) {
        console.error('Error fetching cases:', error);
      }
    };
    fetchCases();
  }, [i18n.language]);

  const getLocalizedField = (item, field) => {
    if (i18n.language === 'en' && item[`${field}_en`]) {
      return item[`${field}_en`];
    }
    return item[field];
  };

  return (
    <div className="min-h-screen pt-32" data-testid="cases-page">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-6xl md:text-8xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            {t('nav.cases')}
          </h1>
          <p className="text-xl text-white/70 mb-12 max-w-3xl">
            {i18n.language === 'en' 
              ? 'Completed projects and success stories of our clients'
              : 'Реализованные проекты и истории успеха наших клиентов'
            }
          </p>
        </motion.div>

        <div className="space-y-8 pb-24">
          {cases.map((caseItem, idx) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={`/cases/${caseItem.slug}`}
                className="group block glass rounded-3xl overflow-hidden hover:border-[#E11D2E]/50 transition-all"
                data-testid={`case-card-${caseItem.id}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    <img src={caseItem.image_url} alt={getLocalizedField(caseItem, 'title')} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="text-sm text-[#E11D2E] font-mono mb-2">{caseItem.category.toUpperCase()}</div>
                    <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-[#E11D2E] transition-colors">
                      {getLocalizedField(caseItem, 'title')}
                    </h3>
                    <p className="text-white/60 mb-4">{getLocalizedField(caseItem, 'description')}</p>
                    <div className="flex items-center text-[#E11D2E] font-medium group-hover:translate-x-2 transition-transform">
                      {t('common.learn_more')}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </div>
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