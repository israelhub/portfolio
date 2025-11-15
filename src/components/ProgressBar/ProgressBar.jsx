import { useEffect, useState } from 'react';
import './ProgressBar.css';

export default function ProgressBar() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const updateProgress = () => {
			const scrollContainer = document.querySelector('.app');
			if (!scrollContainer) return;

			const scrollTop = scrollContainer.scrollTop;
			const scrollHeight = scrollContainer.scrollHeight;
			const clientHeight = scrollContainer.clientHeight;
			
			const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
			setProgress(scrolled);
		};

		const scrollContainer = document.querySelector('.app');
		if (scrollContainer) {
			scrollContainer.addEventListener('scroll', updateProgress);
			updateProgress(); // Initial call
		}

		return () => {
			if (scrollContainer) {
				scrollContainer.removeEventListener('scroll', updateProgress);
			}
		};
	}, []);

	return (
		<div className="progress-bar-container">
			<div 
				className="progress-bar-fill" 
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
}
