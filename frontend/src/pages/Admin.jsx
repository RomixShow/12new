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
    { value: 'services', label: 'Услуги', endpoint: '/services' },
    { value: 'cases', label: 'Кейсы', endpoint: '/cases' },
    { value: 'events', label: 'Мероприятия', endpoint: '/events' },
    { value: 'projects', label: 'Проекты', endpoint: '/projects' },
    { value: 'partners', label: 'Партнеры', endpoint: '/partners' },
    { value: 'articles', label: 'Статьи', endpoint: '/articles' },
    { value: 'team', label: 'Команда', endpoint: '/team' },
    { value: 'pages', label: 'Страницы', endpoint: '/pages' },
  ];

  // Add users tab for superadmin
  if (userRole === 'superadmin') {
    tabs.push({ value: 'users', label: 'Пользователи', endpoint: '/admin/users', icon: Users });
  }

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
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

          {/* Content Tabs */}
          {tabs.filter(t => t.value !== 'users').map((tab) => (
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
