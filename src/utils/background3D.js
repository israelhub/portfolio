import * as THREE from 'three';

/**
 * Inicializa o background 3D com Three.js.
 */
export function init3DBackground(canvasElement) {
  if (!canvasElement) {
    console.error("Canvas element não encontrado!");
    return null;
  }

  // Detectar dispositivo móvel
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 900;

  let scene, camera, renderer, particles;
  let mouseX = 0, mouseY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ canvas: canvasElement, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));

  // Classe para criar uma curva do infinito (lemniscata)
  class InfinityCurve extends THREE.Curve {
    getPoint(t) {
      const angle = t * 2 * Math.PI;
      const a = 1.8;
      const x = (a * Math.sqrt(2) * Math.cos(angle)) / (Math.sin(angle) ** 2 + 1);
      const y = (a * Math.sqrt(2) * Math.cos(angle) * Math.sin(angle)) / (Math.sin(angle) ** 2 + 1);
      const z = Math.sin(angle * 2) * 0.5;
      return new THREE.Vector3(x, y, z);
    }
  }

  const path = new InfinityCurve();
  const points = [];
  // Reduzir partículas em mobile para melhor performance
  const numParticles = isMobile ? 1000 : 2500;
  const spread = 0.5;

  // Gera partículas ao longo da curva com dispersão aleatória
  for (let i = 0; i < numParticles; i++) {
    const t = Math.random();
    const pointOnCurve = path.getPoint(t);
    const offset = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize()
      .multiplyScalar(Math.random() * spread);
    pointOnCurve.add(offset);
    points.push(pointOnCurve);
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  const particleColor = 0xc0a062; // Cor dourada
  const material = new THREE.PointsMaterial({ 
    color: particleColor, 
    size: 0.018,
    transparent: true,
    opacity: 1.0,
    blending: THREE.AdditiveBlending,
    vertexColors: false
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Função para ajustar cor baseada no tema
  function updateParticleColorByTheme() {
    if (particles && particles.material) {
      const isDarkTheme = document.body.getAttribute('data-theme') !== 'light';
      if (isDarkTheme) {
        particles.material.color.setHex(0xc0a062); // Cor original no tema escuro
        particles.material.opacity = 1.0;
      } else {
        particles.material.color.setHex(0xa08850); // Versão mais escura no tema claro
        particles.material.opacity = 0.9;
      }
    }
  }

  // Atualizar cor inicial
  updateParticleColorByTheme();

  // Observar mudanças de tema
  const observer = new MutationObserver(updateParticleColorByTheme);
  observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

  // Ajusta o canvas quando a janela é redimensionada
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Segue o movimento do mouse
  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
  }

  // Loop de animação
  function animate() {
    requestAnimationFrame(animate);
    
    // Rotação suave das partículas
    if (particles) {
      particles.rotation.x += 0.001;
      particles.rotation.y += 0.002;
    }
    
    // Câmera segue o mouse suavemente
    if (camera) {
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
    }
    
    renderer.render(scene, camera);
  }

  document.addEventListener("mousemove", onDocumentMouseMove);
  window.addEventListener("resize", onWindowResize);
  animate();

  // Retorna função de cleanup
  return () => {
    document.removeEventListener("mousemove", onDocumentMouseMove);
    window.removeEventListener("resize", onWindowResize);
    observer.disconnect();
    if (renderer) {
      renderer.dispose();
    }
    if (geometry) {
      geometry.dispose();
    }
    if (material) {
      material.dispose();
    }
  };
}
