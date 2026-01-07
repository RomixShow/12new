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

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className=\"App\">
      <SmoothScroll>
        <BrowserRouter>
          <Header />
          <div className=\"noise\" />
          <Routes>
            <Route path=\"/\" element={<Home />} />
            <Route path=\"/about\" element={<About />} />
            <Route path=\"/services\" element={<Services />} />
            <Route path=\"/services/:slug\" element={<ServiceDetail />} />
            <Route path=\"/contact\" element={<Contact />} />
          </Routes>
          <Footer />
          <Toaster />
        </BrowserRouter>
      </SmoothScroll>
    </div>
  );
}

export default App;
