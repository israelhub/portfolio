import { useEffect, useRef, useState } from "react";
import "./MusicPlayer.css";

export default function MusicPlayer() {
	const audioRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(0.5);
	const [isMinimized, setIsMinimized] = useState(false);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	}, [volume]);

	const togglePlay = () => {
		if (!audioRef.current) return;
		
		if (isPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current.play().catch((error) => {
				console.warn("Autoplay blocked:", error);
			});
		}
		setIsPlaying(!isPlaying);
	};

	const handleVolumeChange = (event) => {
		const newVolume = parseFloat(event.target.value);
		setVolume(newVolume);
	};

	const toggleMinimize = () => {
		setIsMinimized(!isMinimized);
	};

	return (
		<div className={`music-player ${isMinimized ? "minimized" : ""}`}>
			<audio
				ref={audioRef}
				loop
				preload="none"
			>
				{/* Lofi Hip Hop Radio - você pode substituir por qualquer URL de stream ou arquivo local */}
				<source
					src="https://stream.zeno.fm/f3wvbbqmdg8uv"
					type="audio/mpeg"
				/>
				Your browser does not support the audio element.
			</audio>

			{!isMinimized && (
				<>
					<div className="music-player-header">
						<span className="music-player-title">🎵 Lofi Hip Hop</span>
						<button
							className="music-player-minimize"
							onClick={toggleMinimize}
							aria-label="Minimizar player"
						>
							−
						</button>
					</div>

					<div className="music-player-controls">
						<button
							className="music-player-play"
							onClick={togglePlay}
							aria-label={isPlaying ? "Pausar" : "Reproduzir"}
						>
							{isPlaying ? "⏸" : "▶"}
						</button>

						<div className="music-player-volume">
							<span className="volume-icon">🔊</span>
							<input
								type="range"
								min="0"
								max="1"
								step="0.01"
								value={volume}
								onChange={handleVolumeChange}
								className="volume-slider"
								aria-label="Volume"
							/>
						</div>
					</div>
				</>
			)}

			{isMinimized && (
				<button
					className="music-player-restore"
					onClick={toggleMinimize}
					aria-label="Restaurar player"
				>
					🎵
				</button>
			)}
		</div>
	);
}
