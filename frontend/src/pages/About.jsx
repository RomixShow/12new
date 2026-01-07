import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Target, Shield, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function About() {
  const { t } = useTranslation();
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`${API}/team`);
        setTeam(response.data);
      } catch (error) {
        console.error('Error fetching team:', error);
      }
    };
    fetchTeam();
  }, []);

  const values = [
    { icon: Target, title: 'Innovation', desc: 'Постоянное развитие и внедрение передовых решений' },
    { icon: Shield, title: 'Trust', desc: 'Прозрачность, комплаенс и проверенные партнеры' },
    { icon: Users, title: 'Scale', desc: 'Глобальная сеть и масштабируемые процессы' },
    { icon: MapPin, title: 'Precision', desc: 'Точность в деталях и контроль на каждом этапе' },
  ];

  return (
    <div className="min-h-screen pt-32" data-testid="about-page">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            О КОМПАНИИ
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Мы - мост между Китаем и миром</h2>
              <p className="text-lg text-white/70 mb-6 leading-relaxed">
                AICHIN GROUP объединяет экспертизу в международной торговле, логистике, инвестициях и корпоративных мероприятиях. Мы помогаем компаниям из разных стран эффективно работать с Китаем.
              </p>
              <p className="text-lg text-white/70 leading-relaxed">
                Наша миссия - создавать надежные партнерства и открывать новые возможности для бизнеса через глубокое понимание китайского рынка и международных стандартов.
              </p>
            </div>
            <div className="relative h-96 rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1758691736821-f1a600c0c3f1?q=80&w=800"
                alt="Team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#0A0A0A]" data-testid="values-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl md:text-6xl font-bold font-heading text-white mb-16 tracking-tight">
            Наши ценности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass rounded-3xl p-8"
              >
                <value.icon className="w-12 h-12 text-[#E11D2E] mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-white/60">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Geography */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8" data-testid="geography-section">
        <h2 className="text-4xl md:text-6xl font-bold font-heading text-white mb-16 tracking-tight">
          География присутствия
        </h2>
        <div className="glass rounded-3xl p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <MapPin className="w-12 h-12 text-[#E11D2E] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Китай</h3>
              <p className="text-white/60">Шанхай, Гуанчжоу, Шэньчжэнь</p>
            </div>
            <div>
              <MapPin className="w-12 h-12 text-[#E11D2E] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Россия</h3>
              <p className="text-white/60">Москва, Санкт-Петербург</p>
            </div>
            <div>
              <MapPin className="w-12 h-12 text-[#E11D2E] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">ОАЭ</h3>
              <p className="text-white/60">Дубай</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="py-24 bg-[#0A0A0A]" data-testid="team-section">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-4xl md:text-6xl font-bold font-heading text-white mb-16 tracking-tight">
              Команда
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {team.map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass rounded-3xl p-6 text-center"
                  data-testid={`team-member-${idx}`}
                >
                  <div className="w-24 h-24 rounded-full bg-white/5 mx-auto mb-4 overflow-hidden">
                    {member.image_url && (
                      <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-sm text-[#E11D2E] mb-3">{member.position}</p>
                  <p className="text-sm text-white/60">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}