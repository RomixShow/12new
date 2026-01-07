import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen pt-32" data-testid="privacy-page">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Shield className="w-16 h-16 text-[#E11D2E] mb-6" />
          <h1 className="text-5xl md:text-7xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            Политика конфиденциальности
          </h1>
          <div className="glass rounded-3xl p-8 space-y-6 text-white/80 leading-relaxed">
            <p className="text-lg">Последнее обновление: 1 января 2025</p>
            
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Сбор информации</h2>
            <p>
              Мы собираем информацию, которую вы предоставляете добровольно: имя, email, название компании, телефон.
              Также мы собираем техническую информацию: IP-адрес, тип браузера, страницы посещения.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Использование информации</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Ответ на ваши запросы</li>
              <li>Улучшение наших услуг</li>
              <li>Аналитика и исследования</li>
              <li>Информирование о новых услугах (с вашего согласия)</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Защита данных</h2>
            <p>
              Мы используем современные методы защиты: SSL-шифрование, защищенные серверы,
              ограниченный доступ к данным.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Ваши права</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Право на доступ к вашим данным</li>
              <li>Право на исправление данных</li>
              <li>Право на удаление данных</li>
              <li>Право на отзыв согласия</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Контакты</h2>
            <p>
              По вопросам конфиденциальности обращайтесь: <a href="mailto:mail@aichin.org" className="text-[#E11D2E] hover:underline">mail@aichin.org</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}