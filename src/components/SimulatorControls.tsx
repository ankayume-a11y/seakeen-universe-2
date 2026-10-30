import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Smartphone,
  ChevronRight,
  Info,
  HelpCircle,
  Play,
  Heart,
  Maximize2,
  Minimize2,
  Lock,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface SimulatorControlsProps {
  pov: 'keen' | 'sea';
  onSwitchPov: (newPov: 'keen' | 'sea') => void;
  currentStep: number;
  totalSteps: number;
  stepDescription: string;
  onNextStep?: () => void;
  onJumpToStep?: (step: number) => void;
  onResetStory: () => void;
  freeMode: boolean;
  onToggleFreeMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isSeaUnlocked?: boolean;
  isStep1Unlocked?: boolean;
}

export const SimulatorControls: React.FC<SimulatorControlsProps> = ({
  pov,
  onSwitchPov,
  currentStep,
  totalSteps,
  stepDescription,
  onNextStep,
  onJumpToStep,
  onResetStory,
  freeMode,
  onToggleFreeMode,
  soundEnabled,
  onToggleSound,
  isFullscreen = false,
  onToggleFullscreen,
  isSeaUnlocked = false,
  isStep1Unlocked = false,
}) => {
  const [showGuide, setShowGuide] = useState(false);
  const [lockedToast, setLockedToast] = useState<string | null>(null);

  const handleSwitchPovClick = () => {
    sound.playTap();
    if (pov === 'keen' && !isSeaUnlocked) {
      setLockedToast('🔒 POV Sea masih terkunci! Selesaikan cerita POV Keen sampai akhir terlebih dahulu.');
      setTimeout(() => setLockedToast(null), 3000);
      return;
    }
    onSwitchPov(pov === 'keen' ? 'sea' : 'keen');
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-4 px-4 select-none z-50">
      {/* Toast Alert for Locked Features */}
      {lockedToast && (
        <div className="mb-2 p-2.5 bg-rose-500/95 text-white text-xs font-medium rounded-xl shadow-xl border border-rose-400 flex items-center justify-between gap-2 animate-bounce">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0 text-amber-200" />
            <span>{lockedToast}</span>
          </div>
          <button
            onClick={() => setLockedToast(null)}
            className="text-white/80 hover:text-white text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-700/80 rounded-2xl p-3.5 shadow-2xl text-white flex flex-col gap-3">
        {/* Top Info Row */}
        <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                pov === 'keen'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              }`}
            >
              <span>{pov === 'keen' ? '🦐 POV: Keen' : '🦦 POV: Sea'}</span>
            </span>

            <span className="text-gray-400">
              {freeMode ? (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Mode Bebas (Freemode)
                </span>
              ) : (
                `Skenario ${currentStep} / ${totalSteps}`
              )}
            </span>
          </div>

          {/* Sound, Fullscreen & Guide buttons */}
          <div className="flex items-center gap-2">
            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
                  isFullscreen
                    ? 'bg-blue-600/30 border-blue-500/50 text-blue-300'
                    : 'bg-neutral-800 border-neutral-700 text-gray-300 hover:text-white'
                }`}
                title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (Fit Layar)'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <span className="text-[10px] hidden sm:inline">
                  {isFullscreen ? 'Kecilkan' : 'Layar Penuh'}
                </span>
              </button>
            )}

            <button
              onClick={onToggleSound}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
                soundEnabled
                  ? 'bg-neutral-800 border-neutral-700 text-green-400'
                  : 'bg-neutral-800 border-neutral-700 text-gray-500'
              }`}
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-[10px] hidden sm:inline">{soundEnabled ? 'Suara Aktif' : 'Bisu'}</span>
            </button>

            <button
              onClick={() => setShowGuide((prev) => !prev)}
              className="p-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-gray-300 hover:text-white"
              title="Panduan Simulator"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Story description banner */}
        {!freeMode && (
          <div className="bg-neutral-800/70 rounded-xl px-3 py-2 flex items-center justify-between gap-2 text-xs">
            <div className="truncate flex-1 text-gray-200">
              <span className="font-semibold text-amber-400 mr-1.5">Alur Cerita:</span>
              <span>{stepDescription}</span>
            </div>
            {onNextStep && (
              <button
                onClick={() => {
                  sound.playTap();
                  if (currentStep === 1 && !isStep1Unlocked) {
                    sound.playCallEnd();
                    setLockedToast('🔒 Masukkan password di layar lockscreen terlebih dahulu!');
                    setTimeout(() => setLockedToast(null), 3000);
                    return;
                  }
                  onNextStep();
                }}
                className={`px-2.5 py-1 rounded-lg text-white font-medium text-[11px] shrink-0 flex items-center gap-1 shadow active:scale-95 transition ${
                  currentStep === 1 && !isStep1Unlocked
                    ? 'bg-neutral-700 text-gray-300 border border-neutral-600'
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                {currentStep === 1 && !isStep1Unlocked ? (
                  <>
                    <Lock className="w-3 h-3 text-amber-300" />
                    <span>Lanjut (Terkunci)</span>
                  </>
                ) : (
                  <>
                    <span>Lanjut</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
          {/* Switch POV button */}
          <button
            onClick={handleSwitchPovClick}
            className={`px-3 py-1.5 rounded-xl font-semibold text-white flex items-center gap-1.5 shadow active:scale-95 transition ${
              pov === 'keen' && !isSeaUnlocked
                ? 'bg-neutral-800 hover:bg-neutral-700 text-gray-300 border border-neutral-700'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'
            }`}
            title={pov === 'keen' && !isSeaUnlocked ? 'Selesaikan POV Keen terlebih dahulu untuk membuka POV Sea' : 'Ganti Sudut Pandang'}
          >
            {pov === 'keen' && !isSeaUnlocked ? (
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Smartphone className="w-3.5 h-3.5" />
            )}
            <span>
              {pov === 'keen'
                ? isSeaUnlocked
                  ? 'Ganti POV ke Sea'
                  : 'POV Sea (Terkunci 🔒)'
                : 'Ganti POV ke Keen'}
            </span>
          </button>

          {/* Toggle Free Mode */}
          <button
            onClick={() => {
              sound.playTap();
              if (currentStep === 1 && !isStep1Unlocked) {
                sound.playCallEnd();
                setLockedToast('🔒 Buka kunci layar lockscreen dengan password terlebih dahulu untuk menjelajahi HP!');
                setTimeout(() => setLockedToast(null), 3500);
                return;
              }
              onToggleFreeMode();
            }}
            className={`px-3 py-1.5 rounded-xl border font-medium flex items-center gap-1.5 transition active:scale-95 ${
              freeMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-neutral-800 hover:bg-neutral-700 text-gray-300 border-neutral-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{freeMode ? 'Kembali ke Cerita' : 'Jelajahi HP Bebas'}</span>
          </button>

          {/* Reset button */}
          <button
            onClick={() => {
              sound.playTap();
              onResetStory();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-gray-400 hover:text-white border border-neutral-700 flex items-center gap-1"
            title="Mulai Ulang Cerita Dari Awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ulang Cerita</span>
          </button>
        </div>

        {/* Quick Scenario Jump dropdown */}
        <div className="flex items-center gap-2 pt-1 border-t border-neutral-800 text-[11px] text-gray-400">
          <span>Lompat Cepat ke Skenario:</span>
          <select
            value={currentStep}
            onChange={(e) => {
              const target = Number(e.target.value);
              if (currentStep === 1 && !isStep1Unlocked && target > 1) {
                sound.playCallEnd();
                setLockedToast('🔒 Skenario selanjutnya terkunci! Masukkan password di layar lockscreen terlebih dahulu.');
                setTimeout(() => setLockedToast(null), 3500);
                return;
              }
              sound.playTap();
              if (onJumpToStep) onJumpToStep(target);
            }}
            className="bg-neutral-800 text-white rounded-lg px-2 py-1 border border-neutral-700 outline-none text-xs"
          >
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => {
              const isLocked = currentStep === 1 && !isStep1Unlocked && s > 1;
              return (
                <option key={s} value={s} disabled={isLocked}>
                  {isLocked ? `🔒 Skenario ${s} (Terkunci)` : `Skenario ${s}`}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Guide Modal */}
      {showGuide && (
        <div className="mt-3 p-4 bg-neutral-900/95 border border-neutral-700 rounded-2xl text-xs text-gray-200 leading-relaxed shadow-xl animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5 text-amber-400">
              <Info className="w-4 h-4" /> Petunjuk Membaca AU SEAKEEN
            </h3>
            <button
              onClick={() => setShowGuide(false)}
              className="text-gray-400 hover:text-white font-bold px-2 py-0.5 rounded-md bg-neutral-800"
            >
              ✕
            </button>
          </div>
          <ul className="space-y-1.5 list-disc pl-4 text-gray-300 text-[11px]">
            <li>
              <strong>Buka Layar (Lockscreen):</strong> Masukkan passcode 4 angka (untuk Keen dan untuk Sea). Tidak ada petunjuk di layar simulator seperti yang diminta.
            </li>
            <li>
              <strong>Efek Suara Lengkap:</strong> Disertai suara buka kunci, klik tombol tombol virtual, bunyi notifikasi iOS, dering telepon, penolakan panggilan, dan rana kamera.
            </li>
            <li>
              <strong>Mengetik Balasan:</strong> Saat ada giliran membalas di X atau LINE, tekan tombol di keyboard virtual untuk mengetik huruf per huruf (atau gunakan tombol <em>"Ketik Otomatis"</em>), lalu tekan tombol <em>"Kirim"</em>.
            </li>
            <li>
              <strong>Panggilan Masuk Sea:</strong> Pada tahap ngambek (Skenario 8), tombol hijau ditolak dengan alasan Keen masih ngambek, harus tekan tombol merah. Pada resolusi (Skenario 17), telepon bisa diangkat dan dialog transkrip percakapan akan dimainkan!
            </li>
            <li>
              <strong>Tombol Home Bar:</strong> Klik atau geser strip putih di bagian bawah layar iPhone kapan saja untuk kembali ke layar beranda (Home).
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
