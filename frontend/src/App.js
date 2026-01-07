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
