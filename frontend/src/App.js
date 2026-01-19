import { useEffect } from 'react';
import '@/App.css';
import './i18n';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from './components/ui/sonner';
import { SiteSettingsProvider, useSiteSettings } from './hooks/useSiteSettings';
import { useFontCatalog } from './hooks/useFontCatalog';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DynamicPage from './pages/DynamicPage';

function App() {
  return (
    <SiteSettingsProvider>
      <AppShell />
    </SiteSettingsProvider>
  );
}

function AppShell() {
  const { settings } = useSiteSettings();
  useFontCatalog();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const hexToHsl = (hex) => {
    if (!hex || typeof hex !== 'string') return null;
    const normalized = hex.replace('#', '');
    if (normalized.length !== 6) return null;
    const r = parseInt(normalized.slice(0, 2), 16) / 255;
    const g = parseInt(normalized.slice(2, 4), 16) / 255;
    const b = parseInt(normalized.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        default:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  useEffect(() => {
    if (!settings?.theme) return;
    const root = document.documentElement;
    root.style.setProperty('--site-primary', settings.theme.primary || '#E11D2E');
    root.style.setProperty('--site-secondary', settings.theme.secondary || '#0A0A0A');
    root.style.setProperty('--site-accent', settings.theme.accent || '#FFFFFF');
    root.style.setProperty('--site-background', settings.theme.background || '#050505');
    root.style.setProperty('--site-foreground', settings.theme.foreground || '#FFFFFF');
    root.style.setProperty('--font-heading', settings.theme.heading_font || 'Arial');
    root.style.setProperty('--font-body', settings.theme.body_font || 'Arial');

    const primaryHsl = hexToHsl(settings.theme.primary);
    const backgroundHsl = hexToHsl(settings.theme.background);
    const foregroundHsl = hexToHsl(settings.theme.foreground);
    if (primaryHsl) {
      root.style.setProperty('--primary', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
      root.style.setProperty('--ring', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
      root.style.setProperty('--chart-1', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
    }
    if (backgroundHsl) {
      root.style.setProperty('--background', `${backgroundHsl.h} ${backgroundHsl.s}% ${backgroundHsl.l}%`);
      root.style.setProperty('--card', `${backgroundHsl.h} ${backgroundHsl.s}% ${Math.min(100, backgroundHsl.l + 2)}%`);
      root.style.setProperty('--popover', `${backgroundHsl.h} ${backgroundHsl.s}% ${Math.min(100, backgroundHsl.l + 2)}%`);
    }
    if (foregroundHsl) {
      root.style.setProperty('--foreground', `${foregroundHsl.h} ${foregroundHsl.s}% ${foregroundHsl.l}%`);
      root.style.setProperty('--card-foreground', `${foregroundHsl.h} ${foregroundHsl.s}% ${foregroundHsl.l}%`);
      root.style.setProperty('--popover-foreground', `${foregroundHsl.h} ${foregroundHsl.s}% ${foregroundHsl.l}%`);
    }
  }, [settings]);

  return (
    <div className="App">
      <SmoothScroll>
        <BrowserRouter>
          <Header />
          <div className="noise" />
          <Routes>
            <Route path="/" element={<DynamicPage slugOverride="home" />} />
            <Route path="/about" element={<DynamicPage slugOverride="about" />} />
            <Route path="/services" element={<DynamicPage slugOverride="services" />} />
            <Route path="/services/:slug" element={<ServiceDynamic />} />
            <Route path="/contact" element={<DynamicPage slugOverride="contact" />} />
            <Route path="/invest" element={<DynamicPage slugOverride="invest" />} />
            <Route path="/partners" element={<DynamicPage slugOverride="partners" />} />
            <Route path="/events" element={<DynamicPage slugOverride="events" />} />
            <Route path="/cases" element={<DynamicPage slugOverride="cases" />} />
            <Route path="/insights" element={<DynamicPage slugOverride="insights" />} />
            <Route path="/nda" element={<DynamicPage slugOverride="nda" />} />
            <Route path="/privacy" element={<DynamicPage slugOverride="privacy" />} />
            <Route path="/terms" element={<DynamicPage slugOverride="terms" />} />
            <Route path="/download" element={<DynamicPage slugOverride="download" />} />
            <Route path="/pages/:slug" element={<DynamicPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
          </Routes>
          <Footer />
          <Toaster />
        </BrowserRouter>
      </SmoothScroll>
    </div>
  );
}

function ServiceDynamic() {
  const { slug } = useParams();
  return <DynamicPage slugOverride={`service-${slug}`} />;
}

export default App;
