import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "DATA_BREACH.WAV", artist: "UNKNOWN_ENTITY", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration: "6:12" },
  { id: 2, title: "NULL_POINTER_EXCEPTION", artist: "SYS_ADMIN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", duration: "7:05" },
  { id: 3, title: "KERNAL_PANIC.MP3", artist: "ROOTKIT", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", duration: "5:44" }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const track = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Playback failed:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const handleNext = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const handlePrev = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Create blocky progression bar
  const totalBlocks = 20;
  const filledBlocks = Math.floor((progress / 100) * totalBlocks);
  const barString = "█".repeat(filledBlocks) + "▒".repeat(totalBlocks - filledBlocks);

  return (
    <div className="flex flex-col text-2xl font-glitch w-full">
      <audio ref={audioRef} src={track.url} onTimeUpdate={handleTimeUpdate} onEnded={handleNext} />

      <div className="border-2 border-[#f0f] border-dashed p-4 mb-6 bg-[#000]">
        <h3 className="text-[#0ff] mb-2 uppercase animate-pulse">&gt; PLAYING:</h3>
        <p className="text-3xl text-[#f0f] font-bold glitch-text" data-text={track.title}>{track.title}</p>
        <p className="text-xl text-[#0ff] mt-2">AUTHOR // {track.artist}</p>
      </div>

      <div className="w-full mb-6 text-[#0ff]">
        <div className="flex justify-between mb-2">
           <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : "00:00"}</span>
           <span className="text-[#f0f] animate-pulse">[{currentTrackIndex + 1}/{TRACKS.length}]</span>
        </div>
        <div className="text-3xl text-[#f0f] tracking-widest break-all">
          [{barString}]
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mt-4">
        <button onClick={handlePrev} className="btn-glitch flex-1">&lt;&lt; PRV</button>
        <button onClick={togglePlay} className="btn-glitch flex-[2] bg-[#f0f] text-[#000] border-[#f0f]">
          {isPlaying ? "|| STOP" : ">> PLAY"}
        </button>
        <button onClick={handleNext} className="btn-glitch flex-1">NXT &gt;&gt;</button>
      </div>
    </div>
  );
}
