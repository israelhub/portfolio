import { useEffect, useState } from 'react';

const DEFAULT_LANG = 'pt';
const SUPPORTED = new Set(['pt', 'en']);

const getInitialLanguage = () => {
	if (typeof window === 'undefined') return DEFAULT_LANG;
	const stored = window.localStorage.getItem('lang');
	if (stored && SUPPORTED.has(stored)) {
		return stored;
	}
	return DEFAULT_LANG;
};

export function useLanguage() {
	const [lang, setLang] = useState(getInitialLanguage);

	useEffect(() => {
		if (typeof window === 'undefined') return undefined;
		const handleLanguageChange = (event) => {
			const nextLang = event.detail;
			if (SUPPORTED.has(nextLang)) {
				setLang(nextLang);
			}
		};

		window.addEventListener('languageChange', handleLanguageChange);
		return () => window.removeEventListener('languageChange', handleLanguageChange);
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') return undefined;
		const handleStorage = (event) => {
			if (event.key === 'lang' && SUPPORTED.has(event.newValue)) {
				setLang(event.newValue);
			}
		};

		window.addEventListener('storage', handleStorage);
		return () => window.removeEventListener('storage', handleStorage);
	}, []);

	return lang;
}
