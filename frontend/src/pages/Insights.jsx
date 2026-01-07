import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Insights() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${API}/articles`);
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen pt-32" data-testid="insights-page">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-6xl md:text-8xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            Инсайты
          </h1>
          <p className="text-xl text-white/70 mb-12 max-w-3xl">
            Статьи о китайском рынке, инвестициях и международной торговле
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
          {articles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={`/insights/${article.slug}`}
                className="group block h-full glass rounded-3xl overflow-hidden hover:border-[#E11D2E]/50 transition-all"
                data-testid={`article-card-${article.id}`}
              >
                <div className="relative h-48">
                  <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                </div>
                <div className="p-6">
                  <div className="text-xs text-[#E11D2E] font-mono mb-2">{article.category.toUpperCase()}</div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#E11D2E] transition-colors line-clamp-2">{article.title}</h3>
                  <p className="text-white/60 mb-4 line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-white/40">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.published_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}