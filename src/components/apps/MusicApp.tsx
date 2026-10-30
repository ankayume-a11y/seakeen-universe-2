import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  ChevronDown,
  ListMusic,
  Heart,
  Share2,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface MusicAppProps {
  music: {
    title: string;
    artist: string;
    cover: string;
    src: string;
  };
  isPlaying: boolean;
  onTogglePlay: (playing: boolean) => void;
  onClose: () => void;
}

export const MusicApp: React.FC<MusicAppProps> = ({
  music,
  isPlaying,
  onTogglePlay,
  onClose,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    sound.playTap();
    const nextState = !isPlaying;
    onTogglePlay(nextState);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#402035] via-[#1a101f] to-black text-white flex flex-col justify-between overflow-hidden select-none px-6 pb-12">
      {/* Hidden media element that streams the audio from video */}
      <video
        ref={audioRef}
        src={music.src}
        loop
        playsInline
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            if (audioRef.current.duration) {
              setDuration(audioRef.current.duration);
            }
          }
        }}
        className="hidden"
      />

      {/* Top Header */}
      <div className="pt-11 pb-2 flex items-center justify-between text-white/80">
        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="p-1 hover:text-white"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
        <span className="text-[11px] font-semibold tracking-wider uppercase text-white/60">
          Memutar dari Daftar Lagu
        </span>
        <button onClick={() => sound.playTap()} className="p-1 hover:text-white">
          <ListMusic className="w-5 h-5" />
        </button>
      </div>

      {/* Album Artwork with subtle glow */}
      <div className="my-auto flex flex-col items-center">
        <div className="relative group">
          <div
            className={`w-64 h-64 rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-white/10 transition-transform duration-500 ${
              isPlaying ? 'scale-100 shadow-pink-500/20' : 'scale-90 opacity-90'
            }`}
          >
            <img src={music.cover} alt="" className="w-full h-full object-cover" />
          </div>

          {/* Equalizer animation overlay when playing */}
          {isPlaying && (
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md flex items-end gap-1 h-5">
              <span className="w-1 bg-pink-400 rounded-full animate-bounce h-3" />
              <span className="w-1 bg-pink-400 rounded-full animate-pulse h-4" />
              <span className="w-1 bg-pink-400 rounded-full animate-bounce h-2" />
            </div>
          )}
        </div>

        {/* Track Title & Artist */}
        <div className="w-full mt-6 flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-4">
            <h2 className="text-xl font-bold text-white tracking-tight truncate">{music.title}</h2>
            <p className="text-sm text-pink-300 font-medium truncate">{music.artist}</p>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              setIsLiked((prev) => !prev);
            }}
            className="p-2"
          >
            <Heart
              className={`w-6 h-6 ${
                isLiked ? 'fill-pink-500 text-pink-500' : 'text-white/60 hover:text-white'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Scrub bar & Controls */}
      <div className="w-full space-y-4">
        {/* Scrubber */}
        <div>
          <div className="relative w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-white/50 mt-1.5 font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
          </div>
        </div>

        {/* Playback buttons */}
        <div className="flex items-center justify-between px-4">
          <button onClick={() => sound.playTap()} className="text-white/60 hover:text-white">
            <Shuffle className="w-5 h-5" />
          </button>
          <button onClick={() => sound.playTap()} className="text-white hover:scale-110 transition">
            <SkipBack className="w-7 h-7 fill-white" />
          </button>
          <button
            onClick={handlePlayPause}
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg transition"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-black" />
            ) : (
              <Play className="w-8 h-8 fill-black ml-1" />
            )}
          </button>
          <button onClick={() => sound.playTap()} className="text-white hover:scale-110 transition">
            <SkipForward className="w-7 h-7 fill-white" />
          </button>
          <button onClick={() => sound.playTap()} className="text-white/60 hover:text-white">
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        {/* Volume & Airplay */}
        <div className="flex items-center gap-3 text-white/60 pt-2">
          <Volume2 className="w-4 h-4" />
          <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-white/70 rounded-full" />
          </div>
          <Share2 className="w-4 h-4 cursor-pointer hover:text-white" />
        </div>
      </div>
    </div>
  );
};
