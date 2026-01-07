import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Events() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API}/events`);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen pt-32" data-testid="events-page">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-6xl md:text-8xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            Мероприятия
          </h1>
          <p className="text-xl text-white/70 mb-12 max-w-3xl">
            Выставки, форумы и бизнес-туры в Китае
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-24">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={`/events/${event.slug}`}
                className="group block h-full glass rounded-3xl overflow-hidden hover:border-[#E11D2E]/50 transition-all"
                data-testid={`event-card-${event.id}`}
              >
                <div className="relative h-64">
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>
                <div className="p-8">
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-[#E11D2E] transition-colors">{event.title}</h3>
                  <div className="flex items-center gap-4 text-white/60 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="text-white/70">{event.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}