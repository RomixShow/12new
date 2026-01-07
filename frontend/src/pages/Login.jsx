import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, {
        username,
        password,
      });

      const { access_token } = response.data;
      localStorage.setItem('admin_token', access_token);
      toast.success('Login successful!');
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.detail || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" data-testid="login-page">
      <div className="noise" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-12 w-full max-w-md relative z-10"
      >
        <div className="flex items-center justify-center mb-8">
          <Lock className="w-12 h-12 text-[#E11D2E]" />
        </div>
        <h1 className="text-3xl font-black font-heading text-white mb-2 text-center">
          ADMIN LOGIN
        </h1>
        <p className="text-white/60 text-center mb-8">AICHIN GROUP</p>

        <form onSubmit={handleLogin} className="space-y-6" data-testid="login-form">
          <div>
            <Label htmlFor="username" className="text-white mb-2 block">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-zinc-900/50 border-white/10 focus:border-[#E11D2E]/50 h-14 rounded-xl text-white pl-12"
                placeholder="Enter username"
                data-testid="username-input"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-white mb-2 block">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-900/50 border-white/10 focus:border-[#E11D2E]/50 h-14 rounded-xl text-white pl-12"
                placeholder="Enter password"
                data-testid="password-input"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white rounded-full py-6 text-lg font-bold glow-red"
            data-testid="login-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-white/40">
          <p>Default credentials:</p>
          <p className="font-mono">admin / admin123</p>
        </div>
      </motion.div>
    </div>
  );
}