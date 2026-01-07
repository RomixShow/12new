import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Privacy() {
  const { i18n } = useTranslation();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(`${API}/pages/privacy?lang=${i18n.language}`);
        setPage(response.data);
      } catch (error) {
        console.error('Error fetching page:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [i18n.language]);

  const getLocalizedField = (field) => {
    if (!page) return '';
    if (i18n.language === 'en' && page[`${field}_en`]) {
      return page[`${field}_en`];
    }
    return page[field] || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32" data-testid="privacy-page">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Shield className="w-12 h-12 md:w-16 md:h-16 text-[#E11D2E] mb-6" />
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            {getLocalizedField('title')}
          </h1>
          <div 
            className="glass rounded-3xl p-6 md:p-8 space-y-6 text-white/80 leading-relaxed prose prose-invert prose-headings:text-white prose-headings:font-bold prose-h2:text-xl prose-h2:md:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-ul:list-disc prose-ul:list-inside prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: getLocalizedField('content') }}
          />
        </motion.div>
      </div>
    </div>
  );
}
