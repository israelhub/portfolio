import { useEffect, useMemo, useState, useRef } from 'react';
import './Navbar.css';
import CV from '../../assets/CV.pdf';

export default function Navbar({ currentSection = 'inicio' }) {
	const [theme, setTheme] = useState(() => {
		if (typeof window === 'undefined') return 'dark';
		const stored = window.localStorage.getItem('theme');
		if (stored === 'light' || stored === 'dark') return stored;
		return document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
	});

	const [lang, setLang] = useState(() => {
		if (typeof window === 'undefined') return 'pt';
		return window.localStorage.getItem('lang') || 'pt';
	});

	const [menuOpen, setMenuOpen] = useState(false);
	const [isMuted, setIsMuted] = useState(true);
	const iframeRef = useRef(null);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		window.localStorage.setItem('lang', lang);
		window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
		if (typeof document !== 'undefined') {
			document.documentElement.lang = lang;
		}
	}, [lang]);

	useEffect(() => {
		if (typeof document === 'undefined') return;
		const root = document.documentElement;
		if (theme === 'light') {
			document.body.setAttribute('data-theme', 'light');
		} else {
			document.body.removeAttribute('data-theme');
		}
		root.style.colorScheme = theme === 'light' ? 'light' : 'dark';
		if (typeof window !== 'undefined') {
			window.localStorage.setItem('theme', theme);
		}
	}, [theme]);

	useEffect(() => {
		if (typeof document === 'undefined') return;
		document.body.style.overflow = menuOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [menuOpen]);

	const navItems = useMemo(
		() => [
			{ id: 'projetos', labelPT: 'Projetos', labelEN: 'Projects' },
			{ id: 'sobre', labelPT: 'Sobre', labelEN: 'About' },
			{ id: 'ferramentas', labelPT: 'Ferramentas', labelEN: 'Tools' },
			{ id: 'contato', labelPT: 'Contato', labelEN: 'Contact' },
		],
		[]
	);

	const scrollTo = (id) => {
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		setMenuOpen(false);
	};

	const onToggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
	
	const onToggleMute = () => {
		if (iframeRef.current && iframeRef.current.contentWindow) {
			const action = isMuted ? 'unMute' : 'mute';
			iframeRef.current.contentWindow.postMessage(
				JSON.stringify({ event: 'command', func: action, args: '' }),
				'*'
			);
		}
		setIsMuted(!isMuted);
	};
	
	const label = (pt, en) => (lang === 'pt' ? pt : en);

	return (
		<header className="navbar" role="banner">
			<div className="navbar__inner">
				<a
					href="#inicio"
					className="brand"
					aria-label={label('Voltar ao início', 'Back to top')}
					onClick={(event) => {
						event.preventDefault();
						scrollTo('inicio');
					}}
				>
					Israel Cunha
				</a>

				<div className={`navbar__center ${menuOpen ? 'menu-open' : ''}`}>
					<nav className="nav" aria-label={label('Navegação principal', 'Primary navigation')}>
						<ul className="nav__list">
							{navItems.map((item) => (
								<li key={item.id} className="nav__item">
									<a
										href={`#${item.id}`}
										className={`nav__link${currentSection === item.id ? ' is-active' : ''}`}
										onClick={(event) => {
											event.preventDefault();
											scrollTo(item.id);
										}}
									>
										{label(item.labelPT, item.labelEN)}
									</a>
								</li>
							))}
						</ul>
					</nav>

					<div className="mobile-actions">
						<a
							className="btn btn--ghost"
							href={CV}
							download="Israel_Cunha_CV.pdf"
							aria-label={label('Baixar currículo', 'Download resume')}
						>
							{label('Currículo', 'Resume')}
						</a>
					</div>
				</div>

				<div className="navbar__actions">
					<a
						className="btn btn--ghost"
						href={CV}
						download="Israel_Cunha_CV.pdf"
						aria-label={label('Baixar currículo', 'Download resume')}
					>
						{label('Currículo', 'Resume')}
					</a>

					<button 
						className="icon-btn" 
						aria-label={label(isMuted ? 'Ativar música' : 'Desativar música', isMuted ? 'Enable music' : 'Disable music')} 
						onClick={onToggleMute}
					>
						{isMuted ? (
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
								<line x1="23" y1="9" x2="17" y2="15" />
								<line x1="17" y1="9" x2="23" y2="15" />
							</svg>
						) : (
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
								<path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
							</svg>
						)}
					</button>

					<button className="icon-btn" aria-label={label('Alternar tema', 'Toggle theme')} onClick={onToggleTheme}>
						{theme === 'dark' ? (
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<circle cx="12" cy="12" r="4" />
								<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
							</svg>
						) : (
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
							</svg>
						)}
					</button>

					<div className="lang-toggle">
						<button
							className={lang === 'pt' ? 'active' : ''}
							onClick={() => setLang('pt')}
							disabled={lang === 'pt'}
							aria-label="Português"
						>
							PT
						</button>
						<span className="sep">/</span>
						<button
							className={lang === 'en' ? 'active' : ''}
							onClick={() => setLang('en')}
							disabled={lang === 'en'}
							aria-label="English"
						>
							EN
						</button>
					</div>
				</div>

				<button
					className="hamburger"
					aria-label={label('Menu', 'Menu')}
					aria-expanded={menuOpen}
					onClick={() => setMenuOpen((open) => !open)}
				>
					<span className="hamburger__line" />
					<span className="hamburger__line" />
					<span className="hamburger__line" />
				</button>
			</div>

			{/* YouTube iframe escondido para música de fundo */}
			<iframe
				ref={iframeRef}
				style={{
					position: 'fixed',
					top: '-9999px',
					left: '-9999px',
					width: '1px',
					height: '1px',
					opacity: 0,
					pointerEvents: 'none'
				}}
				src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&loop=1&playlist=jfKfPfyJRdk&enablejsapi=1&mute=1"
				title="Background Music"
				allow="autoplay"
				aria-hidden="true"
			/>
		</header>
	);
}
