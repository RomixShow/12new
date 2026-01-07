import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function NDAPage() {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(`${API}/pages/nda?lang=${i18n.language}`);
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
    <div className="min-h-screen pt-32" data-testid="nda-page">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <FileText className="w-12 h-12 md:w-16 md:h-16 text-[#E11D2E] mb-6" />
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            {getLocalizedField('title')}
          </h1>
          <div className="glass rounded-3xl p-6 md:p-8 space-y-6 text-white/80 leading-relaxed">
            <div 
              className="prose prose-invert prose-headings:text-white prose-headings:font-bold prose-h2:text-xl prose-h2:md:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-ul:list-disc prose-ul:list-inside prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: getLocalizedField('content') }}
            />
            <div className="mt-8 pt-8 border-t border-white/10">
              <Button
                className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-bold glow-red"
                data-testid="download-nda-button"
              >
                <Download className="mr-2 w-5 h-5" />
                {i18n.language === 'en' ? 'Request NDA Template' : 'Запросить шаблон NDA'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
