import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Contact() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Заявка отправлена!', {
        description: 'Мы свяжемся с вами в ближайшее время.',
      });
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: '',
        message: '',
      });
    } catch (error) {
      toast.error('Ошибка', {
        description: 'Не удалось отправить заявку. Попробуйте позже.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32" data-testid="contact-page">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-6xl md:text-8xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            {t('nav.contact')}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-24">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="glass rounded-3xl p-8">
              <Mail className="w-12 h-12 text-[#E11D2E] mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Email</h3>
              <a href="mailto:mail@aichin.org" className="text-lg text-white/70 hover:text-[#E11D2E] transition-colors" data-testid="contact-email">
                mail@aichin.org
              </a>
            </div>

            <div className="glass rounded-3xl p-8">
              <MapPin className="w-12 h-12 text-[#E11D2E] mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Офисы</h3>
              <ul className="space-y-2 text-white/70">
                <li>Шанхай, Китай</li>
                <li>Москва, Россия</li>
                <li>Дубай, ОАЭ</li>
              </ul>
            </div>

            <div className="glass rounded-3xl p-8">
              <Phone className="w-12 h-12 text-[#E11D2E] mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Режим работы</h3>
              <p className="text-white/70">Пн-Пт: 9:00 - 18:00 (GMT+8)</p>
              <p className="text-sm text-white/50 mt-2">Ответ в течение 24 часов</p>
            </div>

            {/* Calendly Integration placeholder */}
            <div className="glass rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Записаться на звонок</h3>
              <Button
                asChild
                className="w-full bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full"
                data-testid="calendly-button"
              >
                <a href="https://calendly.com/aichin" target="_blank" rel="noopener noreferrer">
                  {t('common.schedule_call')}
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Оставить заявку</h2>
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-white mb-2 block">
                    Имя *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-zinc-900/50 border-white/10 focus:border-[#E11D2E]/50 h-12 rounded-xl text-white"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white mb-2 block">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-zinc-900/50 border-white/10 focus:border-[#E11D2E]/50 h-12 rounded-xl text-white"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company" className="text-white mb-2 block">
                    Компания
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="bg-zinc-900/50 border-white/10 focus:border-[#E11D2E]/50 h-12 rounded-xl text-white"
                    data-testid="input-company"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white mb-2 block">
                    Телефон
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-zinc-900/50 border-white/10 focus:border-[#E11D2E]/50 h-12 rounded-xl text-white"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="service" className="text-white mb-2 block">
                  Интересующее направление
                </Label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/50 border border-white/10 focus:border-[#E11D2E]/50 h-12 rounded-xl text-white px-4"
                  data-testid="select-service"
                >
                  <option value="">Выберите направление</option>
                  <option value="trade">Trade & Manufacturing</option>
                  <option value="logistics">Logistics & QC</option>
                  <option value="travel">Corporate Travel</option>
                  <option value="investments">Investments</option>
                </select>
              </div>

              <div>
                <Label htmlFor="message" className="text-white mb-2 block">
                  Сообщение *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="bg-zinc-900/50 border-white/10 focus:border-[#E11D2E]/50 rounded-xl text-white"
                  data-testid="textarea-message"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full py-6 text-lg font-bold glow-red"
                data-testid="submit-button"
              >
                {loading ? t('common.loading') : t('common.send')}
                {!loading && <Send className="ml-2 w-5 h-5" />}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}