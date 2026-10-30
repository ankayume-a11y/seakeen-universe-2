import React, { useState } from 'react';
import { ChevronLeft, Heart, Share, Trash2, Info, Grid, X, Play } from 'lucide-react';
import { sound } from '../../utils/audio';

interface PhotosAppProps {
  photos: string[];
  userName: string;
  onClose: () => void;
}

const isVideo = (url: string) => url.includes('.mp4') || url.includes('/vid/');

export const PhotosApp: React.FC<PhotosAppProps> = ({ photos, userName, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  const toggleFav = (idx: number) => {
    sound.playTap();
    setFavorites((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="absolute inset-0 z-20 bg-black text-white flex flex-col overflow-hidden select-none">
      {/* Top Header */}
      <div className="pt-11 px-4 pb-2 flex items-center justify-between border-b border-neutral-900 bg-black/90 backdrop-blur-md shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Perpustakaan Foto</h1>
          <p className="text-[11px] text-gray-400">{photos.length} Foto</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
          <button onClick={() => sound.playTap()}>Pilih</button>
        </div>
      </div>

      {/* Grid of Photos */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-0.5">
        <div className="grid grid-cols-3 gap-0.5 pb-16">
          {photos.map((src, idx) => (
            <div
              key={idx}
              onClick={() => {
                sound.playTap();
                setSelectedIndex(idx);
              }}
              className="aspect-square bg-neutral-900 overflow-hidden cursor-pointer relative group"
            >
              {isVideo(src) ? (
                <div className="w-full h-full relative bg-neutral-950 flex items-center justify-center">
                  <video
                    src={src}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white">
                    <Play className="w-3 h-3 fill-white" />
                  </div>
                </div>
              ) : (
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              )}
              {favorites[idx] && (
                <div className="absolute bottom-1 right-1">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 drop-shadow" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Photo Viewer */}
      {selectedIndex !== null && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col justify-between select-none animate-fade-in">
          {/* Top action bar */}
          <div className="pt-11 px-4 pb-3 flex items-center justify-between bg-black/70 backdrop-blur-md">
            <button
              onClick={() => {
                sound.playTap();
                setSelectedIndex(null);
              }}
              className="flex items-center gap-1 text-blue-400 text-xs font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Semua Foto</span>
            </button>
            <span className="text-[11px] text-gray-300">
              {selectedIndex + 1} dari {photos.length}
            </span>
            <button
              onClick={() => setSelectedIndex(null)}
              className="p-1 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image or Video */}
          <div className="flex-1 flex items-center justify-center p-2 relative overflow-hidden">
            {isVideo(photos[selectedIndex]) ? (
              <video
                src={photos[selectedIndex]}
                controls
                autoPlay
                playsInline
                className="max-h-full max-w-full rounded-lg shadow-2xl"
              />
            ) : (
              <img
                src={photos[selectedIndex]}
                alt=""
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all"
              />
            )}

            {/* Prev / Next buttons */}
            {selectedIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playTap();
                  setSelectedIndex(selectedIndex - 1);
                }}
                className="absolute left-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/70"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {selectedIndex < photos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playTap();
                  setSelectedIndex(selectedIndex + 1);
                }}
                className="absolute right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/70"
              >
                <ChevronLeft className="w-5 h-5 rotate-180" />
              </button>
            )}
          </div>

          {/* Bottom actions */}
          <div className="pb-8 pt-3 px-6 bg-black/80 backdrop-blur-md flex items-center justify-between text-blue-400 border-t border-neutral-900">
            <button onClick={() => sound.playTap()}>
              <Share className="w-5 h-5" />
            </button>
            <button onClick={() => toggleFav(selectedIndex)}>
              <Heart
                className={`w-5 h-5 ${
                  favorites[selectedIndex] ? 'fill-red-500 text-red-500' : ''
                }`}
              />
            </button>
            <button onClick={() => sound.playTap()}>
              <Info className="w-5 h-5" />
            </button>
            <button onClick={() => sound.playTap()} className="text-red-400">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
