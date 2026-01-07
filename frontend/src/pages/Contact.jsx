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
      toast.success(t('contact.success.title'), {
        description: t('contact.success.desc'),
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
      toast.error(t('contact.error.title'), {
        description: t('contact.error.desc'),
      });
    } finally {
      setLoading(false);
    }
  };

  const offices = ['shanghai', 'moscow', 'dubai'];

  return (
    <div className="min-h-screen pt-32" data-testid="contact-page">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            {t('nav.contact')}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 pb-24">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 md:space-y-8"
          >
            <div className="glass rounded-3xl p-6 md:p-8">
              <Mail className="w-10 h-10 md:w-12 md:h-12 text-[#E11D2E] mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Email</h3>
              <a href="mailto:mail@aichin.org" className="text-base md:text-lg text-white/70 hover:text-[#E11D2E] transition-colors" data-testid="contact-email">
                mail@aichin.org
              </a>
            </div>

            <div className="glass rounded-3xl p-6 md:p-8">
              <MapPin className="w-10 h-10 md:w-12 md:h-12 text-[#E11D2E] mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{t('contact.offices_title')}</h3>
              <ul className="space-y-2 text-sm md:text-base text-white/70">
                {offices.map((office) => (
                  <li key={office}>{t(`contact.offices.${office}`)}</li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-3xl p-6 md:p-8">
              <Phone className="w-10 h-10 md:w-12 md:h-12 text-[#E11D2E] mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{t('contact.working_hours_title')}</h3>
              <p className="text-sm md:text-base text-white/70">{t('contact.working_hours')}</p>
              <p className="text-xs md:text-sm text-white/50 mt-2">{t('contact.response_time')}</p>
            </div>

            {/* Calendly Integration placeholder */}
            <div className="glass rounded-3xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{t('contact.schedule_title')}</h3>
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
            className="glass rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">{t('contact.form_title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6" data-testid="contact-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <Label htmlFor="name" className="text-sm md:text-base text-white mb-2 block">
                    {t('contact.form.name')}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-zinc-900/50 border-white/10 focus:border-[#E11D2E]/50 h-11 md:h-12 rounded-xl text-white"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm md:text-base text-white mb-2 block">
                    {t('contact.form.email')}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-zinc-900/50 border-white/10 focus:border-[#E11D2E]/50 h-11 md:h-12 rounded-xl text-white"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <Label htmlFor="company" className="text-sm md:text-base text-white mb-2 block">
                    {t('contact.form.company')}
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="bg-zinc-900/50 border-white/10 focus:border-[#E11D2E]/50 h-11 md:h-12 rounded-xl text-white"
                    data-testid="input-company"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm md:text-base text-white mb-2 block">
                    {t('contact.form.phone')}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-zinc-900/50 border-white/10 focus:border-[#E11D2E]/50 h-11 md:h-12 rounded-xl text-white"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="service" className="text-sm md:text-base text-white mb-2 block">
                  {t('contact.form.service_label')}
                </Label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/50 border border-white/10 focus:border-[#E11D2E]/50 h-11 md:h-12 rounded-xl text-white px-4 text-sm md:text-base"
                  data-testid="select-service"
                >
                  <option value="">{t('contact.form.service_placeholder')}</option>
                  <option value="trade">Trade & Manufacturing</option>
                  <option value="logistics">Logistics & QC</option>
                  <option value="travel">Corporate Travel</option>
                  <option value="investments">Investments</option>
                </select>
              </div>

              <div>
                <Label htmlFor="message" className="text-sm md:text-base text-white mb-2 block">
                  {t('contact.form.message')}
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
                className="w-full bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full py-5 md:py-6 text-base md:text-lg font-bold glow-red"
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
