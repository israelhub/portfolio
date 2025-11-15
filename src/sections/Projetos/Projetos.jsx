import { useEffect, useRef, useState } from "react";
import "./Projetos.css";
import { useLanguage } from "../../hooks/useLanguage";
import YourEmailVideo from "../../assets/YourEmAIL.mp4";
import YourEmailMobileVideo from "../../assets/YourEmAILMobile.mp4";
import GuardVideo from "../../assets/GUARD.mp4";
import LembraDeMimVideo from "../../assets/LembraDeMim.mp4";

const PROJECTS = [
	{
		id: "your-email",
		title: "YourEmAIL",
		description: {
			pt: "Uma aplicação web que utiliza IA para classificar e-mails como produtivos ou improdutivos e gerar respostas automáticas inteligentes, otimizando a produtividade profissional.",
			en: "A web application that uses AI to classify emails as productive or unproductive and generate smart automatic replies, boosting professional productivity.",
		},
		tags: ["React", "Vite", "GeminiAI", "GmailAPI", "Figma"],
		videoDesktop: YourEmailVideo,
		videoMobile: YourEmailMobileVideo,
		hasToggle: true,
		projectUrl: "#",
		siteUrl: "https://your-em-ail.vercel.app/",
	},
	{
		id: "guard",
		title: "GUARD",
		description: {
			pt: "O GUARD é um sistema de gestão de contatos que otimiza a organização das informações, centraliza dados com segurança e aumenta a eficiência com filtros inteligentes, backup automático e integrações simples.",
			en: "GUARD is a contact management system that streamlines information organization, keeps data secure, and increases efficiency with smart filters, automatic backups, and straightforward integrations.",
		},
		tags: ["NestJS", "TypeORM", "Next.js", "React", "PostgreSQL", "Vercel", "Render", "Figma"],
		videoDesktop: GuardVideo,
		projectUrl: "#",
		siteUrl: "https://frontend-gerenciador-de-contatos.vercel.app/login",
	},
	{
		id: "lembra-de-mim",
		title: "LembraDeMim",
		description: {
			pt: "Um aplicativo mobile de gestão de biografias que centraliza e organiza informações de contatos. O sistema permite criar pastas personalizadas, aplicar tags inteligentes e usar uma busca combinada por nomes e etiquetas para acesso rápido, otimizando o follow-up e fortalecendo o relacionamento com os contatos.",
			en: "A mobile app for managing biographies that centralizes and organizes contact information. It lets you create custom folders, apply smart tags, and use combined searches by name and labels for quick access—streamlining follow-ups and strengthening relationships with contacts.",
		},
		tags: ["Expo", "React Native", "Android Studio", "NestJS", "Sequelize", "Figma"],
		videoDesktop: LembraDeMimVideo,
		videoMobile: LembraDeMimVideo,
		projectUrl: "#",
		// siteUrl: "https://exemplo.com/projeto-quatro", // Sem link de site por enquanto
	},
];

const COPY = {
	pt: {
		sectionLabel: "Projetos",
		featured: "Projeto em destaque",
		viewProject: "Ver projeto",
		visitSite: "Visitar site",
		videoFallback: "Seu navegador não suporta vídeo HTML5.",
	},
	en: {
		sectionLabel: "Projects",
		featured: "Featured project",
		viewProject: "View project",
		visitSite: "Visit site",
		videoFallback: "Your browser does not support HTML5 video.",
	},
};

export default function Projetos() {
	const lang = useLanguage();
	const containerRef = useRef(null);
	const isScrollingRef = useRef(false);
	const lastScrollTimeRef = useRef(0);
	const [modalVideo, setModalVideo] = useState(null);

	const openModal = (videoSrc) => {
		setModalVideo(videoSrc);
	};

	const closeModal = () => {
		setModalVideo(null);
	};

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return undefined;

		const isMobileDevice =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
			window.innerWidth <= 900;

		if (isMobileDevice) return undefined;

		const getCurrentProjectIndex = () => {
			const scrollLeft = container.scrollLeft;
			const projectWidth = container.clientWidth;
			return Math.round(scrollLeft / projectWidth);
		};

		const handleWheel = (event) => {
			const now = Date.now();
			const timeSinceLastScroll = now - lastScrollTimeRef.current;

			if (isScrollingRef.current || timeSinceLastScroll < 1000) {
				event.preventDefault();
				return;
			}

			const delta = event.deltaY;
			const threshold = 50;

			if (Math.abs(delta) < threshold) return;

			const projectWidth = container.clientWidth;
			const currentProject = getCurrentProjectIndex();
			const totalProjects = PROJECTS.length;
			const scrollingForward = delta > 0;

			if ((currentProject === 0 && !scrollingForward) || (currentProject >= totalProjects - 1 && scrollingForward)) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();

			const nextProject = scrollingForward ? currentProject + 1 : currentProject - 1;

			if (nextProject < 0 || nextProject >= totalProjects) {
				return;
			}

			isScrollingRef.current = true;
			lastScrollTimeRef.current = now;

			const targetScroll = nextProject * projectWidth;
			container.scrollTo({
				left: targetScroll,
				behavior: "smooth",
			});

			setTimeout(() => {
				isScrollingRef.current = false;
			}, 1200);
		};

		const handleScrollEnd = () => {
			isScrollingRef.current = false;
		};

		container.addEventListener("wheel", handleWheel, { passive: false });
		container.addEventListener("scrollend", handleScrollEnd);

		return () => {
			container.removeEventListener("wheel", handleWheel);
			container.removeEventListener("scrollend", handleScrollEnd);
		};
	}, []);

	const copy = COPY[lang] || COPY.pt;

	return (
		<section id="projetos" className="projects-section" aria-label={copy.sectionLabel}>
			<div className="projects-container" ref={containerRef}>
				<div className="projects-track" aria-label={copy.sectionLabel}>
					{PROJECTS.map((project, index) => (
						<div key={project.id} className={`project-card ${index % 2 === 1 ? "reversed" : ""}`}>
							<div className="project-content">
								<div className="project-header">
									<p className="project-overline">{copy.featured}</p>
									<h3 className="project-title">{project.title}</h3>
								</div>

								<div className="project-media">
									<div className="video-container">
										<div className="video-wrapper">
											<video
												className="project-video"
												autoPlay
												loop
												muted
												playsInline
												onClick={() => openModal(project.videoDesktop)}
												style={{ cursor: "pointer" }}
											>
												<source
													src={project.videoDesktop}
													type="video/mp4"
												/>
												{copy.videoFallback}
											</video>
										</div>
									</div>
								</div>

								<div className="project-info">
									<div className="project-description">
										<p>{project.description[lang] || project.description.pt}</p>
									</div>
									<ul className="project-tags">
										{project.tags.map((tag) => (
											<li key={tag} className="project-tag">
												{tag}
											</li>
										))}
									</ul>
									<div className="project-links">
										{/* <a href={project.projectUrl} target="_blank" rel="noreferrer">
											{copy.viewProject}
										</a> */}
										{project.siteUrl && (
											<a href={project.siteUrl} target="_blank" rel="noreferrer" className="visit-site">
												{copy.visitSite}
											</a>
										)}
									</div>
								</div>
							</div>

							<div className="project-image-container">
								<div className="video-container">
									<div className="video-wrapper">
										<video
											className="project-video"
											autoPlay
											loop
											muted
											playsInline
											onClick={() => openModal(project.videoDesktop)}
											style={{ cursor: "pointer" }}
										>
											<source
												src={project.videoDesktop}
												type="video/mp4"
											/>
											{copy.videoFallback}
										</video>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Modal de vídeo */}
			{modalVideo && (
				<div className="video-modal" onClick={closeModal}>
					<div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
						<button className="video-modal-close" onClick={closeModal} aria-label="Fechar modal">
							✕
						</button>
						<video className="video-modal-player" autoPlay loop muted playsInline controls>
							<source src={modalVideo} type="video/mp4" />
							{copy.videoFallback}
						</video>
					</div>
				</div>
			)}
		</section>
	);
}
