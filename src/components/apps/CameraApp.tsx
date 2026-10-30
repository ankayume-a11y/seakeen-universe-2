import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, ChevronLeft, VolumeX, AlertCircle } from 'lucide-react';
import { sound } from '../../utils/audio';

interface CameraAppProps {
  frontVideo: string;
  backVideo: string;
  onClose: () => void;
}

export const CameraApp: React.FC<CameraAppProps> = ({ frontVideo, backVideo, onClose }) => {
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('front');
  const [flashActive, setFlashActive] = useState(false);
  const [zoom, setZoom] = useState('1x');
  const [cameraMode, setCameraMode] = useState<'FOTO' | 'VIDEO' | 'POTRET'>('VIDEO');
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeSrc = cameraFacing === 'front' ? frontVideo : backVideo;

  // Ensure video plays smoothly without audio
  useEffect(() => {
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.volume = 0;
            videoRef.current.play().catch(() => setVideoError(true));
          }
        });
      }
    }
  }, [cameraFacing, activeSrc]);

  const toggleFacing = () => {
    sound.playTap();
    setCameraFacing((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const handleShutter = () => {
    sound.playCameraShutter();
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 150);
  };

  return (
    <div className="absolute inset-0 z-20 bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header & Quick Switcher */}
      <div className="pt-11 px-4 pb-2 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/50 to-transparent z-20">
        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="p-1.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70"
          title="Kembali"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Camera Selector Pills */}
        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20 text-xs">
          <button
            onClick={() => {
              if (cameraFacing !== 'front') {
                sound.playTap();
                setCameraFacing('front');
              }
            }}
            className={`px-3 py-1 rounded-full font-semibold transition-all ${
              cameraFacing === 'front'
                ? 'bg-amber-400 text-black shadow'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Kamera Depan
          </button>
          <button
            onClick={() => {
              if (cameraFacing !== 'back') {
                sound.playTap();
                setCameraFacing('back');
              }
            }}
            className={`px-3 py-1 rounded-full font-semibold transition-all ${
              cameraFacing === 'back'
                ? 'bg-amber-400 text-black shadow'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Kamera Belakang
          </button>
        </div>

        {/* Video Audio Muted Indicator */}
        <div
          className="p-1.5 rounded-full bg-black/50 backdrop-blur-md text-gray-400"
          title="Audio video dimatikan"
        >
          <VolumeX className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Camera Live Viewfinder */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-neutral-950">
        <video
          ref={videoRef}
          key={`${cameraFacing}-${activeSrc}`}
          src={activeSrc}
          autoPlay
          loop
          playsInline
          muted
          onError={() => setVideoError(true)}
          className={`w-full h-full object-cover transition-all duration-300 ${
            cameraFacing === 'front' ? 'scale-x-[-1]' : ''
          }`}
        />

        {/* Fallback if video error */}
        {videoError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-neutral-900/90 text-white z-10">
            <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
            <p className="text-xs font-semibold">Memuat feed video kamera...</p>
            <button
              onClick={() => {
                setVideoError(false);
                videoRef.current?.load();
                videoRef.current?.play();
              }}
              className="mt-3 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-medium"
            >
              Muat Ulang Video
            </button>
          </div>
        )}

        {/* Shutter flash effect */}
        {flashActive && <div className="absolute inset-0 bg-white z-30 animate-fade-out pointer-events-none" />}

        {/* iOS Camera Rule-of-Thirds Grid */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-r border-white" />
          <div />
        </div>

        {/* Active Camera Label Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase text-amber-300 border border-white/10">
            ● LIVE {cameraFacing === 'front' ? 'FRONT' : 'BACK'}
          </span>
        </div>

        {/* Zoom selector */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold border border-white/15">
          {['0.5', '1x', '2', '5'].map((z) => (
            <button
              key={z}
              onClick={() => {
                sound.playTap();
                setZoom(z);
              }}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition text-[11px] ${
                zoom === z ? 'bg-amber-400 text-black font-extrabold' : 'text-white/80'
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* Modes & Shutter Bar */}
      <div className="pb-8 pt-3 bg-black flex flex-col items-center gap-3 z-20">
        {/* Camera Modes */}
        <div className="flex items-center gap-5 text-[11px] font-bold tracking-wider text-gray-400">
          {(['POTRET', 'FOTO', 'VIDEO'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                sound.playTap();
                setCameraMode(mode);
              }}
              className={`transition-colors ${
                cameraMode === mode ? 'text-amber-400 scale-105' : 'hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Shutter Controls */}
        <div className="w-full px-8 flex items-center justify-between">
          {/* Gallery preview thumbnail */}
          <div className="w-11 h-11 rounded-lg border-2 border-white/40 overflow-hidden bg-neutral-800 shadow">
            <img
              src="https://i.pinimg.com/736x/23/35/b8/2335b834e047043ddf3f173ed20450fb.jpg"
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Shutter Button */}
          <button
            onClick={handleShutter}
            className="w-18 h-18 rounded-full border-4 border-white p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
            title="Ambil Foto"
          >
            <div
              className={`w-full h-full rounded-full transition ${
                cameraMode === 'VIDEO' ? 'bg-rose-500 rounded-2xl' : 'bg-white active:bg-gray-300'
              }`}
            />
          </button>

          {/* Switch Camera Button */}
          <button
            onClick={toggleFacing}
            className="w-11 h-11 rounded-full bg-neutral-800/90 border border-white/20 flex items-center justify-center text-white hover:bg-neutral-700 active:scale-95 transition cursor-pointer shadow"
            title="Putar Kamera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
