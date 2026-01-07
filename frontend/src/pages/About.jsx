import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Target, Shield, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocalizedField } from '../hooks/useLocalizedField';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function About() {
  const { t, i18n } = useTranslation();
  const { getField } = useLocalizedField();
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`${API}/team?lang=${i18n.language}`);
        setTeam(response.data);
      } catch (error) {
        console.error('Error fetching team:', error);
      }
    };
    fetchTeam();
  }, [i18n.language]);

  const values = [
    { icon: Target, key: 'innovation' },
    { icon: Shield, key: 'trust' },
    { icon: Users, key: 'scale' },
    { icon: MapPin, key: 'precision' },
  ];

  const locations = ['china', 'russia', 'uae'];

  return (
    <div className="min-h-screen pt-32" data-testid="about-page">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            {t('about.title')}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                {t('about.headline')}
              </h2>
              <p className="text-base md:text-lg text-white/70 mb-6 leading-relaxed">
                {t('about.description1')}
              </p>
              <p className="text-base md:text-lg text-white/70 leading-relaxed">
                {t('about.description2')}
              </p>
            </div>
            <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden">
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
      <section className="py-16 md:py-24 bg-[#0A0A0A]" data-testid="values-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-12 md:mb-16 tracking-tight">
            {t('about.values_title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass rounded-3xl p-6 md:p-8"
              >
                <value.icon className="w-10 h-10 md:w-12 md:h-12 text-[#E11D2E] mb-4 md:mb-6" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
                  {t(`about.values.${value.key}.title`)}
                </h3>
                <p className="text-sm md:text-base text-white/60">
                  {t(`about.values.${value.key}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Geography */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8" data-testid="geography-section">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-12 md:mb-16 tracking-tight">
          {t('about.geography_title')}
        </h2>
        <div className="glass rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {locations.map((loc, idx) => (
              <div key={idx}>
                <MapPin className="w-10 h-10 md:w-12 md:h-12 text-[#E11D2E] mx-auto mb-4" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {t(`about.locations.${loc}.name`)}
                </h3>
                <p className="text-sm md:text-base text-white/60">
                  {t(`about.locations.${loc}.cities`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="py-16 md:py-24 bg-[#0A0A0A]" data-testid="team-section">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-12 md:mb-16 tracking-tight">
              {t('about.team_title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
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
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 mx-auto mb-4 overflow-hidden">
                    {member.image_url && (
                      <img src={member.image_url} alt={getField(member, 'name')} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">{getField(member, 'name')}</h3>
                  <p className="text-xs md:text-sm text-[#E11D2E] mb-3">{getField(member, 'position')}</p>
                  <p className="text-xs md:text-sm text-white/60">{getField(member, 'bio')}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
