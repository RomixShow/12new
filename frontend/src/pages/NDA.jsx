import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NDAPage() {
  return (
    <div className="min-h-screen pt-32" data-testid="nda-page">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <FileText className="w-16 h-16 text-[#E11D2E] mb-6" />
          <h1 className="text-5xl md:text-7xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            Соглашение о конфиденциальности
          </h1>
          <div className="glass rounded-3xl p-8 space-y-6 text-white/80 leading-relaxed">
            <p>
              AICHIN GROUP серьезно относится к защите конфиденциальной информации наших клиентов и партнеров.
            </p>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Основные положения:</h2>
            <ul className="list-disc list-inside space-y-3">
              <li>Вся предоставленная информация считается конфиденциальной</li>
              <li>Использование информации только для целей сотрудничества</li>
              <li>Запрет на разглашение третьим лицам</li>
              <li>Обязательство сохраняется в течение 5 лет после окончания сотрудничества</li>
            </ul>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Как мы работаем с NDA:</h2>
            <p>
              Перед началом сотрудничества мы подписываем двустороннее соглашение о неразглашении.
              Это защищает интересы обеих сторон и создает основу для доверительных отношений.
            </p>
            <div className="mt-8 pt-8 border-t border-white/10">
              <Button
                className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full px-8 py-6 text-lg font-bold glow-red"
                data-testid="download-nda-button"
              >
                <Download className="mr-2 w-5 h-5" />
                Запросить шаблон NDA
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}