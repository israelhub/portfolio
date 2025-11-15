import { useEffect, useMemo, useRef } from "react";
import "./Ferramentas.css";
import { useLanguage } from "../../hooks/useLanguage";

const TECHNOLOGY_ROWS = [
	[
		{ slug: "js", label: "JavaScript" },
		{ slug: "typescript", label: "TypeScript" },
		{ slug: "nodejs", label: "Node.js" },
		{ slug: "html", label: "HTML" },
		{ slug: "css", label: "CSS" },
		{ slug: "java", label: "Java" },
		{ slug: "python", label: "Python" },
		{ slug: "kotlin", label: "Kotlin" },
	],
	[
		{ slug: "react", label: "React" },
		{ slug: "nextjs", label: "Next.js" },
		{ slug: "nestjs", label: "Nest.js" },
		{ slug: "express", label: "Express.js" },
		{ slug: "spring", label: "Spring Boot" },
		{ slug: "flutter", label: "Flutter" },
		{ slug: "dart", label: "Dart" },
	],
	[
		{ slug: "postgresql", label: "PostgreSQL" },
		{ slug: "aws", label: "AWS" },
		{ slug: "docker", label: "Docker" },
		{ slug: "git", label: "Git" },
		{ slug: "github", label: "GitHub" },
		{ slug: "bitbucket", label: "Bitbucket" },
		{ slug: "notion", label: "Notion" },
		{ slug: "figma", label: "Figma" },
	],
];

export default function Ferramentas() {
	const sectionRef = useRef(null);
	const tooltipRef = useRef(null);
	const lang = useLanguage();

	const copy = useMemo(
		() => ({
			pt: {
				heading: "Ferramentas",
				description: "Ferramentas que uso no dia a dia",
				hint: "Passe o mouse sobre uma ferramenta para ver o nome dela",
			},
			en: {
				heading: "Tools",
				description: "Tools I use in my daily work",
				hint: "Hover over a tool to see its name",
			},
		}),
		[]
	);

	useEffect(() => {
		if (typeof window === "undefined") return undefined;
		const sectionEl = sectionRef.current;
		if (!sectionEl) return undefined;

		const buildCarousel = () => {
			sectionEl.querySelectorAll(".tech-row-wrapper").forEach((wrapper) => {
				const baseRow = wrapper.querySelector(".tech-row");
				if (!baseRow) return;

				const originalMarkup = baseRow.dataset.original || baseRow.innerHTML;
				baseRow.dataset.original = originalMarkup;
				baseRow.innerHTML = originalMarkup;

				wrapper.querySelectorAll(".tech-row-clone").forEach((clone) => clone.remove());

				let repeatCount = 0;
				const minWidth = Math.max(window.innerWidth, wrapper.offsetWidth) * 2;

				while (baseRow.scrollWidth < minWidth && repeatCount < 3) {
					baseRow.innerHTML += originalMarkup;
					repeatCount += 1;
				}

				const clone = baseRow.cloneNode(true);
				clone.classList.add("tech-row-clone");
				clone.setAttribute("aria-hidden", "true");
				wrapper.appendChild(clone);
			});
		};

		const onResize = () => {
			buildCarousel();
		};

		const rafId = window.requestAnimationFrame(buildCarousel);
		window.addEventListener("resize", onResize);
		window.addEventListener("orientationchange", onResize);

		const imageListeners = [];
		sectionEl.querySelectorAll("img[data-tech-name]").forEach((img) => {
			if (img.complete) return;
			const listener = () => buildCarousel();
			img.addEventListener("load", listener);
			imageListeners.push({ img, listener });
		});

		return () => {
			window.cancelAnimationFrame(rafId);
			window.removeEventListener("resize", onResize);
			window.removeEventListener("orientationchange", onResize);
			imageListeners.forEach(({ img, listener }) => img.removeEventListener("load", listener));
			sectionEl.querySelectorAll(".tech-row-clone").forEach((clone) => clone.remove());
		};
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return undefined;
		const sectionEl = sectionRef.current;
		const tooltipEl = tooltipRef.current;
		if (!sectionEl || !tooltipEl) return undefined;

		let hideTimeout = null;
		const pointerIsCoarse = window.matchMedia("(pointer: coarse)").matches;

		const showTooltip = (text) => {
			tooltipEl.textContent = text;
			tooltipEl.classList.add("visible");
			tooltipEl.setAttribute("aria-hidden", "false");
		};

		const hideTooltip = () => {
			tooltipEl.classList.remove("visible");
			tooltipEl.setAttribute("aria-hidden", "true");
		};

		const handleMouseOver = (event) => {
			const target = event.target;
			if (!(target instanceof HTMLElement)) return;
			if (!target.dataset.techName) return;
			showTooltip(target.dataset.techName);
		};

		const handleMouseMove = (event) => {
			if (!tooltipEl.classList.contains("visible")) return;
			const x = event.clientX;
			const y = event.clientY - 40;
			tooltipEl.style.left = `${x}px`;
			tooltipEl.style.top = `${y}px`;
		};

		const handleMouseOut = (event) => {
			const target = event.target;
			if (!(target instanceof HTMLElement)) return;
			if (!target.dataset.techName) return;
			hideTooltip();
		};

		const handleTouchStart = (event) => {
			const target = event.target;
			if (!(target instanceof HTMLElement)) return;
			if (!target.dataset.techName) return;
			const techName = target.dataset.techName || "Tecnologia";
			showTooltip(techName);
			const rect = target.getBoundingClientRect();
			tooltipEl.style.left = `${rect.left + rect.width / 2}px`;
			tooltipEl.style.top = `${rect.top - 60}px`;
			if (hideTimeout) window.clearTimeout(hideTimeout);
			hideTimeout = window.setTimeout(hideTooltip, 2000);
		};

		if (pointerIsCoarse) {
			sectionEl.addEventListener("touchstart", handleTouchStart, { passive: true });
		} else {
			sectionEl.addEventListener("mouseover", handleMouseOver);
			sectionEl.addEventListener("mousemove", handleMouseMove);
			sectionEl.addEventListener("mouseout", handleMouseOut);
		}

		return () => {
			if (pointerIsCoarse) {
				sectionEl.removeEventListener("touchstart", handleTouchStart);
			} else {
				sectionEl.removeEventListener("mouseover", handleMouseOver);
				sectionEl.removeEventListener("mousemove", handleMouseMove);
				sectionEl.removeEventListener("mouseout", handleMouseOut);
			}
			if (hideTimeout) {
				window.clearTimeout(hideTimeout);
			}
			hideTooltip();
		};
	}, []);

	const current = copy[lang] || copy.pt;
	const ariaLabel = current.heading;

	return (
		<section
			id="ferramentas"
			className="tech-section"
			aria-label={ariaLabel}
			data-section="technologies"
			ref={sectionRef}
		>
			<div className="tech-container">
				<h2 id="technologies-title" className="tech-heading">
					{current.heading}
				</h2>
				<p className="tech-description">{current.description}</p>
			</div>
			<div className="tech-rows" role="list" aria-labelledby="technologies-title">
				{TECHNOLOGY_ROWS.map((row, index) => (
					<div className="tech-scroll-container" role="presentation" key={row.map((item) => item.slug).join("-")}>
						<div
							className={`tech-row-wrapper ${index % 2 === 0 ? "scroll-left" : "scroll-right"}`}
							role="listitem"
						>
							<div className="tech-row">
								{row.map((tech) => (
									<img
										key={tech.slug}
										src={`https://skillicons.dev/icons?i=${tech.slug}`}
										alt={tech.label}
										data-tech-name={tech.label}
										loading="lazy"
										decoding="async"
										draggable="false"
										referrerPolicy="no-referrer"
									/>
								))}
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="tech-footer">
				<p className="tech-hint">{current.hint}</p>
			</div>
			<div id="tech-tooltip" className="tech-tooltip" role="tooltip" aria-hidden="true" ref={tooltipRef} />
		</section>
	);
}
