import { useEffect } from 'react';
import './Cursor.css';

const Cursor = () => {
  useEffect(() => {
    // Detecta se é dispositivo touch
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = document.querySelector(".cursor");
    const cursorDot = document.querySelector(".cursor-dot");
    if (!cursor || !cursorDot) return;

    // Posicionamento direto sem interpolação
    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      
      cursorDot.style.left = `${x}px`;
      cursorDot.style.top = `${y}px`;
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Função para aplicar os eventos de cursor em todos os elementos interativos
    function applyInteractiveEffects() {
      const interactiveElements = document.querySelectorAll(
        "a, button, .form-input, .project-links a, .visit-site, .nav-link, .tech-tag, .projeto-link, input, textarea"
      );
      
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
        
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    }

    function handleMouseEnter() {
      cursor.classList.add("cursor-grow");
    }

    function handleMouseLeave() {
      cursor.classList.remove("cursor-grow");
    }
    
    // Aplicar efeitos nos elementos existentes
    applyInteractiveEffects();
    
    // Aplicar após delay para elementos dinâmicos
    setTimeout(applyInteractiveEffects, 500);
    
    // Re-aplicar quando a rolagem parar
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(applyInteractiveEffects, 100);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Observer para detectar novos elementos adicionados ao DOM
    const observer = new MutationObserver(() => {
      applyInteractiveEffects();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cursor"></div>
      <div className="cursor-dot"></div>
    </>
  );
};

export default Cursor;
