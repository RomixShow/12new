import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, TrendingUp } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Invest() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({ stage: '', industry: '' });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API}/projects`);
        setProjects(response.data);
        setFilteredProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;
    if (filters.stage) {
      filtered = filtered.filter(p => p.stage === filters.stage);
    }
    if (filters.industry) {
      filtered = filtered.filter(p => p.industry === filters.industry);
    }
    setFilteredProjects(filtered);
  }, [filters, projects]);

  return (
    <div className="min-h-screen pt-32" data-testid="invest-page">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-6xl md:text-8xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            Инвестпроекты
          </h1>
          <p className="text-xl text-white/70 mb-12 max-w-3xl">
            Отобранные инвестиционные проекты с проверенной бизнес-моделью и перспективами роста
          </p>
        </motion.div>

        {/* Filters */}
        <div className="glass rounded-3xl p-6 mb-12 flex flex-wrap gap-4" data-testid="filters">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#E11D2E]" />
            <span className="text-white font-medium">Фильтры:</span>
          </div>
          <select
            value={filters.stage}
            onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
            className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-2 text-white"
            data-testid="filter-stage"
          >
            <option value="">Все стадии</option>
            <option value="seed">Seed</option>
            <option value="growth">Growth</option>
            <option value="pre-ipo">Pre-IPO</option>
          </select>
          <select
            value={filters.industry}
            onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
            className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-2 text-white"
            data-testid="filter-industry"
          >
            <option value="">Все отрасли</option>
            <option value="technology">Technology</option>
            <option value="energy">Energy</option>
            <option value="healthcare">Healthcare</option>
          </select>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={`/invest/${project.slug}`}
                className="group block h-full glass rounded-3xl overflow-hidden hover:border-[#E11D2E]/50 transition-all"
                data-testid={`project-card-${project.id}`}
              >
                <div className="relative h-48">
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  <div className="absolute top-4 right-4 bg-[#E11D2E] text-white text-xs px-3 py-1 rounded-full">
                    {project.stage.toUpperCase()}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#E11D2E] transition-colors">{project.title}</h3>
                  <p className="text-white/60 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">{project.industry}</span>
                    <span className="text-[#E11D2E] font-bold">{project.capital_required}</span>
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