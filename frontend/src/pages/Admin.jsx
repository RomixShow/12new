import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Plus, Edit, Trash2, Save, LogOut, Users, Key, Shield, User } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useFontCatalog } from '../hooks/useFontCatalog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [userRole, setUserRole] = useState('admin');
  const [currentUsername, setCurrentUsername] = useState('');
  
  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
  
  // User management state
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUserData, setNewUserData] = useState({ username: '', password: '', role: 'admin' });
  const [resetPasswordUserId, setResetPasswordUserId] = useState(null);
  const [resetPasswordValue, setResetPasswordValue] = useState('');

  // Site settings state
  const [siteSettings, setSiteSettings] = useState(null);

  // Dynamic pages state
  const [dynamicPages, setDynamicPages] = useState([]);
  const [editingPage, setEditingPage] = useState(null);
  const [isCreatingPage, setIsCreatingPage] = useState(false);

  // Forms state
  const [forms, setForms] = useState([]);
  const [editingForm, setEditingForm] = useState(null);
  const [isCreatingForm, setIsCreatingForm] = useState(false);

  // Submissions state
  const [submissions, setSubmissions] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState('all');

  // Media state
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaFile, setMediaFile] = useState(null);

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Verify auth and get role
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.post(`${API}/auth/verify`, {}, getAuthHeaders());
        setUserRole(response.data.role || 'admin');
        setCurrentUsername(response.data.username);
      } catch (error) {
        console.error('Auth error:', error);
        handleLogout();
      }
    };
    verifyAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const tabs = [
    { value: 'services', label: 'Services', endpoint: '/services' },
    { value: 'cases', label: 'Cases', endpoint: '/cases' },
    { value: 'events', label: 'Events', endpoint: '/events' },
    { value: 'projects', label: 'Projects', endpoint: '/projects' },
    { value: 'partners', label: 'Partners', endpoint: '/partners' },
    { value: 'articles', label: 'Articles', endpoint: '/articles' },
    { value: 'team', label: 'Team', endpoint: '/team' },
    { value: 'site_pages', label: 'Site Pages' },
    { value: 'navigation', label: 'Navigation & Footer' },
    { value: 'forms', label: 'Forms' },
    { value: 'submissions', label: 'Submissions' },
    { value: 'media', label: 'Media Library' },
    { value: 'theme', label: 'Theme' },
  ];

  // Add users tab for superadmin
  if (userRole === 'superadmin') {
    tabs.push({ value: 'users', label: 'Users', endpoint: '/admin/users', icon: Users });
  }

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'site_pages') {
      fetchDynamicPages();
    } else if (activeTab === 'navigation' || activeTab === 'theme') {
      fetchSiteSettings();
    } else if (activeTab === 'forms') {
      fetchForms();
    } else if (activeTab === 'submissions') {
      fetchForms();
      fetchSubmissions();
    } else if (activeTab === 'media') {
      fetchMedia();
    } else {
      fetchData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const currentTab = tabs.find(t => t.value === activeTab);
      if (!currentTab) return;
      const response = await axios.get(`${API}${currentTab.endpoint}`);
      setData(response.data);
      setEditingItem(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Ошибка загрузки данных');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/admin/users`, getAuthHeaders());
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 403) {
        toast.error('Нет доступа к управлению пользователями');
      }
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const response = await axios.get(`${API}/admin/settings`, getAuthHeaders());
      setSiteSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load site settings');
    }
  };

  const saveSiteSettings = async (settings) => {
    try {
      await axios.put(`${API}/admin/settings`, settings, getAuthHeaders());
      toast.success('Settings saved');
      setSiteSettings(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const fetchDynamicPages = async () => {
    try {
      const response = await axios.get(`${API}/admin/pages-dynamic`, getAuthHeaders());
      setDynamicPages(response.data);
      setEditingPage(null);
      setIsCreatingPage(false);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error('Failed to load pages');
    }
  };

  const fetchForms = async () => {
    try {
      const response = await axios.get(`${API}/admin/forms`, getAuthHeaders());
      setForms(response.data);
      setEditingForm(null);
      setIsCreatingForm(false);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Failed to load forms');
    }
  };

  const fetchSubmissions = async (formId = selectedFormId) => {
    try {
      const query = formId && formId !== 'all' ? `?form_id=${formId}` : '';
      const response = await axios.get(`${API}/admin/submissions${query}`, getAuthHeaders());
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    }
  };

  const fetchMedia = async () => {
    try {
      const response = await axios.get(`${API}/admin/media`, getAuthHeaders());
      setMediaItems(response.data);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('Failed to load media');
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

  // Password change handlers
  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Пароли не совпадают');
      return;
    }
    if (passwordData.new_password.length < 6) {
      toast.error('Пароль должен быть не менее 6 символов');
      return;
    }
    try {
      await axios.post(`${API}/auth/change-password`, {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      }, getAuthHeaders());
      toast.success('Пароль успешно изменен!');
      setShowPasswordModal(false);
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error('Ошибка смены пароля');
      }
    }
  };

  // User management handlers
  const handleCreateUser = async () => {
    if (!newUserData.username || !newUserData.password) {
      toast.error('Заполните все поля');
      return;
    }
    if (newUserData.password.length < 6) {
      toast.error('Пароль должен быть не менее 6 символов');
      return;
    }
    try {
      await axios.post(`${API}/admin/users`, newUserData, getAuthHeaders());
      toast.success('Пользователь создан!');
      setNewUserData({ username: '', password: '', role: 'admin' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error('Ошибка создания пользователя');
      }
    }
  };

  const handleUpdateUser = async (userId) => {
    try {
      await axios.put(`${API}/admin/users/${userId}`, editingUser, getAuthHeaders());
      toast.success('Пользователь обновлен!');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.detail || 'Ошибка обновления');
    }
  };

  const handleResetPassword = async (userId) => {
    if (resetPasswordValue.length < 6) {
      toast.error('Пароль должен быть не менее 6 символов');
      return;
    }
    try {
      await axios.put(`${API}/admin/users/${userId}/password`, { new_password: resetPasswordValue }, getAuthHeaders());
      toast.success('Пароль сброшен!');
      setResetPasswordUserId(null);
      setResetPasswordValue('');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Ошибка сброса пароля');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Удалить этого пользователя?')) return;
    try {
      await axios.delete(`${API}/admin/users/${userId}`, getAuthHeaders());
      toast.success('Пользователь удален!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.detail || 'Ошибка удаления');
    }
  };

  const handleCreatePage = () => {
    setIsCreatingPage(true);
    setEditingPage(getEmptyDynamicPage());
  };

  const handleEditPage = (page) => {
    setEditingPage({ ...page, hide_title: Boolean(page.hide_title), full_width: Boolean(page.full_width) });
    setIsCreatingPage(false);
  };

  const handleSavePage = async () => {
    try {
      if (isCreatingPage) {
        const payload = { ...editingPage, id: Date.now().toString(), hide_title: Boolean(editingPage.hide_title), full_width: Boolean(editingPage.full_width) };
        await axios.post(`${API}/admin/pages-dynamic`, payload, getAuthHeaders());
        toast.success('Page created');
      } else {
        await axios.put(`${API}/admin/pages-dynamic/${editingPage.id}`, { ...editingPage, hide_title: Boolean(editingPage.hide_title), full_width: Boolean(editingPage.full_width) }, getAuthHeaders());
        toast.success('Page updated');
      }
      fetchDynamicPages();
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Failed to save page');
    }
  };

  const handleDeletePage = async (pageId) => {
    if (!window.confirm('Delete this page?')) return;
    try {
      await axios.delete(`${API}/admin/pages-dynamic/${pageId}`, getAuthHeaders());
      toast.success('Page deleted');
      fetchDynamicPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Failed to delete page');
    }
  };

  const handleCreateForm = () => {
    setIsCreatingForm(true);
    setEditingForm(getEmptyForm());
  };

  const handleEditForm = (form) => {
    setEditingForm({ ...form });
    setIsCreatingForm(false);
  };

  const handleSaveForm = async () => {
    try {
      if (isCreatingForm) {
        const payload = { ...editingForm, id: Date.now().toString() };
        await axios.post(`${API}/admin/forms`, payload, getAuthHeaders());
        toast.success('Form created');
      } else {
        await axios.put(`${API}/admin/forms/${editingForm.id}`, editingForm, getAuthHeaders());
        toast.success('Form updated');
      }
      fetchForms();
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error('Failed to save form');
    }
  };

  const handleDeleteForm = async (formId) => {
    if (!window.confirm('Delete this form?')) return;
    try {
      await axios.delete(`${API}/admin/forms/${formId}`, getAuthHeaders());
      toast.success('Form deleted');
      fetchForms();
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('Failed to delete form');
    }
  };

  const handleUploadMedia = async () => {
    if (!mediaFile) return;
    try {
      const formData = new FormData();
      formData.append('file', mediaFile);
      await axios.post(`${API}/admin/media`, formData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Media uploaded');
      setMediaFile(null);
      fetchMedia();
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Failed to upload media');
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!window.confirm('Delete this media file?')) return;
    try {
      await axios.delete(`${API}/admin/media/${mediaId}`, getAuthHeaders());
      toast.success('Media deleted');
      fetchMedia();
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error('Failed to delete media');
    }
  };

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied');
    } catch (error) {
      console.error('Clipboard error:', error);
      toast.error('Failed to copy URL');
    }
  };

  const getEmptyDynamicPage = () => ({
    id: '',
    slug: '',
    title: '',
    title_en: '',
    blocks: [],
    hide_title: false,
    full_width: false,
  });

  const getEmptyForm = () => ({
    id: '',
    slug: '',
    title: '',
    title_en: '',
    submit_message: '',
    submit_message_en: '',
    fields: [],
  });

  const getEmptyField = () => ({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: 'text',
    label: '',
    label_en: '',
    required: false,
    options: [],
    options_en: [],
  });

  const getEmptyBlock = (type) => {
    const base = { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, type };
    switch (type) {
      case 'hero':
        return {
          ...base,
          title: '',
          title_en: '',
          subtitle: '',
          subtitle_en: '',
          cta_label: '',
          cta_label_en: '',
          cta_href: '',
          background_image: '',
          background_video: '',
          use_liquid: false,
          liquid_colors: [],
          liquid_settings: {
            mouseForce: 20,
            cursorSize: 100,
            resolution: 0.5,
            dt: 0.014,
            BFECC: true,
            isViscous: false,
            viscous: 30,
            iterationsViscous: 32,
            iterationsPoisson: 32,
            isBounce: false,
            autoDemo: true,
            autoSpeed: 0.5,
            autoIntensity: 2.2,
            takeoverDuration: 0.25,
            autoResumeDelay: 1000,
            autoRampDuration: 0.6,
          },
          full_bleed: false,
        };
      case 'text':
        return { ...base, heading: '', heading_en: '', body: '', body_en: '' };
      case 'image':
        return { ...base, url: '', caption: '', caption_en: '' };
      case 'gallery':
        return { ...base, images: [] };
      case 'video':
        return { ...base, source: 'youtube', url: '', title: '', title_en: '' };
      case 'form':
        return { ...base, form_slug: '' };
      case 'cards':
        return { ...base, title: '', title_en: '', items: [] };
      case 'stats':
        return { ...base, items: [] };
      case 'logo_grid':
        return { ...base, items: [] };
      case 'cta':
        return { ...base, title: '', title_en: '', body: '', body_en: '', button_label: '', button_label_en: '', button_href: '', background_image: '' };
      case 'list':
        return { ...base, title: '', title_en: '', items: [], items_en: [] };
      case 'collection':
        return { ...base, title: '', title_en: '', collection: 'services', limit: 0, detail_prefix: '' };
      case 'html':
        return { ...base, html: '', html_en: '' };
      case 'marquee':
        return { ...base, items: [] };
      case 'spacer':
        return { ...base, size: 32 };
      default:
        return base;
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
      case 'pages':
        return { id: '', slug: '', title: '', content: '', updated_at: new Date().toISOString() };
      default:
        return base;
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24" data-testid="admin-page">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-black font-heading text-white tracking-tighter uppercase">
                АДМИН-ПАНЕЛЬ
              </h1>
              <p className="text-white/70 mt-2">
                {currentUsername} ({userRole === 'superadmin' ? 'Суперадмин' : 'Админ'})
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowPasswordModal(true)}
                className="bg-white/10 hover:bg-white/20 text-white rounded-full"
                data-testid="change-password-button"
              >
                <Key className="w-5 h-5 mr-2" />
                Сменить пароль
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white rounded-full"
                data-testid="logout-button"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-3xl p-8 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Смена пароля</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Текущий пароль</Label>
                  <Input
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    className="bg-zinc-900/50 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Новый пароль</Label>
                  <Input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    className="bg-zinc-900/50 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Подтвердите новый пароль</Label>
                  <Input
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    className="bg-zinc-900/50 border-white/10 text-white"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-xl"
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleChangePassword}
                    className="flex-1 bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-xl"
                  >
                    Сохранить
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/5 rounded-full p-1 flex-wrap h-auto gap-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-[#E11D2E] data-[state=active]:text-white rounded-full px-4 py-2 text-white/70"
                data-testid={`tab-${tab.value}`}
              >
                {tab.icon && <tab.icon className="w-4 h-4 mr-2" />}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Users Tab Content */}
          {activeTab === 'users' && userRole === 'superadmin' && (
            <div className="glass rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Users className="w-6 h-6 mr-3 text-[#E11D2E]" />
                  Управление пользователями
                </h2>
              </div>

              {/* Create new user form */}
              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Добавить пользователя</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Логин"
                    value={newUserData.username}
                    onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                    className="bg-zinc-900/50 border-white/10 text-white"
                  />
                  <Input
                    type="password"
                    placeholder="Пароль"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    className="bg-zinc-900/50 border-white/10 text-white"
                  />
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="bg-zinc-900/50 border border-white/10 text-white rounded-lg px-4"
                  >
                    <option value="admin">Админ</option>
                    <option value="superadmin">Суперадмин</option>
                  </select>
                  <Button
                    onClick={handleCreateUser}
                    className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Создать
                  </Button>
                </div>
              </div>

              {/* Users list */}
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="glass rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#E11D2E]/20 flex items-center justify-center">
                        {user.role === 'superadmin' ? (
                          <Shield className="w-6 h-6 text-[#E11D2E]" />
                        ) : (
                          <User className="w-6 h-6 text-white/60" />
                        )}
                      </div>
                      <div>
                        {editingUser?.id === user.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editingUser.username}
                              onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                              className="bg-zinc-900/50 border-white/10 text-white w-40"
                            />
                            <select
                              value={editingUser.role}
                              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                              className="bg-zinc-900/50 border border-white/10 text-white rounded-lg px-3 py-2"
                            >
                              <option value="admin">Админ</option>
                              <option value="superadmin">Суперадмин</option>
                            </select>
                          </div>
                        ) : (
                          <>
                            <p className="text-white font-bold">{user.username}</p>
                            <p className="text-white/60 text-sm">
                              {user.role === 'superadmin' ? 'Суперадмин' : 'Админ'} • {new Date(user.created_at).toLocaleDateString('ru-RU')}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Reset password form */}
                    {resetPasswordUserId === user.id && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="password"
                          placeholder="Новый пароль"
                          value={resetPasswordValue}
                          onChange={(e) => setResetPasswordValue(e.target.value)}
                          className="bg-zinc-900/50 border-white/10 text-white w-40"
                        />
                        <Button
                          onClick={() => handleResetPassword(user.id)}
                          className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-3"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => { setResetPasswordUserId(null); setResetPasswordValue(''); }}
                          className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-3"
                        >
                          ✕
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {editingUser?.id === user.id ? (
                        <>
                          <Button
                            onClick={() => handleUpdateUser(user.id)}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Сохранить
                          </Button>
                          <Button
                            onClick={() => setEditingUser(null)}
                            className="bg-white/10 hover:bg-white/20 text-white rounded-lg"
                          >
                            Отмена
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => setEditingUser({ ...user })}
                            className="bg-white/10 hover:bg-white/20 text-white rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => setResetPasswordUserId(user.id)}
                            className="bg-white/10 hover:bg-white/20 text-white rounded-lg"
                            title="Сбросить пароль"
                          >
                            <Key className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <TabsContent value="site_pages" className="mt-6">
            <div className="glass rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Site Pages</h2>
                <Button onClick={handleCreatePage} className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full">
                  <Plus className="w-5 h-5 mr-2" />
                  New Page
                </Button>
              </div>

              {(editingPage || isCreatingPage) && (
                <DynamicPageEditor
                  page={editingPage}
                  onChange={setEditingPage}
                  onSave={handleSavePage}
                  onCancel={() => { setEditingPage(null); setIsCreatingPage(false); }}
                  createBlock={getEmptyBlock}
                />
              )}

              {!editingPage && !isCreatingPage && (
                <div className="space-y-4">
                  {dynamicPages.map((page) => (
                    <div key={page.id} className="glass rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-bold">{page.title}</h3>
                        <p className="text-white/60 text-sm">/{page.slug}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => handleEditPage(page)} className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => handleDeletePage(page.id)} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {dynamicPages.length === 0 && (
                    <p className="text-white/40 text-center py-12">No pages yet.</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="navigation" className="mt-6">
            <div className="glass rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Navigation & Footer</h2>
                <Button
                  onClick={() => saveSiteSettings(siteSettings)}
                  disabled={!siteSettings}
                  className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Settings
                </Button>
              </div>
              {!siteSettings ? (
                <p className="text-white/60">Loading...</p>
              ) : (
                <SettingsEditor settings={siteSettings} setSettings={setSiteSettings} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="forms" className="mt-6">
            <div className="glass rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Forms</h2>
                <Button
                  onClick={handleCreateForm}
                  className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Form
                </Button>
              </div>

              {(editingForm || isCreatingForm) && (
                <FormEditor
                  form={editingForm}
                  onChange={setEditingForm}
                  onSave={handleSaveForm}
                  onCancel={() => { setEditingForm(null); setIsCreatingForm(false); }}
                  createField={getEmptyField}
                />
              )}

              {!editingForm && !isCreatingForm && (
                <div className="space-y-4">
                  {forms.map((form) => (
                    <div key={form.id} className="glass rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-bold">{form.title}</h3>
                        <p className="text-white/60 text-sm">/{form.slug}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => handleEditForm(form)} className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => handleDeleteForm(form.id)} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {forms.length === 0 && (
                    <p className="text-white/40 text-center py-12">No forms yet.</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="submissions" className="mt-6">
            <div className="glass rounded-3xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white">Submissions</h2>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                  <select
                    value={selectedFormId}
                    onChange={(e) => {
                      setSelectedFormId(e.target.value);
                      fetchSubmissions(e.target.value);
                    }}
                    className="bg-zinc-900/50 border border-white/10 text-white rounded-lg px-4 py-2"
                  >
                    <option value="all">All forms</option>
                    {forms.map((form) => (
                      <option key={form.id} value={form.id}>{form.title}</option>
                    ))}
                  </select>
                  <Button onClick={() => fetchSubmissions()} className="bg-white/10 hover:bg-white/20 text-white rounded-xl">
                    Refresh
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {submissions.map((submission) => {
                  const form = forms.find((f) => f.id === submission.form_id);
                  return (
                    <div key={submission.id} className="glass rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-bold">{form?.title || 'Form'}</p>
                        <p className="text-white/50 text-sm">{new Date(submission.created_at).toLocaleString()}</p>
                      </div>
                      <div className="text-white/70 text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(submission.payload || {}).map(([key, value]) => (
                          <div key={key} className="bg-black/30 rounded-lg px-3 py-2">
                            <span className="text-white/50">{key}:</span> {String(value)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {submissions.length === 0 && (
                  <p className="text-white/40 text-center py-12">No submissions yet.</p>
                )}
              </div>
            </div>
          </TabsContent>


          <TabsContent value="media" className="mt-6">
            <div className="glass rounded-3xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white">Media Library</h2>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                  <Input type="file" onChange={(e) => setMediaFile(e.target.files?.[0] || null)} className="bg-zinc-900/50 border-white/10 text-white" />
                  <Button onClick={handleUploadMedia} className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-xl">
                    Upload
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediaItems.map((media) => {
                  const url = media.url?.startsWith('http') ? media.url : `${BACKEND_URL || ''}${media.url || ''}`;
                  const isImage = media.content_type?.startsWith('image');
                  return (
                    <div key={media.id} className="glass rounded-2xl p-4 space-y-3">
                      <div className="rounded-xl overflow-hidden bg-black/40">
                        {isImage ? (
                          <img src={url} alt={media.original_name || ''} className="w-full h-40 object-cover" />
                        ) : (
                          <video src={url} className="w-full h-40 object-cover" />
                        )}
                      </div>
                      <div className="text-white/70 text-sm truncate">{media.original_name || media.filename}</div>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => handleCopyUrl(url)} className="bg-white/10 hover:bg-white/20 text-white rounded-lg">Copy URL</Button>
                        <Button onClick={() => handleDeleteMedia(media.id)} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg">Delete</Button>
                      </div>
                    </div>
                  );
                })}
                {mediaItems.length === 0 && (
                  <p className="text-white/40 text-center col-span-full">No media yet.</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="theme" className="mt-6">
            <div className="glass rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Theme</h2>
                <Button
                  onClick={() => saveSiteSettings(siteSettings)}
                  disabled={!siteSettings}
                  className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Theme
                </Button>
              </div>
              {!siteSettings ? (
                <p className="text-white/60">Loading...</p>
              ) : (
                <ThemeEditor settings={siteSettings} setSettings={setSiteSettings} />
              )}
            </div>
          </TabsContent>

          {/* Content Tabs */}
          {tabs.filter(t => t.value !== 'users' && t.endpoint).map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              <div className="glass rounded-3xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
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

                {/* Edit Form */}
                {(editingItem || isCreating) && (
                  <EditForm
                    item={editingItem}
                    type={activeTab}
                    onSave={handleSave}
                    onCancel={() => { setEditingItem(null); setIsCreating(false); }}
                    onChange={(field, value) => setEditingItem({ ...editingItem, [field]: value })}
                  />
                )}

                {/* Items List */}
                {!editingItem && !isCreating && (
                  <div className="space-y-4">
                    {data.map((item, idx) => (
                      <div
                        key={item.id}
                        className="glass rounded-2xl p-4 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <h3 className="text-white font-bold">{item.name || item.title || item.slug}</h3>
                          <p className="text-white/60 text-sm truncate max-w-md">
                            {item.description || item.excerpt || item.content?.substring(0, 100)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            onClick={() => handleEdit(item)}
                            className="bg-white/10 hover:bg-white/20 text-white rounded-lg"
                            data-testid={`edit-button-${idx}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"
                            data-testid={`delete-button-${idx}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {data.length === 0 && (
                      <p className="text-white/40 text-center py-12">Нет данных</p>
                    )}
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

function DynamicPageEditor({ page, onChange, onSave, onCancel, createBlock }) {
  const updateField = (field, value) => {
    onChange({ ...page, [field]: value });
  };

  const updateBlocks = (blocks) => {
    onChange({ ...page, blocks });
  };

  return (
    <div className="glass rounded-2xl p-6 mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-white">Slug</Label>
          <Input
            value={page.slug || ''}
            onChange={(e) => updateField('slug', e.target.value)}
            className="bg-zinc-900/50 border-white/10 text-white"
          />
        </div>
        <div>
          <Label className="text-white">Title (RU)</Label>
          <Input
            value={page.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            className="bg-zinc-900/50 border-white/10 text-white"
          />
        </div>
        <div>
          <Label className="text-white">Title (EN)</Label>
          <Input
            value={page.title_en || ''}
            onChange={(e) => updateField('title_en', e.target.value)}
            className="bg-zinc-900/50 border-white/10 text-white"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-white/70 text-sm">
        <input
          type="checkbox"
          checked={Boolean(page.hide_title)}
          onChange={(e) => updateField('hide_title', e.target.checked)}
        />
        Hide page title
      </label>
      <label className="flex items-center gap-2 text-white/70 text-sm">
        <input
          type="checkbox"
          checked={Boolean(page.full_width)}
          onChange={(e) => updateField('full_width', e.target.checked)}
        />
        Full width layout
      </label>

      <BlocksEditor blocks={page.blocks || []} onChange={updateBlocks} createBlock={createBlock} />

      <div className="flex gap-4 pt-4">
        <Button onClick={onCancel} className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-xl">
          Cancel
        </Button>
        <Button onClick={onSave} className="flex-1 bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-xl">
          <Save className="w-5 h-5 mr-2" />
          Save Page
        </Button>
      </div>
    </div>
  );
}

function BlocksEditor({ blocks, onChange, createBlock }) {
  const blockTypes = ['hero', 'text', 'image', 'gallery', 'video', 'form', 'cards', 'stats', 'logo_grid', 'cta', 'list', 'collection', 'html', 'marquee', 'spacer'];

  const updateBlock = (index, field, value) => {
    const next = [...blocks];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const removeBlock = (index) => {
    const next = blocks.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const moveBlock = (index, direction) => {
    const next = [...blocks];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const addBlock = (type) => {
    onChange([...(blocks || []), createBlock(type)]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {blockTypes.map((type) => (
          <Button
            key={type}
            onClick={() => addBlock(type)}
            className="bg-white/10 hover:bg-white/20 text-white rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add {type}
          </Button>
        ))}
      </div>

      {blocks.map((block, index) => (
        <div key={block.id || index} className="glass rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-white font-bold uppercase text-sm">{block.type}</p>
            <div className="flex items-center gap-2">
              <Button onClick={() => moveBlock(index, -1)} className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
                Up
              </Button>
              <Button onClick={() => moveBlock(index, 1)} className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
                Down
              </Button>
              <Button onClick={() => removeBlock(index)} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg">
                Remove
              </Button>
            </div>
          </div>

          {block.type === 'hero' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={block.title || ''}
                onChange={(e) => updateBlock(index, 'title', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Title (RU)"
              />
              <Input
                value={block.title_en || ''}
                onChange={(e) => updateBlock(index, 'title_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Title (EN)"
              />
              <Input
                value={block.subtitle || ''}
                onChange={(e) => updateBlock(index, 'subtitle', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Subtitle (RU)"
              />
              <Input
                value={block.subtitle_en || ''}
                onChange={(e) => updateBlock(index, 'subtitle_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Subtitle (EN)"
              />
              <Input
                value={block.cta_label || ''}
                onChange={(e) => updateBlock(index, 'cta_label', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="CTA label (RU)"
              />
              <Input
                value={block.cta_label_en || ''}
                onChange={(e) => updateBlock(index, 'cta_label_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="CTA label (EN)"
              />
              <Input
                value={block.cta_href || ''}
                onChange={(e) => updateBlock(index, 'cta_href', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="CTA link"
              />
              <Input
                value={block.background_image || ''}
                onChange={(e) => updateBlock(index, 'background_image', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Background image URL"
              />
              <Input
                value={block.background_video || ''}
                onChange={(e) => updateBlock(index, 'background_video', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Background video URL"
              />
              <label className="flex items-center gap-2 text-white/70 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(block.full_bleed)}
                  onChange={(e) => updateBlock(index, 'full_bleed', e.target.checked)}
                />
                Full screen hero
              </label>
              <label className="flex items-center gap-2 text-white/70 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(block.use_liquid)}
                  onChange={(e) => updateBlock(index, 'use_liquid', e.target.checked)}
                />
                Use liquid background
              </label>
              {block.use_liquid && (() => {
                const liquidSettings = block.liquid_settings || {};
                const colors = (block.liquid_colors && block.liquid_colors.length)
                  ? block.liquid_colors
                  : ['#5227FF', '#FF9FFC', '#B19EEF'];
                const setColors = (next) => updateBlock(index, 'liquid_colors', next);
                const updateLiquid = (field, value) => updateBlock(index, 'liquid_settings', { ...liquidSettings, [field]: value });

                return (
                  <div className="md:col-span-2 border-t border-white/10 pt-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white/70 text-xs">Liquid colors</Label>
                      <div className="flex flex-wrap gap-3">
                        {colors.map((color, colorIndex) => (
                          <div key={`${color}-${colorIndex}`} className="flex items-center gap-2">
                            <input
                              type="color"
                              value={color}
                              onChange={(e) => {
                                const next = [...colors];
                                next[colorIndex] = e.target.value;
                                setColors(next);
                              }}
                              className="h-9 w-9 rounded border border-white/10 bg-transparent"
                            />
                            <Input
                              value={color}
                              onChange={(e) => {
                                const next = [...colors];
                                next[colorIndex] = e.target.value;
                                setColors(next);
                              }}
                              className="bg-zinc-900/50 border-white/10 text-white w-32"
                            />
                            {colors.length > 2 && (
                              <Button
                                onClick={() => setColors(colors.filter((_, idx) => idx !== colorIndex))}
                                className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          onClick={() => setColors([...colors, '#FFFFFF'])}
                          className="bg-white/10 hover:bg-white/20 text-white rounded-lg"
                        >
                          Add color
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-white/70 text-xs">Mouse force</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={liquidSettings.mouseForce ?? 20}
                          onChange={(e) => updateLiquid('mouseForce', Number(e.target.value))}
                          className="bg-zinc-900/50 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white/70 text-xs">Cursor size</Label>
                        <Input
                          type="number"
                          step="1"
                          value={liquidSettings.cursorSize ?? 100}
                          onChange={(e) => updateLiquid('cursorSize', Number(e.target.value))}
                          className="bg-zinc-900/50 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white/70 text-xs">Resolution</Label>
                        <Input
                          type="number"
                          step="0.05"
                          value={liquidSettings.resolution ?? 0.5}
                          onChange={(e) => updateLiquid('resolution', Number(e.target.value))}
                          className="bg-zinc-900/50 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white/70 text-xs">dt</Label>
                        <Input
                          type="number"
                          step="0.001"
                          value={liquidSettings.dt ?? 0.014}
                          onChange={(e) => updateLiquid('dt', Number(e.target.value))}
                          className="bg-zinc-900/50 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white/70 text-xs">Viscous</Label>
                        <Input
                          type="number"
                          step="1"
                          value={liquidSettings.viscous ?? 30}
                          onChange={(e) => updateLiquid('viscous', Number(e.target.value))}
                          className="bg-zinc-900/50 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white/70 text-xs">Viscous iterations</Label>
                        <Input
                          type="number"
                          step="1"
                          value={liquidSettings.iterationsViscous ?? 32}
                          onChange={(e) => updateLiquid('iterationsViscous', Number(e.target.value))}
                          className="bg-zinc-900/50 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white/70 text-xs">Pressure iterations</Label>
                        <Input
                          type="number"
                          step="1"
                          value={liquidSettings.iterationsPoisson ?? 32}
                          onChange={(e) => updateLiquid('iterationsPoisson', Number(e.target.value))}
                          className="bg-zinc-900/50 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white/70 text-xs">Auto speed</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={liquidSettings.autoSpeed ?? 0.5}
                          onChange={(e) => updateLiquid('autoSpeed', Number(e.target.value))}
                          className="bg-zinc-900/50 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white/70 text-xs">Auto intensity</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={liquidSettings.autoIntensity ?? 2.2}
                          onChange={(e) => updateLiquid('autoIntensity', Number(e.target.value))}
                          className="bg-zinc-900/50 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white/70 text-xs">Auto resume delay (ms)</Label>
                        <Input
                          type="number"
                          step="100"
                          value={liquidSettings.autoResumeDelay ?? 1000}
                          onChange={(e) => updateLiquid('autoResumeDelay', Number(e.target.value))}
                          className="bg-zinc-900/50 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white/70 text-xs">Auto ramp (s)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={liquidSettings.autoRampDuration ?? 0.6}
                          onChange={(e) => updateLiquid('autoRampDuration', Number(e.target.value))}
                          className="bg-zinc-900/50 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-white/70 text-xs">Takeover duration (s)</Label>
                        <Input
                          type="number"
                          step="0.05"
                          value={liquidSettings.takeoverDuration ?? 0.25}
                          onChange={(e) => updateLiquid('takeoverDuration', Number(e.target.value))}
                          className="bg-zinc-900/50 border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-white/70 text-sm">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={liquidSettings.BFECC ?? true}
                          onChange={(e) => updateLiquid('BFECC', e.target.checked)}
                        />
                        BFECC
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={liquidSettings.isViscous ?? false}
                          onChange={(e) => updateLiquid('isViscous', e.target.checked)}
                        />
                        Viscous
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={liquidSettings.isBounce ?? false}
                          onChange={(e) => updateLiquid('isBounce', e.target.checked)}
                        />
                        Bounce edges
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={liquidSettings.autoDemo ?? true}
                          onChange={(e) => updateLiquid('autoDemo', e.target.checked)}
                        />
                        Auto animate
                      </label>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {block.type === 'text' && (
            <div className="space-y-3">
              <Input
                value={block.heading || ''}
                onChange={(e) => updateBlock(index, 'heading', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Heading (RU)"
              />
              <Input
                value={block.heading_en || ''}
                onChange={(e) => updateBlock(index, 'heading_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Heading (EN)"
              />
              <Textarea
                value={block.body || ''}
                onChange={(e) => updateBlock(index, 'body', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Body (RU)"
                rows={4}
              />
              <Textarea
                value={block.body_en || ''}
                onChange={(e) => updateBlock(index, 'body_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Body (EN)"
                rows={4}
              />
            </div>
          )}

          {block.type === 'image' && (
            <div className="space-y-3">
              <Input
                value={block.url || ''}
                onChange={(e) => updateBlock(index, 'url', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Image URL"
              />
              <Input
                value={block.caption || ''}
                onChange={(e) => updateBlock(index, 'caption', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Caption (RU)"
              />
              <Input
                value={block.caption_en || ''}
                onChange={(e) => updateBlock(index, 'caption_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Caption (EN)"
              />
            </div>
          )}

          {block.type === 'gallery' && (
            <Textarea
              value={(block.images || []).join(', ')}
              onChange={(e) => updateBlock(index, 'images', e.target.value.split(',').map((item) => item.trim()).filter(Boolean))}
              className="bg-zinc-900/50 border-white/10 text-white"
              placeholder="Image URLs (comma separated)"
              rows={3}
            />
          )}

          {block.type === 'video' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={block.source || 'youtube'}
                onChange={(e) => updateBlock(index, 'source', e.target.value)}
                className="bg-zinc-900/50 border border-white/10 text-white rounded-lg px-4 py-2"
              >
                <option value="youtube">YouTube</option>
                <option value="local">Local</option>
              </select>
              <Input
                value={block.url || ''}
                onChange={(e) => updateBlock(index, 'url', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Video URL"
              />
              <Input
                value={block.title || ''}
                onChange={(e) => updateBlock(index, 'title', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Title (RU)"
              />
              <Input
                value={block.title_en || ''}
                onChange={(e) => updateBlock(index, 'title_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Title (EN)"
              />
            </div>
          )}

          {block.type === 'form' && (
            <Input
              value={block.form_slug || ''}
              onChange={(e) => updateBlock(index, 'form_slug', e.target.value)}
              className="bg-zinc-900/50 border-white/10 text-white"
              placeholder="Form slug"
            />
          )}

          {block.type === 'cards' && (
            <div className="space-y-3">
              <Input
                value={block.title || ''}
                onChange={(e) => updateBlock(index, 'title', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Section title (RU)"
              />
              <Input
                value={block.title_en || ''}
                onChange={(e) => updateBlock(index, 'title_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Section title (EN)"
              />
              <Button
                onClick={() => updateBlock(index, 'items', [...(block.items || []), { title: '', title_en: '', description: '', description_en: '', image_url: '', icon_url: '', link: '' }])}
                className="bg-white/10 hover:bg-white/20 text-white rounded-lg"
              >
                Add card
              </Button>
              {(block.items || []).map((item, itemIndex) => (
                <div key={`${item.title}-${itemIndex}`} className="glass rounded-xl p-4 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      value={item.title || ''}
                      onChange={(e) => {
                        const next = [...(block.items || [])];
                        next[itemIndex] = { ...item, title: e.target.value };
                        updateBlock(index, 'items', next);
                      }}
                      className="bg-zinc-900/50 border-white/10 text-white"
                      placeholder="Title (RU)"
                    />
                    <Input
                      value={item.title_en || ''}
                      onChange={(e) => {
                        const next = [...(block.items || [])];
                        next[itemIndex] = { ...item, title_en: e.target.value };
                        updateBlock(index, 'items', next);
                      }}
                      className="bg-zinc-900/50 border-white/10 text-white"
                      placeholder="Title (EN)"
                    />
                    <Input
                      value={item.image_url || ''}
                      onChange={(e) => {
                        const next = [...(block.items || [])];
                        next[itemIndex] = { ...item, image_url: e.target.value };
                        updateBlock(index, 'items', next);
                      }}
                      className="bg-zinc-900/50 border-white/10 text-white"
                      placeholder="Image URL"
                    />
                    <Input
                      value={item.icon_url || ''}
                      onChange={(e) => {
                        const next = [...(block.items || [])];
                        next[itemIndex] = { ...item, icon_url: e.target.value };
                        updateBlock(index, 'items', next);
                      }}
                      className="bg-zinc-900/50 border-white/10 text-white"
                      placeholder="Icon URL (PNG)"
                    />
                    <Input
                      value={item.link || ''}
                      onChange={(e) => {
                        const next = [...(block.items || [])];
                        next[itemIndex] = { ...item, link: e.target.value };
                        updateBlock(index, 'items', next);
                      }}
                      className="bg-zinc-900/50 border-white/10 text-white"
                      placeholder="Link"
                    />
                  </div>
                  <Textarea
                    value={item.description || ''}
                    onChange={(e) => {
                      const next = [...(block.items || [])];
                      next[itemIndex] = { ...item, description: e.target.value };
                      updateBlock(index, 'items', next);
                    }}
                    className="bg-zinc-900/50 border-white/10 text-white"
                    placeholder="Description (RU)"
                    rows={2}
                  />
                  <Textarea
                    value={item.description_en || ''}
                    onChange={(e) => {
                      const next = [...(block.items || [])];
                      next[itemIndex] = { ...item, description_en: e.target.value };
                      updateBlock(index, 'items', next);
                    }}
                    className="bg-zinc-900/50 border-white/10 text-white"
                    placeholder="Description (EN)"
                    rows={2}
                  />
                  <Button
                    onClick={() => {
                      const next = (block.items || []).filter((_, idx) => idx !== itemIndex);
                      updateBlock(index, 'items', next);
                    }}
                    className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"
                  >
                    Remove card
                  </Button>
                </div>
              ))}
            </div>
          )}

          {block.type === 'stats' && (
            <div className="space-y-3">
              <Button
                onClick={() => updateBlock(index, 'items', [...(block.items || []), { value: '', label: '', label_en: '', suffix: '' }])}
                className="bg-white/10 hover:bg-white/20 text-white rounded-lg"
              >
                Add stat
              </Button>
              {(block.items || []).map((item, itemIndex) => (
                <div key={`${item.value}-${itemIndex}`} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <Input
                    value={item.value || ''}
                    onChange={(e) => {
                      const next = [...(block.items || [])];
                      next[itemIndex] = { ...item, value: e.target.value };
                      updateBlock(index, 'items', next);
                    }}
                    className="bg-zinc-900/50 border-white/10 text-white"
                    placeholder="Value"
                  />
                  <Input
                    value={item.suffix || ''}
                    onChange={(e) => {
                      const next = [...(block.items || [])];
                      next[itemIndex] = { ...item, suffix: e.target.value };
                      updateBlock(index, 'items', next);
                    }}
                    className="bg-zinc-900/50 border-white/10 text-white"
                    placeholder="Suffix"
                  />
                  <Input
                    value={item.label || ''}
                    onChange={(e) => {
                      const next = [...(block.items || [])];
                      next[itemIndex] = { ...item, label: e.target.value };
                      updateBlock(index, 'items', next);
                    }}
                    className="bg-zinc-900/50 border-white/10 text-white"
                    placeholder="Label (RU)"
                  />
                  <Input
                    value={item.label_en || ''}
                    onChange={(e) => {
                      const next = [...(block.items || [])];
                      next[itemIndex] = { ...item, label_en: e.target.value };
                      updateBlock(index, 'items', next);
                    }}
                    className="bg-zinc-900/50 border-white/10 text-white"
                    placeholder="Label (EN)"
                  />
                  <Button
                    onClick={() => {
                      const next = (block.items || []).filter((_, idx) => idx !== itemIndex);
                      updateBlock(index, 'items', next);
                    }}
                    className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          {block.type === 'logo_grid' && (
            <div className="space-y-3">
              <Button
                onClick={() => updateBlock(index, 'items', [...(block.items || []), { image_url: '', link: '' }])}
                className="bg-white/10 hover:bg-white/20 text-white rounded-lg"
              >
                Add logo
              </Button>
              {(block.items || []).map((item, itemIndex) => (
                <div key={`${item.image_url}-${itemIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    value={item.image_url || ''}
                    onChange={(e) => {
                      const next = [...(block.items || [])];
                      next[itemIndex] = { ...item, image_url: e.target.value };
                      updateBlock(index, 'items', next);
                    }}
                    className="bg-zinc-900/50 border-white/10 text-white"
                    placeholder="Logo URL"
                  />
                  <Input
                    value={item.link || ''}
                    onChange={(e) => {
                      const next = [...(block.items || [])];
                      next[itemIndex] = { ...item, link: e.target.value };
                      updateBlock(index, 'items', next);
                    }}
                    className="bg-zinc-900/50 border-white/10 text-white"
                    placeholder="Link (optional)"
                  />
                  <Button
                    onClick={() => {
                      const next = (block.items || []).filter((_, idx) => idx !== itemIndex);
                      updateBlock(index, 'items', next);
                    }}
                    className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          {block.type === 'cta' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                value={block.title || ''}
                onChange={(e) => updateBlock(index, 'title', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Title (RU)"
              />
              <Input
                value={block.title_en || ''}
                onChange={(e) => updateBlock(index, 'title_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Title (EN)"
              />
              <Textarea
                value={block.body || ''}
                onChange={(e) => updateBlock(index, 'body', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Body (RU)"
                rows={3}
              />
              <Textarea
                value={block.body_en || ''}
                onChange={(e) => updateBlock(index, 'body_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Body (EN)"
                rows={3}
              />
              <Input
                value={block.button_label || ''}
                onChange={(e) => updateBlock(index, 'button_label', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Button label (RU)"
              />
              <Input
                value={block.button_label_en || ''}
                onChange={(e) => updateBlock(index, 'button_label_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Button label (EN)"
              />
              <Input
                value={block.button_href || ''}
                onChange={(e) => updateBlock(index, 'button_href', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Button link"
              />
              <Input
                value={block.background_image || ''}
                onChange={(e) => updateBlock(index, 'background_image', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Background image URL"
              />
            </div>
          )}

          {block.type === 'list' && (
            <div className="space-y-2">
              <Input
                value={block.title || ''}
                onChange={(e) => updateBlock(index, 'title', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Title (RU)"
              />
              <Input
                value={block.title_en || ''}
                onChange={(e) => updateBlock(index, 'title_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Title (EN)"
              />
              <Textarea
                value={(block.items || []).join(', ')}
                onChange={(e) => updateBlock(index, 'items', e.target.value.split(',').map((item) => item.trim()).filter(Boolean))}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Items (RU, comma separated)"
                rows={3}
              />
              <Textarea
                value={(block.items_en || []).join(', ')}
                onChange={(e) => updateBlock(index, 'items_en', e.target.value.split(',').map((item) => item.trim()).filter(Boolean))}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Items (EN, comma separated)"
                rows={3}
              />
            </div>
          )}

          {block.type === 'collection' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                value={block.title || ''}
                onChange={(e) => updateBlock(index, 'title', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Title (RU)"
              />
              <Input
                value={block.title_en || ''}
                onChange={(e) => updateBlock(index, 'title_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Title (EN)"
              />
              <select
                value={block.collection || 'services'}
                onChange={(e) => updateBlock(index, 'collection', e.target.value)}
                className="bg-zinc-900/50 border border-white/10 text-white rounded-lg px-4 py-2"
              >
                <option value="services">services</option>
                <option value="cases">cases</option>
                <option value="events">events</option>
                <option value="projects">projects</option>
                <option value="partners">partners</option>
                <option value="articles">articles</option>
                <option value="team">team</option>
              </select>
              <Input
                type="number"
                value={block.limit || 0}
                onChange={(e) => updateBlock(index, 'limit', Number(e.target.value))}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Limit (0 = all)"
              />
              <Input
                value={block.detail_prefix || ''}
                onChange={(e) => updateBlock(index, 'detail_prefix', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Detail prefix (e.g. /services)"
              />
            </div>
          )}

          {block.type === 'html' && (
            <div className="space-y-3">
              <Textarea
                value={block.html || ''}
                onChange={(e) => updateBlock(index, 'html', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white font-mono text-sm"
                placeholder="HTML (RU)"
                rows={8}
              />
              <Textarea
                value={block.html_en || ''}
                onChange={(e) => updateBlock(index, 'html_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white font-mono text-sm"
                placeholder="HTML (EN)"
                rows={8}
              />
            </div>
          )}

          {block.type === 'marquee' && (
            <div className="space-y-3">
              <Button
                onClick={() => updateBlock(index, 'items', [...(block.items || []), { image_url: '', link: '' }])}
                className="bg-white/10 hover:bg-white/20 text-white rounded-lg"
              >
                Add logo
              </Button>
              {(block.items || []).map((item, itemIndex) => (
                <div key={`${item.image_url}-${itemIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    value={item.image_url || ''}
                    onChange={(e) => {
                      const next = [...(block.items || [])];
                      next[itemIndex] = { ...item, image_url: e.target.value };
                      updateBlock(index, 'items', next);
                    }}
                    className="bg-zinc-900/50 border-white/10 text-white"
                    placeholder="Logo URL"
                  />
                  <Input
                    value={item.link || ''}
                    onChange={(e) => {
                      const next = [...(block.items || [])];
                      next[itemIndex] = { ...item, link: e.target.value };
                      updateBlock(index, 'items', next);
                    }}
                    className="bg-zinc-900/50 border-white/10 text-white"
                    placeholder="Link (optional)"
                  />
                  <Button
                    onClick={() => {
                      const next = (block.items || []).filter((_, idx) => idx !== itemIndex);
                      updateBlock(index, 'items', next);
                    }}
                    className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          {block.type === 'spacer' && (
            <Input
              type="number"
              value={block.size || 32}
              onChange={(e) => updateBlock(index, 'size', Number(e.target.value))}
              className="bg-zinc-900/50 border-white/10 text-white"
              placeholder="Height (px)"
            />
          )}
        </div>
      ))}
    </div>
  );
}

function FormEditor({ form, onChange, onSave, onCancel, createField }) {
  const updateField = (field, value) => {
    onChange({ ...form, [field]: value });
  };

  const updateFields = (fields) => {
    onChange({ ...form, fields });
  };

  const addField = () => {
    updateFields([...(form.fields || []), createField()]);
  };

  const updateFormField = (index, field, value) => {
    const next = [...form.fields];
    next[index] = { ...next[index], [field]: value };
    updateFields(next);
  };

  const removeField = (index) => {
    updateFields(form.fields.filter((_, idx) => idx !== index));
  };

  return (
    <div className="glass rounded-2xl p-6 mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          value={form.slug || ''}
          onChange={(e) => updateField('slug', e.target.value)}
          className="bg-zinc-900/50 border-white/10 text-white"
          placeholder="Slug"
        />
        <Input
          value={form.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          className="bg-zinc-900/50 border-white/10 text-white"
          placeholder="Title (RU)"
        />
        <Input
          value={form.title_en || ''}
          onChange={(e) => updateField('title_en', e.target.value)}
          className="bg-zinc-900/50 border-white/10 text-white"
          placeholder="Title (EN)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          value={form.submit_message || ''}
          onChange={(e) => updateField('submit_message', e.target.value)}
          className="bg-zinc-900/50 border-white/10 text-white"
          placeholder="Submit message (RU)"
        />
        <Input
          value={form.submit_message_en || ''}
          onChange={(e) => updateField('submit_message_en', e.target.value)}
          className="bg-zinc-900/50 border-white/10 text-white"
          placeholder="Submit message (EN)"
        />
      </div>

      <div className="flex items-center justify-between">
        <h4 className="text-white font-bold">Fields</h4>
        <Button onClick={addField} className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add field
        </Button>
      </div>

      <div className="space-y-4">
        {(form.fields || []).map((field, index) => (
          <div key={field.id || index} className="glass rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                value={field.label || ''}
                onChange={(e) => updateFormField(index, 'label', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Label (RU)"
              />
              <Input
                value={field.label_en || ''}
                onChange={(e) => updateFormField(index, 'label_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Label (EN)"
              />
              <select
                value={field.type || 'text'}
                onChange={(e) => updateFormField(index, 'type', e.target.value)}
                className="bg-zinc-900/50 border border-white/10 text-white rounded-lg px-4 py-2"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="tel">Phone</option>
                <option value="textarea">Textarea</option>
                <option value="select">Select</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-white/70 text-sm">
                <input
                  type="checkbox"
                  checked={field.required || false}
                  onChange={(e) => updateFormField(index, 'required', e.target.checked)}
                />
                Required
              </label>
              {field.type === 'select' && (
                <div className="flex flex-col md:flex-row gap-2 w-full">
                  <Input
                    value={(field.options || []).join(', ')}
                    onChange={(e) => updateFormField(index, 'options', e.target.value.split(',').map((item) => item.trim()).filter(Boolean))}
                    className="bg-zinc-900/50 border-white/10 text-white"
                    placeholder="Options RU (comma separated)"
                  />
                  <Input
                    value={(field.options_en || []).join(', ')}
                    onChange={(e) => updateFormField(index, 'options_en', e.target.value.split(',').map((item) => item.trim()).filter(Boolean))}
                    className="bg-zinc-900/50 border-white/10 text-white"
                    placeholder="Options EN (comma separated)"
                  />
                </div>
              )}
              <Button onClick={() => removeField(index)} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg">
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <Button onClick={onCancel} className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-xl">
          Cancel
        </Button>
        <Button onClick={onSave} className="flex-1 bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-xl">
          <Save className="w-5 h-5 mr-2" />
          Save Form
        </Button>
      </div>
    </div>
  );
}

function SettingsEditor({ settings, setSettings }) {
  const updateSettings = (path, value) => {
    setSettings((prev) => {
      const next = { ...prev };
      let ref = next;
      for (let i = 0; i < path.length - 1; i += 1) {
        ref[path[i]] = { ...(ref[path[i]] || {}) };
        ref = ref[path[i]];
      }
      ref[path[path.length - 1]] = value;
      return next;
    });
  };

  const updateMenuItems = (items) => {
    updateSettings(['header', 'menu'], items);
  };

  const updateFooterSections = (sections) => {
    updateSettings(['footer', 'sections'], sections);
  };

  const updateFooterSocials = (socials) => {
    updateSettings(['footer', 'socials'], socials);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-white font-bold text-lg">Header</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            value={settings.header?.logo_text || ''}
            onChange={(e) => updateSettings(['header', 'logo_text'], e.target.value)}
            className="bg-zinc-900/50 border-white/10 text-white"
            placeholder="Logo text"
          />
          <Input
            value={settings.header?.logo_tagline || ''}
            onChange={(e) => updateSettings(['header', 'logo_tagline'], e.target.value)}
            className="bg-zinc-900/50 border-white/10 text-white"
            placeholder="Logo tagline"
          />
          <Input
            value={settings.header?.cta_href || ''}
            onChange={(e) => updateSettings(['header', 'cta_href'], e.target.value)}
            className="bg-zinc-900/50 border-white/10 text-white"
            placeholder="CTA link"
          />
          <Input
            value={settings.header?.cta_label || ''}
            onChange={(e) => updateSettings(['header', 'cta_label'], e.target.value)}
            className="bg-zinc-900/50 border-white/10 text-white"
            placeholder="CTA label (RU)"
          />
          <Input
            value={settings.header?.cta_label_en || ''}
            onChange={(e) => updateSettings(['header', 'cta_label_en'], e.target.value)}
            className="bg-zinc-900/50 border-white/10 text-white"
            placeholder="CTA label (EN)"
          />
        </div>
        <MenuEditor items={settings.header?.menu || []} onChange={updateMenuItems} />
      </div>

      <div className="space-y-4">
        <h3 className="text-white font-bold text-lg">Footer</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            value={settings.footer?.address || ''}
            onChange={(e) => updateSettings(['footer', 'address'], e.target.value)}
            className="bg-zinc-900/50 border-white/10 text-white"
            placeholder="Address (RU)"
          />
          <Input
            value={settings.footer?.address_en || ''}
            onChange={(e) => updateSettings(['footer', 'address_en'], e.target.value)}
            className="bg-zinc-900/50 border-white/10 text-white"
            placeholder="Address (EN)"
          />
          <Input
            value={settings.footer?.email || ''}
            onChange={(e) => updateSettings(['footer', 'email'], e.target.value)}
            className="bg-zinc-900/50 border-white/10 text-white"
            placeholder="Email"
          />
          <Input
            value={settings.footer?.phone || ''}
            onChange={(e) => updateSettings(['footer', 'phone'], e.target.value)}
            className="bg-zinc-900/50 border-white/10 text-white"
            placeholder="Phone"
          />
        </div>

        <FooterSectionsEditor sections={settings.footer?.sections || []} onChange={updateFooterSections} />
        <FooterSocialsEditor socials={settings.footer?.socials || []} onChange={updateFooterSocials} />
      </div>
    </div>
  );
}

function MenuEditor({ items, onChange }) {
  const updateItem = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const addItem = () => {
    onChange([...(items || []), { label: '', label_en: '', href: '', children: [] }]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, idx) => idx !== index));
  };

  const addChild = (index) => {
    const next = [...items];
    const children = next[index].children || [];
    next[index] = { ...next[index], children: [...children, { label: '', label_en: '', href: '' }] };
    onChange(next);
  };

  const updateChild = (parentIndex, childIndex, field, value) => {
    const next = [...items];
    const children = [...(next[parentIndex].children || [])];
    children[childIndex] = { ...children[childIndex], [field]: value };
    next[parentIndex] = { ...next[parentIndex], children };
    onChange(next);
  };

  const removeChild = (parentIndex, childIndex) => {
    const next = [...items];
    const children = (next[parentIndex].children || []).filter((_, idx) => idx !== childIndex);
    next[parentIndex] = { ...next[parentIndex], children };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-bold">Menu</h4>
        <Button onClick={addItem} className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add item
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={`${item.href}-${index}`} className="glass rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                value={item.label || ''}
                onChange={(e) => updateItem(index, 'label', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Label (RU)"
              />
              <Input
                value={item.label_en || ''}
                onChange={(e) => updateItem(index, 'label_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Label (EN)"
              />
              <Input
                value={item.href || ''}
                onChange={(e) => updateItem(index, 'href', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="/path or https://"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => addChild(index)} className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
                Add child
              </Button>
              <Button onClick={() => removeItem(index)} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg">
                Remove
              </Button>
            </div>
            {(item.children || []).length > 0 && (
              <div className="pl-4 space-y-3">
                {item.children.map((child, childIndex) => (
                  <div key={`${child.href}-${childIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      value={child.label || ''}
                      onChange={(e) => updateChild(index, childIndex, 'label', e.target.value)}
                      className="bg-zinc-900/50 border-white/10 text-white"
                      placeholder="Child label (RU)"
                    />
                    <Input
                      value={child.label_en || ''}
                      onChange={(e) => updateChild(index, childIndex, 'label_en', e.target.value)}
                      className="bg-zinc-900/50 border-white/10 text-white"
                      placeholder="Child label (EN)"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={child.href || ''}
                        onChange={(e) => updateChild(index, childIndex, 'href', e.target.value)}
                        className="bg-zinc-900/50 border-white/10 text-white"
                        placeholder="/child"
                      />
                      <Button
                        onClick={() => removeChild(index, childIndex)}
                        className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FooterSectionsEditor({ sections, onChange }) {
  const addSection = () => {
    onChange([...(sections || []), { title: '', title_en: '', links: [] }]);
  };

  const updateSection = (index, field, value) => {
    const next = [...sections];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const removeSection = (index) => {
    onChange(sections.filter((_, idx) => idx !== index));
  };

  const addLink = (index) => {
    const next = [...sections];
    const links = next[index].links || [];
    next[index] = { ...next[index], links: [...links, { label: '', label_en: '', href: '' }] };
    onChange(next);
  };

  const updateLink = (sectionIndex, linkIndex, field, value) => {
    const next = [...sections];
    const links = [...(next[sectionIndex].links || [])];
    links[linkIndex] = { ...links[linkIndex], [field]: value };
    next[sectionIndex] = { ...next[sectionIndex], links };
    onChange(next);
  };

  const removeLink = (sectionIndex, linkIndex) => {
    const next = [...sections];
    const links = (next[sectionIndex].links || []).filter((_, idx) => idx !== linkIndex);
    next[sectionIndex] = { ...next[sectionIndex], links };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-bold">Footer Sections</h4>
        <Button onClick={addSection} className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add section
        </Button>
      </div>
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={`${section.title}-${index}`} className="glass rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                value={section.title || ''}
                onChange={(e) => updateSection(index, 'title', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Title (RU)"
              />
              <Input
                value={section.title_en || ''}
                onChange={(e) => updateSection(index, 'title_en', e.target.value)}
                className="bg-zinc-900/50 border-white/10 text-white"
                placeholder="Title (EN)"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => addLink(index)} className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
                Add link
              </Button>
              <Button onClick={() => removeSection(index)} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg">
                Remove section
              </Button>
            </div>
            {(section.links || []).map((link, linkIndex) => (
              <div key={`${link.href}-${linkIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  value={link.label || ''}
                  onChange={(e) => updateLink(index, linkIndex, 'label', e.target.value)}
                  className="bg-zinc-900/50 border-white/10 text-white"
                  placeholder="Label (RU)"
                />
                <Input
                  value={link.label_en || ''}
                  onChange={(e) => updateLink(index, linkIndex, 'label_en', e.target.value)}
                  className="bg-zinc-900/50 border-white/10 text-white"
                  placeholder="Label (EN)"
                />
                <div className="flex gap-2">
                  <Input
                    value={link.href || ''}
                    onChange={(e) => updateLink(index, linkIndex, 'href', e.target.value)}
                    className="bg-zinc-900/50 border-white/10 text-white"
                    placeholder="/path or https://"
                  />
                  <Button
                    onClick={() => removeLink(index, linkIndex)}
                    className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function FooterSocialsEditor({ socials, onChange }) {
  const addSocial = () => {
    onChange([...(socials || []), { label: '', href: '' }]);
  };

  const updateSocial = (index, field, value) => {
    const next = [...socials];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const removeSocial = (index) => {
    onChange(socials.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-bold">Social Links</h4>
        <Button onClick={addSocial} className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add social
        </Button>
      </div>
      <div className="space-y-3">
        {socials.map((social, index) => (
          <div key={`${social.href}-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              value={social.label || ''}
              onChange={(e) => updateSocial(index, 'label', e.target.value)}
              className="bg-zinc-900/50 border-white/10 text-white"
              placeholder="Label"
            />
            <Input
              value={social.href || ''}
              onChange={(e) => updateSocial(index, 'href', e.target.value)}
              className="bg-zinc-900/50 border-white/10 text-white"
              placeholder="https://"
            />
            <Button onClick={() => removeSocial(index)} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg">
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThemeEditor({ settings, setSettings }) {
  const theme = settings.theme || {};
  const { families } = useFontCatalog();
  const fontOptions = families.length ? families : [
    'Roboto',
    'Open Sans',
    'Montserrat',
    'Inter',
    'Lato',
    'Poppins',
    'Nunito',
    'Source Sans 3',
    'Fira Sans',
    'Rubik',
    'Arial',
  ];

  const presets = [
    { name: 'Crimson', primary: '#E11D2E', secondary: '#0A0A0A', accent: '#FFFFFF', background: '#050505', foreground: '#FFFFFF' },
    { name: 'Cobalt', primary: '#2563EB', secondary: '#0B1120', accent: '#E2E8F0', background: '#0B1120', foreground: '#F8FAFC' },
    { name: 'Emerald', primary: '#10B981', secondary: '#0F172A', accent: '#E2E8F0', background: '#0F172A', foreground: '#F8FAFC' },
    { name: 'Amber', primary: '#F59E0B', secondary: '#111827', accent: '#F8FAFC', background: '#111827', foreground: '#F8FAFC' },
  ];

  const updateTheme = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        [field]: value,
      },
    }));
  };

  const ColorField = ({ label, field, value }) => (
    <div className="flex items-center gap-3 bg-zinc-900/40 border border-white/10 rounded-xl px-3 py-2">
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => updateTheme(field, e.target.value)}
        className="h-9 w-9 rounded-lg border border-white/20 bg-transparent"
      />
      <div className="flex-1">
        <Label className="text-white/70 text-xs">{label}</Label>
        <Input
          value={value || ''}
          onChange={(e) => updateTheme(field, e.target.value)}
          className="bg-transparent border-none text-white px-0 h-8"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  const previewHeading = theme.heading_font || 'Arial';
  const previewBody = theme.body_font || 'Arial';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            onClick={() => {
              updateTheme('primary', preset.primary);
              updateTheme('secondary', preset.secondary);
              updateTheme('accent', preset.accent);
              updateTheme('background', preset.background);
              updateTheme('foreground', preset.foreground);
            }}
            className="bg-white/10 hover:bg-white/20 text-white rounded-xl"
          >
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: preset.primary }} />
              {preset.name}
            </span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorField label="Primary" field="primary" value={theme.primary} />
        <ColorField label="Secondary" field="secondary" value={theme.secondary} />
        <ColorField label="Accent" field="accent" value={theme.accent} />
        <ColorField label="Background" field="background" value={theme.background} />
        <ColorField label="Foreground" field="foreground" value={theme.foreground} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white/70 text-xs">Heading font</Label>
          <select
            value={theme.heading_font || ''}
            onChange={(e) => updateTheme('heading_font', e.target.value)}
            className="bg-zinc-900/50 border border-white/10 text-white rounded-lg px-4 py-2 w-full"
          >
            <option value="">Select font</option>
            {fontOptions.map((font) => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-white/70 text-xs">Body font</Label>
          <select
            value={theme.body_font || ''}
            onChange={(e) => updateTheme('body_font', e.target.value)}
            className="bg-zinc-900/50 border border-white/10 text-white rounded-lg px-4 py-2 w-full"
          >
            <option value="">Select font</option>
            {fontOptions.map((font) => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>
      </div>
      <div
        className="rounded-3xl border border-white/10 p-6 md:p-8 space-y-4"
        style={{
          background: theme.background || '#050505',
          color: theme.foreground || '#FFFFFF',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div
              className="text-2xl md:text-3xl font-black"
              style={{ fontFamily: previewHeading }}
            >
              Theme Preview
            </div>
            <div
              className="text-sm md:text-base opacity-80"
              style={{ fontFamily: previewBody }}
            >
              Headings use the selected heading font, body text uses the selected body font.
            </div>
          </div>
          <div className="flex gap-2">
            <span className="h-8 w-8 rounded-full border border-white/20" style={{ background: theme.primary || '#E11D2E' }} />
            <span className="h-8 w-8 rounded-full border border-white/20" style={{ background: theme.secondary || '#0A0A0A' }} />
            <span className="h-8 w-8 rounded-full border border-white/20" style={{ background: theme.accent || '#FFFFFF' }} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <button
            type="button"
            className="px-5 py-3 rounded-full font-semibold text-white"
            style={{ background: theme.primary || '#E11D2E' }}
          >
            Primary Action
          </button>
          <button
            type="button"
            className="px-5 py-3 rounded-full font-semibold border"
            style={{
              borderColor: theme.accent || '#FFFFFF',
              color: theme.accent || '#FFFFFF',
            }}
          >
            Secondary Action
          </button>
        </div>
        <p className="text-sm opacity-70" style={{ fontFamily: previewBody }}>
          Use this preview to quickly see how the palette and typography feel together before saving.
        </p>
      </div>
    </div>
  );
}

// Edit Form Component
function EditForm({ item, type, onSave, onCancel, onChange }) {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  const commonFields = (
    <>
      {type !== 'team' && type !== 'pages' && (
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
      {type !== 'pages' && (
        <>
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
      )}
    </>
  );

  const typeSpecificFields = {
    services: (
      <div>
        <Label className="text-white">Особенности (через запятую)</Label>
        <Input
          value={(item.features || []).join(', ')}
          onChange={(e) => handleChange('features', e.target.value.split(',').map(s => s.trim()))}
          className="bg-zinc-900/50 border-white/10 text-white"
        />
      </div>
    ),
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
        <div>
          <Label className="text-white">Задача</Label>
          <Textarea value={item.challenge || ''} onChange={(e) => handleChange('challenge', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" rows={2} />
        </div>
        <div>
          <Label className="text-white">Решение</Label>
          <Textarea value={item.solution || ''} onChange={(e) => handleChange('solution', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" rows={2} />
        </div>
        <div>
          <Label className="text-white">Результаты (через запятую)</Label>
          <Input value={(item.results || []).join(', ')} onChange={(e) => handleChange('results', e.target.value.split(',').map(s => s.trim()))} className="bg-zinc-900/50 border-white/10 text-white" />
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
          <Label className="text-white">Место</Label>
          <Input value={item.location || ''} onChange={(e) => handleChange('location', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white">Тип</Label>
          <Input value={item.type || ''} onChange={(e) => handleChange('type', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
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
          <Label className="text-white">Индустрия</Label>
          <Input value={item.industry || ''} onChange={(e) => handleChange('industry', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white">Страна</Label>
          <Input value={item.country || ''} onChange={(e) => handleChange('country', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white">Требуемый капитал</Label>
          <Input value={item.capital_required || ''} onChange={(e) => handleChange('capital_required', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white">Сроки</Label>
          <Input value={item.timeline || ''} onChange={(e) => handleChange('timeline', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
      </>
    ),
    partners: (
      <>
        <div>
          <Label className="text-white">Категории (через запятую)</Label>
          <Input value={(item.categories || []).join(', ')} onChange={(e) => handleChange('categories', e.target.value.split(',').map(s => s.trim()))} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white">Страна</Label>
          <Input value={item.country || ''} onChange={(e) => handleChange('country', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
      </>
    ),
    articles: (
      <>
        <div>
          <Label className="text-white">Контент</Label>
          <Textarea value={item.content || ''} onChange={(e) => handleChange('content', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" rows={8} />
        </div>
        <div>
          <Label className="text-white">Автор</Label>
          <Input value={item.author || ''} onChange={(e) => handleChange('author', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white">Категория</Label>
          <Input value={item.category || ''} onChange={(e) => handleChange('category', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
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
    pages: (
      <>
        <div>
          <Label className="text-white">Slug (URL: privacy, terms, nda, download)</Label>
          <Input value={item.slug || ''} onChange={(e) => handleChange('slug', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" placeholder="privacy" />
        </div>
        <div>
          <Label className="text-white">Заголовок (RU)</Label>
          <Input value={item.title || ''} onChange={(e) => handleChange('title', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white">Контент (RU) - поддерживает HTML</Label>
          <Textarea value={item.content || ''} onChange={(e) => handleChange('content', e.target.value)} className="bg-zinc-900/50 border-white/10 text-white font-mono text-sm" rows={15} />
        </div>
        <p className="text-white/40 text-sm">
          * Английская версия будет создана автоматически при сохранении
        </p>
      </>
    ),
  };

  return (
    <div className="glass rounded-2xl p-6 mb-6 space-y-4">
      {commonFields}
      {typeSpecificFields[type]}
      <div className="flex gap-4 pt-4">
        <Button onClick={onCancel} className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-xl">
          Отмена
        </Button>
        <Button onClick={onSave} className="flex-1 bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-xl" data-testid="save-button">
          <Save className="w-5 h-5 mr-2" />
          Сохранить
        </Button>
      </div>
    </div>
  );
}
