import { motion } from 'framer-motion';
import { Download as DownloadIcon, FileText, FileImage, FileSpreadsheet } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Download() {
  const materials = [
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
          <DownloadIcon className="w-16 h-16 text-[#E11D2E] mb-6" />
          <h1 className="text-6xl md:text-8xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            Материалы
          </h1>
          <p className="text-xl text-white/70 mb-12 max-w-3xl">
            Полезные материалы и гиды по работе с китайским рынком
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {materials.map((material, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-3xl p-8"
              data-testid={`material-card-${idx}`}
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-[#E11D2E]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <material.icon className="w-8 h-8 text-[#E11D2E]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{material.title}</h3>
                  <p className="text-white/60 mb-4">{material.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/40">
                      {material.format} • {material.size}
                    </div>
                    <Button
                      className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full px-6"
                      data-testid={`download-button-${idx}`}
                    >
                      <DownloadIcon className="mr-2 w-4 h-4" />
                      Скачать
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
          className="glass rounded-3xl p-12 mt-16 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Нужна консультация?</h2>
          <p className="text-white/70 mb-8">Свяжитесь с нами для получения дополнительных материалов</p>
          <Button
            asChild
            className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full px-8 py-6 text-lg font-bold glow-red"
            data-testid="contact-cta-button"
          >
            <a href="/contact">Связаться с нами</a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}