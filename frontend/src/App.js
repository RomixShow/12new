import { useEffect } from 'react';
import '@/App.css';
import './i18n';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from './components/ui/sonner';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Contact from './pages/Contact';
import Invest from './pages/Invest';
import Partners from './pages/Partners';
import Events from './pages/Events';
import Cases from './pages/Cases';
import Insights from './pages/Insights';
import NDA from './pages/NDA';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Download from './pages/Download';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="App">
      <SmoothScroll>
        <BrowserRouter>
          <Header />
          <div className="noise" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/invest" element={<Invest />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/events" element={<Events />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/nda" element={<NDA />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/download" element={<Download />} />
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

export default App;
