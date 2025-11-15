import { useEffect, useRef } from 'react';
import './Inicio.css';
import { init3DBackground } from '../../utils/background3D';
import { useLanguage } from '../../hooks/useLanguage';

const COPY = {
	pt: {
		sectionLabel: 'Início',
		hello: 'Olá, meu nome é',
		name: 'Israel Cunha.',
		headline: 'Eu desenvolvo soluções em software que transformam ideias em experiências reais.',
		desc:
			'Acredito que o desenvolvimento de software vai além do código: é a arte de transformar o potencial da tecnologia em ferramentas que simplificam processos, geram valor e enriquecem a jornada das pessoas. Meu propósito é criar soluções que unem inovação e usabilidade para impactar positivamente negócios e vidas.',
	},
	en: {
		sectionLabel: 'Home',
		hello: 'Hello, my name is',
		name: 'Israel Cunha.',
		headline: 'I build software solutions that turn ideas into real-world experiences.',
		desc:
			"I believe software development goes beyond code: it's the craft of turning technology into tools that simplify processes, create value, and enhance people's journeys. My goal is to blend innovation and usability to positively impact businesses and lives.",
	},
};

export default function Inicio() {
	const canvasRef = useRef(null);
	const cleanupRef = useRef(null);
	const lang = useLanguage();

	useEffect(() => {
		cleanupRef.current = init3DBackground(canvasRef.current);
		return () => {
			if (cleanupRef.current) cleanupRef.current();
		};
	}, []);

	const copy = COPY[lang] || COPY.pt;

	return (
		<section id="inicio" className="inicio-section" aria-label={copy.sectionLabel}>
			<canvas ref={canvasRef} className="inicio-bg" aria-hidden="true" />

			<div className="inicio-content">
				<p className="hero-kicker">{copy.hello}</p>
				<h1 className="hero-title">
					<span className="text-strong">{copy.name}</span>
				</h1>
				<h2 className="hero-subtitle">{copy.headline}</h2>
				<p className="hero-desc">{copy.desc}</p>
			</div>
		</section>
	);
}
