import React, { useState, useEffect } from 'react';
import { Lock, Flashlight, Camera, Delete, ChevronUp } from 'lucide-react';
import { sound } from '../utils/audio';
import { NotificationItem } from '../types';

interface LockScreenProps {
  wallpaper: string;
  correctPasscode: string;
  onUnlocked: () => void;
  notifications: NotificationItem[];
  onNotificationClick: (notif: NotificationItem) => void;
  onQuickCamera: () => void;
  externalTrigger?: {
    type: 'unlock' | 'camera' | 'notification';
    notif?: NotificationItem;
    timestamp: number;
  } | null;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  wallpaper,
  correctPasscode,
  onUnlocked,
  notifications,
  onNotificationClick,
  onQuickCamera,
  externalTrigger,
}) => {
  const [showKeypad, setShowKeypad] = useState(false);
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [currentTime, setCurrentTime] = useState('23:20');
  const [currentDate, setCurrentDate] = useState('Rabu, 28 Oktober');
  const [pendingTarget, setPendingTarget] = useState<{
    type: 'unlock' | 'camera' | 'notification';
    notif?: NotificationItem;
  }>({ type: 'unlock' });

  useEffect(() => {
    if (externalTrigger) {
      setPendingTarget({ type: externalTrigger.type, notif: externalTrigger.notif });
      setShowKeypad(true);
    }
  }, [externalTrigger]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);

      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
      ];
      setCurrentDate(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`);
    };
    updateDateTime();
  }, []);

  const handleDigit = (digit: string) => {
    sound.playKeypadClick(digit);
    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === correctPasscode.length) {
      if (newPin === correctPasscode) {
        sound.playUnlock();
        setTimeout(() => {
          onUnlocked();
          if (pendingTarget.type === 'camera') {
            sound.playCameraShutter();
            onQuickCamera();
          } else if (pendingTarget.type === 'notification' && pendingTarget.notif) {
            onNotificationClick(pendingTarget.notif);
          }
          setPendingTarget({ type: 'unlock' });
          setPin('');
          setShowKeypad(false);
        }, 150);
      } else {
        sound.playCallEnd(); // buzz error
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setPin('');
        }, 400);
      }
    }
  };

  const handleBackspace = () => {
    sound.playKeyboardClick();
    setPin((prev) => prev.slice(0, -1));
  };

  const keypadNumbers = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
  ];

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col justify-between bg-cover bg-center overflow-hidden select-none transition-all duration-500"
      style={{ backgroundImage: `url(${wallpaper})` }}
      onClick={() => {
        if (!showKeypad) {
          sound.playTap();
          setShowKeypad(true);
        }
      }}
    >
      {/* Background subtle vignette overlay */}
      <div className="absolute inset-0 bg-black/25 backdrop-brightness-95 pointer-events-none" />

      {/* Top Header: Lock icon & Clock */}
      <div className="relative pt-12 flex flex-col items-center text-white px-6">
        <div className="flex items-center gap-1.5 opacity-80 mb-2">
          <Lock className="w-4 h-4" />
        </div>
        <p className="text-sm font-medium tracking-wide drop-shadow">{currentDate}</p>
        <h1 className="text-7xl font-extralight tracking-tight drop-shadow-md my-0 font-sans">
          {currentTime}
        </h1>
      </div>

      {/* Middle: Notifications OR Passcode Keypad */}
      <div className="relative flex-1 flex flex-col justify-center px-6">
        {showKeypad ? (
          <div
            className={`flex flex-col items-center justify-center transition-transform ${
              shake ? 'animate-shake' : ''
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white text-sm font-medium mb-1 drop-shadow">
              {pendingTarget.type === 'camera'
                ? 'Masukkan Kode Sandi untuk Kamera'
                : pendingTarget.type === 'notification'
                ? 'Masukkan Kode Sandi untuk Membuka'
                : 'Masukkan Kode Sandi'}
            </p>
            <p className="text-white/70 text-[11px] mb-4 text-center px-4 truncate max-w-[260px]">
              {pendingTarget.type === 'notification' && pendingTarget.notif
                ? pendingTarget.notif.title
                : 'Sentuh angka untuk membuka'}
            </p>

            {/* Passcode dots */}
            <div className="flex gap-4 mb-7">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-3.5 h-3.5 rounded-full border border-white transition-all duration-150 ${
                    pin.length > index ? 'bg-white scale-110' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-x-6 gap-y-4 max-w-[280px]">
              {keypadNumbers.map(({ num, letters }) => (
                <button
                  key={num}
                  onClick={() => handleDigit(num)}
                  className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md active:bg-white/40 flex flex-col items-center justify-center text-white border border-white/20 shadow-sm transition active:scale-95"
                >
                  <span className="text-2xl font-light leading-none">{num}</span>
                  {letters && <span className="text-[9px] font-medium tracking-wider opacity-80 mt-0.5">{letters}</span>}
                </button>
              ))}

              <div />
              <button
                onClick={() => handleDigit('0')}
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md active:bg-white/40 flex flex-col items-center justify-center text-white border border-white/20 shadow-sm transition active:scale-95"
              >
                <span className="text-2xl font-light leading-none">0</span>
              </button>
              {pin.length > 0 ? (
                <button
                  onClick={handleBackspace}
                  className="w-16 h-16 flex items-center justify-center text-white text-xs font-medium active:opacity-60"
                >
                  Hapus
                </button>
              ) : (
                <button
                  onClick={() => {
                    sound.playTap();
                    setPendingTarget({ type: 'unlock' });
                    setPin('');
                    setShowKeypad(false);
                  }}
                  className="w-16 h-16 flex items-center justify-center text-white text-xs font-medium active:opacity-60"
                >
                  Batal
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Lockscreen Notifications Container */
          <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto no-scrollbar py-2">
            {notifications.slice(-4).map((notif) => (
              <div
                key={notif.id}
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playTap();
                  setPendingTarget({ type: 'notification', notif });
                  setShowKeypad(true);
                }}
                className="bg-white/30 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-3 text-white shadow-lg cursor-pointer hover:bg-white/40 transition active:scale-98"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {notif.avatar ? (
                      <img
                        src={notif.avatar}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover border border-white/30"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-[10px] flex items-center justify-center font-bold">
                        {notif.title[0]}
                      </div>
                    )}
                    <span className="text-xs font-semibold">{notif.title}</span>
                  </div>
                  <span className="text-[10px] text-white/70">{notif.time}</span>
                </div>
                <p className="text-xs text-white/95 line-clamp-2 leading-relaxed">{notif.body}</p>
              </div>
            ))}

            {/* Swipe up prompt if no notifications */}
            {notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center text-white/80 animate-pulse mt-8">
                <ChevronUp className="w-5 h-5" />
                <p className="text-xs font-medium tracking-wide">Sentuh atau geser untuk membuka</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Bar: Flashlight, Swipe indicator, Camera */}
      <div className="relative pb-6 px-10 flex items-center justify-between text-white">
        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playTap();
            setFlashlightOn((prev) => !prev);
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition ${
            flashlightOn
              ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.8)]'
              : 'bg-black/30 border-white/20 text-white hover:bg-black/40'
          }`}
          title="Senter"
        >
          <Flashlight className="w-5 h-5" />
        </button>

        {!showKeypad && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playTap();
              setPendingTarget({ type: 'unlock' });
              setShowKeypad(true);
            }}
            className="text-xs font-medium text-white/80 hover:text-white px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm"
          >
            Buka Kode Sandi
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playTap();
            setPendingTarget({ type: 'camera' });
            setShowKeypad(true);
          }}
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/40 transition active:scale-95"
          title="Kamera Cepat"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* Flashlight screen effect */}
      {flashlightOn && (
        <div className="absolute inset-0 bg-white/20 pointer-events-none transition-opacity" />
      )}
    </div>
  );
};
