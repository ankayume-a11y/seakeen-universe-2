import React from 'react';
import { sound } from '../utils/audio';

interface IPhoneFrameProps {
  children: React.ReactNode;
  onHomeClick: () => void;
  onPowerClick?: () => void;
  onVolumeUp?: () => void;
  onVolumeDown?: () => void;
  onActionClick?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isCallActive?: boolean;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  children,
  onHomeClick,
  onPowerClick,
  onVolumeUp,
  onVolumeDown,
  onActionClick,
  isFullscreen = false,
  onToggleFullscreen,
  isCallActive = false,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-40 bg-neutral-950/95 backdrop-blur-md overflow-hidden p-2'
          : 'p-1 sm:p-4 max-w-full'
      }`}
    >
      {/* Floating exit fullscreen button when active */}
      {isFullscreen && onToggleFullscreen && (
        <button
          onClick={onToggleFullscreen}
          className="absolute top-3 right-3 z-50 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs backdrop-blur-md flex items-center gap-1.5 border border-white/10 cursor-pointer shadow-lg active:scale-95 transition"
        >
          <span>✕ Keluar Layar Penuh</span>
        </button>
      )}

      {/* Outer Titanium Frame (Panjang & lebar authentic iPhone tetap konsisten, tidak diubah) */}
      <div className="relative w-[375px] sm:w-[395px] h-[785px] sm:h-[825px] max-h-[95vh] aspect-[395/825] bg-[#222126] rounded-[55px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_2px_#3a3840,0_0_0_4px_#18171c] ring-1 ring-white/10 transition-all duration-300 flex flex-col shrink-0">
        {/* Antenna bands */}
        <div className="absolute -left-[2px] top-28 w-[3px] h-3 bg-[#111] rounded-r-xs" />
        <div className="absolute -left-[2px] bottom-36 w-[3px] h-3 bg-[#111] rounded-r-xs" />
        <div className="absolute -right-[2px] top-28 w-[3px] h-3 bg-[#111] rounded-l-xs" />
        <div className="absolute -right-[2px] bottom-36 w-[3px] h-3 bg-[#111] rounded-l-xs" />

        {/* Physical Action Button (Left Top) */}
        <button
          onClick={() => {
            sound.playTap();
            if (onActionClick) onActionClick();
          }}
          className="absolute -left-[14px] top-28 w-[4px] h-8 bg-gradient-to-r from-[#444] to-[#222] rounded-l-md hover:w-[5px] active:w-[3px] transition-all cursor-pointer shadow-sm"
          title="Tombol Aksi"
        />

        {/* Volume Up Button (Left) */}
        <button
          onClick={() => {
            sound.playTap();
            if (onVolumeUp) onVolumeUp();
          }}
          className="absolute -left-[14px] top-42 w-[4px] h-14 bg-gradient-to-r from-[#444] to-[#222] rounded-l-md hover:w-[5px] active:w-[3px] transition-all cursor-pointer shadow-sm"
          title="Volume +"
        />

        {/* Volume Down Button (Left) */}
        <button
          onClick={() => {
            sound.playTap();
            if (onVolumeDown) onVolumeDown();
          }}
          className="absolute -left-[14px] top-60 w-[4px] h-14 bg-gradient-to-r from-[#444] to-[#222] rounded-l-md hover:w-[5px] active:w-[3px] transition-all cursor-pointer shadow-sm"
          title="Volume -"
        />

        {/* Power / Side Button (Right) */}
        <button
          onClick={() => {
            sound.playLock();
            if (onPowerClick) onPowerClick();
          }}
          className="absolute -right-[14px] top-44 w-[4px] h-18 bg-gradient-to-l from-[#444] to-[#222] rounded-r-md hover:w-[5px] active:w-[3px] transition-all cursor-pointer shadow-sm"
          title="Tombol Daya / Kunci"
        />

        {/* Camera Control Button (Right Bottom) */}
        <button
          onClick={() => {
            sound.playCameraShutter();
            if (onActionClick) onActionClick();
          }}
          className="absolute -right-[14px] bottom-40 w-[4px] h-14 bg-gradient-to-l from-[#333] to-[#1a1a1a] rounded-r-md hover:w-[5px] active:w-[3px] transition-all cursor-pointer shadow-sm"
          title="Camera Control"
        />

        {/* Bezel Border and Display Screen (selalu rounded autentik iPhone) */}
        <div className="relative w-full h-full bg-black rounded-[46px] overflow-hidden border-[3px] border-black shadow-inner flex flex-col">
          {/* Screen Content */}
          <div className="relative w-full h-full flex flex-col overflow-hidden">
            {children}
          </div>

          {/* iOS Home Indicator Bar - disembunyikan saat panggilan masuk/aktif agar user wajib merespon dengan tombol hijau/merah */}
          {!isCallActive && (
            <div
              onClick={() => {
                sound.playTap();
                onHomeClick();
              }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-4 flex items-center justify-center cursor-pointer z-50 group py-1"
              title="Geser ke Atas / Klik untuk Beranda"
            >
              <div className="w-32 h-1 bg-white/70 group-hover:bg-white rounded-full group-hover:h-1.5 transition-all shadow-sm" />
            </div>
          )}

          {/* Screen glass reflection subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.06] pointer-events-none rounded-[46px]" />
        </div>
      </div>
    </div>
  );
};
