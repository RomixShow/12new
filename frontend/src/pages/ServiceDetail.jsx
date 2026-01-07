import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function ServiceDetail() {
  const { t } = useTranslation();
  const { slug } = useParams();

  const servicesData = {
    'trade-manufacturing': {
      name: t('services.trade.name'),
      hero: 'Полный цикл поставок и производства в Китае',
      description: 'От поиска поставщиков до организации производства и контроля качества на всех этапах',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200',
      features: [
        'Поиск и проверка производителей',
        'Переговоры и заключение контрактов',
        'Организация производства под заказ',
        'Контроль качества на фабрике',
        'Управление сроками и бюджетом',
        'Сертификация и комплаенс',
      ],
      process: [
        { step: 'Анализ требований', desc: 'Детальное изучение ваших потребностей' },
        { step: 'Подбор поставщиков', desc: 'Поиск 3-5 проверенных производителей' },
        { step: 'Образцы и тестирование', desc: 'Заказ образцов и проверка качества' },
        { step: 'Производство', desc: 'Контроль производственного процесса' },
        { step: 'Доставка', desc: 'Логистика и таможенное оформление' },
      ],
      packages: [
        { name: 'Start', desc: 'Для первых заказов', features: ['Поиск поставщиков', 'Базовая проверка', 'Переговоры'] },
        { name: 'Pro', desc: 'Полный цикл', features: ['Все из Start', 'Контроль качества', 'Производство'] },
        { name: 'Enterprise', desc: 'Под ключ', features: ['Все из Pro', 'Выделенный менеджер', 'SLA 24/7'] },
      ],
    },
    'logistics-qc': {
      name: t('services.logistics.name'),
      hero: 'Логистика и контроль качества на всех этапах',
      description: 'Международная логистика, складирование, инспекции и контроль качества продукции',
      image: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=1200',
      features: [
        'Морские и авиа перевозки',
        'Складская логистика',
        'Таможенное оформление',
        'Инспекции на фабриках',
        'Лабораторные тесты',
        'Отчеты по качеству',
      ],
      process: [
        { step: 'Планирование', desc: 'Маршрут и график поставок' },
        { step: 'Инспекция', desc: 'Проверка перед отгрузкой' },
        { step: 'Упаковка', desc: 'Контроль упаковки и маркировки' },
        { step: 'Отгрузка', desc: 'Организация транспортировки' },
        { step: 'Доставка', desc: 'Доставка до двери клиента' },
      ],
      packages: [
        { name: 'Start', desc: 'Базовая логистика', features: ['Морские перевозки', 'Таможня', 'Трекинг'] },
        { name: 'Pro', desc: 'С инспекциями', features: ['Все из Start', 'QC инспекции', 'Отчеты'] },
        { name: 'Enterprise', desc: 'Полный контроль', features: ['Все из Pro', 'Склад в Китае', 'Экспресс'] },
      ],
    },
    'corporate-travel-events': {
      name: t('services.travel.name'),
      hero: 'Организация корпоративных поездок и мероприятий в Китае',
      description: 'Деловые туры, выставки, форумы и B2B-встречи с ключевыми игроками рынка',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200',
      features: [
        'Организация бизнес-визитов',
        'Участие в выставках',
        'B2B-встречи с партнерами',
        'Перевод и сопровождение',
        'Культурная программа',
        'Логистика мероприятий',
      ],
      process: [
        { step: 'Планирование', desc: 'Цели поездки и программа' },
        { step: 'Подбор партнеров', desc: 'Организация встреч' },
        { step: 'Визы и билеты', desc: 'Документы и логистика' },
        { step: 'Проведение', desc: 'Сопровождение делегации' },
        { step: 'Отчет', desc: 'Итоги и следующие шаги' },
      ],
      packages: [
        { name: 'Start', desc: 'Базовый тур', features: ['3 дня', '5 встреч', 'Перевод'] },
        { name: 'Pro', desc: 'Расширенная программа', features: ['5-7 дней', '10+ встреч', 'Выставка'] },
        { name: 'Enterprise', desc: 'Индивидуальный формат', features: ['До 14 дней', 'VIP-встречи', 'Культурная программа'] },
      ],
    },
    'investments-partnerships': {
      name: t('services.investments.name'),
      hero: 'Инвестиционные проекты и стратегические партнерства',
      description: 'Поиск инвесторов, due diligence проектов и организация международных партнерств',
      image: 'https://images.pexels.com/photos/3076002/pexels-photo-3076002.jpeg?auto=compress&w=1200',
      features: [
        'Подбор инвестиционных проектов',
        'Due diligence',
        'Сопровождение сделок',
        'Поиск стратегических партнеров',
        'Структурирование инвестиций',
        'Юридическое сопровождение',
      ],
      process: [
        { step: 'Анализ', desc: 'Изучение проекта и рынка' },
        { step: 'Due Diligence', desc: 'Проверка документов и рисков' },
        { step: 'Переговоры', desc: 'Условия сделки' },
        { step: 'Структурирование', desc: 'Юридическое оформление' },
        { step: 'Закрытие', desc: 'Завершение сделки' },
      ],
      packages: [
        { name: 'Start', desc: 'Консультации', features: ['Анализ проекта', 'Поиск партнеров', 'NDA'] },
        { name: 'Pro', desc: 'Due Diligence', features: ['Все из Start', 'Полная проверка', 'Отчет'] },
        { name: 'Enterprise', desc: 'Полное сопровождение', features: ['Все из Pro', 'Переговоры', 'Deal closing'] },
      ],
    },
  };

  const service = servicesData[slug];

  if (!service) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <p className="text-white text-2xl">Service not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="service-detail-page">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <img src={service.image} alt={service.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-heading text-white mb-4 tracking-tight">
              {service.name}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">{service.hero}</p>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8">
        <p className="text-2xl text-white/80 leading-relaxed">{service.description}</p>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#0A0A0A]" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-12">Что включено</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features.map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-3" data-testid={`feature-${idx}`}>
                <Check className="w-6 h-6 text-[#E11D2E] flex-shrink-0 mt-1" />
                <span className="text-lg text-white/80">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8" data-testid="process-section">
        <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-12">Процесс работы</h2>
        <div className="space-y-6">
          {service.process.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-6 flex items-start space-x-6"
              data-testid={`process-step-${idx}`}
            >
              <div className="text-4xl font-black font-heading text-[#E11D2E]/30">{String(idx + 1).padStart(2, '0')}</div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{step.step}</h3>
                <p className="text-white/60">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 bg-[#0A0A0A]" data-testid="packages-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-12">Пакеты услуг</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {service.packages.map((pkg, idx) => (
              <div key={idx} className="glass rounded-3xl p-8" data-testid={`package-${idx}`}>
                <h3 className="text-3xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-white/60 mb-8">{pkg.desc}</p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-[#E11D2E] flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-white/40 mb-6">Стоимость по запросу</p>
                <Button
                  asChild
                  className="w-full bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full"
                  data-testid={`package-cta-${idx}`}
                >
                  <Link to="/contact">Запросить КП</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8" data-testid="cta-section">
        <div className="glass rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Готовы начать?</h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Свяжитесь с нами для получения консультации и индивидуального предложения
          </p>
          <Button
            asChild
            className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full px-8 py-6 text-lg font-bold glow-red"
            data-testid="final-cta-button"
          >
            <Link to="/contact">
              Связаться с нами
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}