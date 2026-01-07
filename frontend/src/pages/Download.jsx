import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Download as DownloadIcon, FileText, FileImage, FileSpreadsheet } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Download() {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(`${API}/pages/download?lang=${i18n.language}`);
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

  const materials = i18n.language === 'en' ? [
    {
      title: 'Company Presentation',
      description: 'Overview of our services, cases and advantages',
      icon: FileImage,
      size: '12 MB',
      format: 'PDF',
    },
    {
      title: 'Supply Checklist',
      description: 'Steps for successful sourcing from China',
      icon: FileText,
      size: '2 MB',
      format: 'PDF',
    },
    {
      title: 'Quality Control Guide',
      description: 'Key aspects of QC and factory inspections',
      icon: FileText,
      size: '5 MB',
      format: 'PDF',
    },
    {
      title: 'Project Brief Template',
      description: 'Structured template for describing your project',
      icon: FileSpreadsheet,
      size: '1 MB',
      format: 'XLSX',
    },
  ] : [
    {
      title: 'Презентация компании',
      description: 'Обзор наших услуг, кейсов и преимуществ',
      icon: FileImage,
      size: '12 MB',
      format: 'PDF',
    },
    {
      title: 'Чек-лист по поставкам',
      description: 'Шаги для успешной организации поставок из Китая',
      icon: FileText,
      size: '2 MB',
      format: 'PDF',
    },
    {
      title: 'Гид по контролю качества',
      description: 'Ключевые аспекты QC и инспекций на производстве',
      icon: FileText,
      size: '5 MB',
      format: 'PDF',
    },
    {
      title: 'Шаблон брифа на проект',
      description: 'Структурированный шаблон для описания вашего проекта',
      icon: FileSpreadsheet,
      size: '1 MB',
      format: 'XLSX',
    },
  ];

  return (
    <div className="min-h-screen pt-32" data-testid="download-page">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <DownloadIcon className="w-12 h-12 md:w-16 md:h-16 text-[#E11D2E] mb-6" />
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            {getLocalizedField('title')}
          </h1>
          <p className="text-base md:text-xl text-white/70 mb-12 max-w-3xl">
            {i18n.language === 'en' 
              ? 'Useful materials and guides for working with the Chinese market' 
              : 'Полезные материалы и гиды по работе с китайским рынком'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {materials.map((material, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-3xl p-6 md:p-8"
              data-testid={`material-card-${idx}`}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#E11D2E]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <material.icon className="w-7 h-7 md:w-8 md:h-8 text-[#E11D2E]" />
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{material.title}</h3>
                  <p className="text-sm md:text-base text-white/60 mb-4">{material.description}</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-xs md:text-sm text-white/40">
                      {material.format} • {material.size}
                    </div>
                    <Button
                      className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full px-5 md:px-6 w-full sm:w-auto"
                      data-testid={`download-button-${idx}`}
                    >
                      <DownloadIcon className="mr-2 w-4 h-4" />
                      {i18n.language === 'en' ? 'Download' : 'Скачать'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 md:p-12 mt-12 md:mt-16 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {i18n.language === 'en' ? 'Need consultation?' : 'Нужна консультация?'}
          </h2>
          <p className="text-sm md:text-base text-white/70 mb-6 md:mb-8">
            {i18n.language === 'en' 
              ? 'Contact us to get additional materials' 
              : 'Свяжитесь с нами для получения дополнительных материалов'}
          </p>
          <Button
            asChild
            className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-bold glow-red"
            data-testid="contact-cta-button"
          >
            <Link to="/contact">
              {i18n.language === 'en' ? 'Contact Us' : 'Связаться с нами'}
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
