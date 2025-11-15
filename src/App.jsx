import { useState, useEffect, useRef } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Cursor from './components/Cursor/Cursor';
import ProgressBar from './components/ProgressBar/ProgressBar';
import Footer from './components/Footer/Footer';
import Inicio from './sections/Inicio/Inicio';
import Projetos from './sections/Projetos/Projetos';
import Sobre from './sections/Sobre/Sobre';
import Ferramentas from './sections/Ferramentas/Ferramentas';
import Contato from './sections/Contato/Contato';

function App() {
  const [currentSection, setCurrentSection] = useState('inicio');
  const containerRef = useRef(null);

  useEffect(() => {
    const appContainer = containerRef.current;
    if (!appContainer) return;

    const handleScroll = () => {
      const sections = ['inicio', 'projetos', 'sobre', 'ferramentas', 'contato', 'footer'];
      const scrollTop = appContainer.scrollTop;
      const viewportHeight = window.innerHeight;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const sectionTop = rect.top + scrollTop;
          
          if (scrollTop >= sectionTop - viewportHeight / 3 && 
              scrollTop < sectionTop + rect.height - viewportHeight / 3) {
            setCurrentSection(sectionId);
            break;
          }
        }
      }
    };

    appContainer.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => {
      appContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="app" ref={containerRef}>
      <Cursor />
      <ProgressBar />
      <Navbar currentSection={currentSection} />
      <main className="main-content">
        <Inicio />
        <Projetos />
        <Sobre />
        <Ferramentas />
        <Contato />
      </main>
      <Footer />
    </div>
  );
}

export default App;
