import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Plus, Edit, Trash2, Save, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const tabs = [
    { value: 'services', label: 'Услуги', endpoint: '/services' },
    { value: 'cases', label: 'Кейсы', endpoint: '/cases' },
    { value: 'events', label: 'Мероприятия', endpoint: '/events' },
    { value: 'projects', label: 'Проекты', endpoint: '/projects' },
    { value: 'partners', label: 'Партнеры', endpoint: '/partners' },
    { value: 'articles', label: 'Статьи', endpoint: '/articles' },
    { value: 'team', label: 'Команда', endpoint: '/team' },
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const currentTab = tabs.find(t => t.value === activeTab);
      const response = await axios.get(`${API}${currentTab.endpoint}`);
      setData(response.data);
      setEditingItem(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Ошибка загрузки данных');
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingItem(getEmptyItem(activeTab));
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setIsCreating(false);
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        editingItem.id = Date.now().toString();
        await axios.post(`${API}/admin/${activeTab}`, editingItem, getAuthHeaders());
        toast.success('Создано успешно!');
      } else {
        await axios.put(`${API}/admin/${activeTab}/${editingItem.id}`, editingItem, getAuthHeaders());
        toast.success('Обновлено успешно!');
      }
      fetchData();
    } catch (error) {
      console.error('Error saving:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        handleLogout();
      } else {
        toast.error('Ошибка сохранения');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить этот элемент?')) return;
    try {
      await axios.delete(`${API}/admin/${activeTab}/${id}`, getAuthHeaders());
      toast.success('Удалено успешно!');
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        handleLogout();
      } else {
        toast.error('Ошибка удаления');
      }
    }
  };

  const getEmptyItem = (type) => {
    const base = { id: '', name: '', description: '', image_url: '' };
    switch (type) {
      case 'services':
        return { ...base, slug: '', features: [] };
      case 'cases':
        return { ...base, slug: '', title: '', client: '', category: '', challenge: '', solution: '', results: [], created_at: new Date().toISOString() };
      case 'events':
        return { ...base, slug: '', title: '', date: '', location: '', type: '', program: [] };
      case 'projects':
        return { ...base, slug: '', title: '', stage: '', industry: '', country: '', capital_required: '', timeline: '', status: 'active' };
      case 'partners':
        return { ...base, slug: '', categories: [], country: '', logo_url: '' };
      case 'articles':
        return { ...base, slug: '', title: '', excerpt: '', content: '', author: '', published_at: new Date().toISOString(), category: '' };
      case 'team':
        return { ...base, position: '', bio: '', linkedin: '' };
      default:
        return base;
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24" data-testid="admin-page">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-6xl font-black font-heading text-white mb-8 tracking-tighter uppercase">
            АДМИН-ПАНЕЛЬ
          </h1>
          <p className="text-white/70 mb-8">Управление контентом сайта</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass rounded-2xl p-2 mb-8 flex-wrap h-auto" data-testid="admin-tabs">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-xl px-6 py-3 data-[state=active]:bg-[#E11D2E] data-[state=active]:text-white"
                data-testid={`tab-${tab.value}`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="glass rounded-3xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">{tab.label}</h2>
                  <Button
                    onClick={handleCreate}
                    className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full"
                    data-testid="create-button"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Создать
                  </Button>
                </div>

                {/* List */}
                {!editingItem && (
                  <div className="space-y-4">
                    {data.map((item, idx) => (
                      <div key={item.id} className="bg-white/5 rounded-2xl p-6 flex justify-between items-start" data-testid={`item-${idx}`}>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{item.title || item.name}</h3>
                          <p className="text-white/60 text-sm line-clamp-2">{item.description || item.excerpt}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="bg-white/10 hover:bg-white/20 text-white"
                            data-testid={`edit-button-${idx}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
                            data-testid={`delete-button-${idx}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {data.length === 0 && (
                      <p className="text-white/40 text-center py-12">Нет данных. Создайте первый элемент.</p>
                    )}
                  </div>
                )}

                {/* Edit Form */}
                {editingItem && (
                  <div className="space-y-6" data-testid="edit-form">
                    <EditorForm
                      type={activeTab}
                      item={editingItem}
                      onChange={setEditingItem}
                    />
                    <div className="flex gap-4">
                      <Button
                        onClick={handleSave}
                        className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full"
                        data-testid="save-button"
                      >
                        <Save className="w-5 h-5 mr-2" />
                        Сохранить
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingItem(null);
                          setIsCreating(false);
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-full"
                        data-testid="cancel-button"
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function EditorForm({ type, item, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...item, [field]: value });
  };

  const commonFields = (
    <>
      {type !== 'team' && (
        <div>
          <Label className="text-white">Slug (URL)</Label>
          <Input
            value={item.slug || ''}
            onChange={(e) => handleChange('slug', e.target.value)}
            className="bg-zinc-900/50 border-white/10 text-white"
            placeholder="my-item-url"
          />
        </div>
      )}
      <div>
        <Label className="text-white">{type === 'team' ? 'Имя' : 'Название'}</Label>
        <Input
          value={item.name || item.title || ''}
          onChange={(e) => handleChange(type === 'cases' || type === 'events' || type === 'articles' ? 'title' : 'name', e.target.value)}
          className="bg-zinc-900/50 border-white/10 text-white"
        />
      </div>
      <div>
        <Label className="text-white">Описание</Label>
        <Textarea
          value={item.description || item.excerpt || ''}
          onChange={(e) => handleChange(type === 'articles' ? 'excerpt' : 'description', e.target.value)}
          className="bg-zinc-900/50 border-white/10 text-white"
          rows={3}
        />
      </div>
      <div>
        <Label className="text-white">URL изображения</Label>
        <Input
          value={item.image_url || item.logo_url || ''}
          onChange={(e) => handleChange(type === 'partners' ? 'logo_url' : 'image_url', e.target.value)}
          className="bg-zinc-900/50 border-white/10 text-white"
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </>
  );

  const specificFields = {
    cases: (
      <>
        <div>
          <Label className="text-white">Клиент</Label>
          <Input value={item.client || ''} onChange={(e) => handleChange('client', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white">Категория</Label>
          <Input value={item.category || ''} onChange={(e) => handleChange('category', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
      </>
    ),
    events: (
      <>
        <div>
          <Label className="text-white">Дата</Label>
          <Input type="date" value={item.date || ''} onChange={(e) => handleChange('date', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white">Локация</Label>
          <Input value={item.location || ''} onChange={(e) => handleChange('location', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
      </>
    ),
    projects: (
      <>
        <div>
          <Label className="text-white">Стадия</Label>
          <Input value={item.stage || ''} onChange={(e) => handleChange('stage', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white">Отрасль</Label>
          <Input value={item.industry || ''} onChange={(e) => handleChange('industry', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white">Требуемый капитал</Label>
          <Input value={item.capital_required || ''} onChange={(e) => handleChange('capital_required', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
      </>
    ),
    articles: (
      <>
        <div>
          <Label className="text-white">Автор</Label>
          <Input value={item.author || ''} onChange={(e) => handleChange('author', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white">Категория</Label>
          <Input value={item.category || ''} onChange={(e) => handleChange('category', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white">Контент</Label>
          <Textarea value={item.content || ''} onChange={(e) => handleChange('content', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" rows={8} />
        </div>
      </>
    ),
    team: (
      <>
        <div>
          <Label className="text-white">Должность</Label>
          <Input value={item.position || ''} onChange={(e) => handleChange('position', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white">Биография</Label>
          <Textarea value={item.bio || ''} onChange={(e) => handleChange('bio', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" rows={3} />
        </div>
        <div>
          <Label className="text-white">LinkedIn</Label>
          <Input value={item.linkedin || ''} onChange={(e) => handleChange('linkedin', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
      </>
    ),
  };

  return (
    <div className="space-y-4">
      {commonFields}
      {specificFields[type]}
    </div>
  );
}