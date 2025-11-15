import './Sobre.css';
import { useLanguage } from '../../hooks/useLanguage';

const COPY = {
	pt: {
		sectionLabel: 'Sobre mim',
		heading: 'Sobre mim',
		paragraphs: [
			'Sou desenvolvedor de software apaixonado por criar experiências digitais que fazem a diferença. Foco em qualidade de código e experiência do usuário para entregar soluções que superam expectativas.',
			'Sou certificado AWS e tenho focado em desenvolver produtos com Inteligência Artificial, explorando as possibilidades de machine learning e automação para criar soluções inovadoras.',
			'Minha jornada na tecnologia começou há alguns anos e, desde então, venho me dedicando a aprender e aplicar as melhores práticas de desenvolvimento, sempre atento às novas tendências do mercado.',
			'Quando não estou programando, gosto de compartilhar conhecimento e explorar ferramentas que possam melhorar meu fluxo de trabalho.',
		],
	},
	en: {
		sectionLabel: 'About me',
		heading: 'About me',
		paragraphs: [
			"I'm a software developer passionate about crafting digital experiences that truly make an impact. I focus on clean code and user experience to deliver solutions that exceed expectations.",
			"I'm AWS certified and have been focusing on developing AI-powered products, exploring the possibilities of machine learning and automation to create innovative solutions.",
			'My journey in technology started a few years ago and since then I have been committed to learning and applying best practices while staying close to emerging trends.',
			"When I'm not coding, I enjoy sharing knowledge and exploring tools that improve my workflow.",
		],
	},
};

const Sobre = () => {
	const lang = useLanguage();
	const copy = COPY[lang] || COPY.pt;

	return (
		<section id="sobre" className="sobre-section" aria-label={copy.sectionLabel}>
			<div className="sobre-container">
				<h2 className="section-title">{copy.heading}</h2>
				<div className="sobre-content">
					<div className="sobre-text">
						{copy.paragraphs.map((paragraph, index) => (
							<p key={index} className="sobre-paragraph">
								{paragraph}
							</p>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Sobre;
