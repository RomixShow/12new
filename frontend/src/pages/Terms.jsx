import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen pt-32" data-testid="terms-page">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <FileText className="w-16 h-16 text-[#E11D2E] mb-6" />
          <h1 className="text-5xl md:text-7xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            Условия использования
          </h1>
          <div className="glass rounded-3xl p-8 space-y-6 text-white/80 leading-relaxed">
            <p className="text-lg">Последнее обновление: 1 января 2025</p>
            
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Общие положения</h2>
            <p>
              Используя наш сайт, вы соглашаетесь с настоящими условиями. Если вы не согласны,
              пожалуйста, прекратите использование сайта.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Интеллектуальная собственность</h2>
            <p>
              Все материалы на сайте являются собственностью AICHIN GROUP. Запрещено копирование без письменного разрешения.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Услуги</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Услуги предоставляются на основе отдельных договоров</li>
              <li>Цены и условия обсуждаются индивидуально</li>
              <li>Мы оставляем за собой право отказать в обслуживании</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Ограничение ответственности</h2>
            <p>
              AICHIN GROUP не несет ответственности за косвенные убытки, возникшие в результате
              использования сайта или наших услуг.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Изменения условий</h2>
            <p>
              Мы оставляем за собой право изменять условия в любое время. Изменения вступают в силу
              с момента публикации на сайте.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Контакты</h2>
            <p>
              По вопросам обращайтесь: <a href="mailto:mail@aichin.org" className="text-[#E11D2E] hover:underline">mail@aichin.org</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}