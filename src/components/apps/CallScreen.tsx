import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Video,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface CallScreenProps {
  callerName: string;
  callerAvatar: string;
  isGreenDisabled?: boolean;
  disabledReason?: string;
  onReject: () => void;
  onAccept: () => void;
  isActiveCall?: boolean;
  transcriptLines?: { speaker: string; text: string }[];
  onCallFinished?: () => void;
}

export const CallScreen: React.FC<CallScreenProps> = ({
  callerName,
  callerAvatar,
  isGreenDisabled = false,
  disabledReason = 'Keen masih ngambek!',
  onReject,
  onAccept,
  isActiveCall = false,
  transcriptLines = [],
  onCallFinished,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [shakeGreen, setShakeGreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript container to bottom whenever new lines appear
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTo({
        top: transcriptContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentLineIndex]);

  // Ringtone loop when incoming
  useEffect(() => {
    if (!isActiveCall) {
      sound.startRingtone();
      return () => sound.stopRingtone();
    } else {
      sound.stopRingtone();
      const timer = setInterval(() => setCallDuration((d) => d + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isActiveCall]);

  // Advance transcript if active call
  useEffect(() => {
    if (isActiveCall && transcriptLines.length > 0) {
      if (currentLineIndex < transcriptLines.length - 1) {
        const timeout = setTimeout(() => {
          setCurrentLineIndex((prev) => prev + 1);
        }, 2800);
        return () => clearTimeout(timeout);
      } else {
        const endTimeout = setTimeout(() => {
          sound.playCallEnd();
          if (onCallFinished) onCallFinished();
        }, 3200);
        return () => clearTimeout(endTimeout);
      }
    }
  }, [isActiveCall, currentLineIndex, transcriptLines, onCallFinished]);

  const handleGreenClick = () => {
    if (isGreenDisabled) {
      sound.playTap();
      setShakeGreen(true);
      setToast(disabledReason);
      setTimeout(() => setShakeGreen(false), 500);
      setTimeout(() => setToast(null), 2500);
      return;
    }
    sound.stopRingtone();
    sound.playTap();
    onAccept();
  };

  const handleRedClick = () => {
    sound.stopRingtone();
    sound.playCallEnd();
    onReject();
  };

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#121214] text-white flex flex-col justify-between overflow-hidden select-none p-6 pb-12">
      {/* Toast Notification Alert */}
      {toast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-rose-500/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl animate-bounce">
          {toast}
        </div>
      )}

      {/* Caller Header */}
      <div className="pt-14 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <img
            src={callerAvatar}
            alt=""
            className="w-24 h-24 rounded-full object-cover border-2 border-white/20 shadow-2xl"
          />
          {!isActiveCall && (
            <span className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-60" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight">{callerName}</h2>
        <p className="text-xs text-gray-400 mt-1 font-medium">
          {isActiveCall ? formatCallTime(callDuration) : 'Panggilan Suara LINE...'}
        </p>
      </div>

      {/* Middle: Transcript dialog if in active call */}
      {isActiveCall && transcriptLines.length > 0 ? (
        <div className="flex-1 my-4 flex flex-col justify-center px-4 overflow-y-auto no-scrollbar">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-[11px] text-pink-300 font-semibold uppercase tracking-wider border-b border-white/10 pb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transkrip Percakapan Nyata</span>
            </div>

            <div
              ref={transcriptContainerRef}
              className="space-y-2.5 max-h-[220px] overflow-y-auto no-scrollbar pr-1 scroll-smooth"
            >
              {transcriptLines.slice(0, currentLineIndex + 1).map((line, idx) => {
                const isKeen = line.speaker.includes('Keen') || line.speaker.includes('Keno');
                const avatarUrl = isKeen
                  ? 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg'
                  : 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg';
                return (
                  <div
                    key={idx}
                    className={`text-xs leading-relaxed animate-fade-in flex items-start gap-2 ${
                      isKeen ? 'text-sky-300 font-medium' : 'text-amber-200'
                    }`}
                  >
                    <img
                      src={avatarUrl}
                      alt={line.speaker}
                      className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5 border border-white/20 shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold mr-1.5 opacity-90">{line.speaker}:</span>
                      <span>{line.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {currentLineIndex < transcriptLines.length - 1 && (
              <p className="text-[10px] text-gray-400 italic text-center animate-pulse pt-1">
                (Percakapan sedang berlangsung...)
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Bottom Controls */}
      {isActiveCall ? (
        /* In-Call Controls */
        <div className="flex flex-col items-center gap-6">
          <div className="grid grid-cols-3 gap-6 text-xs text-gray-300">
            <button
              onClick={() => {
                sound.playTap();
                setIsMuted((prev) => !prev);
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-full ${
                isMuted ? 'bg-white text-black' : 'bg-white/15'
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              <span className="text-[10px]">Bisu</span>
            </button>

            <button
              onClick={() => sound.playTap()}
              className="flex flex-col items-center gap-2 p-3 rounded-full bg-white/15"
            >
              <Video className="w-6 h-6" />
              <span className="text-[10px]">Video</span>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setIsSpeaker((prev) => !prev);
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-full ${
                isSpeaker ? 'bg-white text-black' : 'bg-white/15'
              }`}
            >
              <Volume2 className="w-6 h-6" />
              <span className="text-[10px]">Speaker</span>
            </button>
          </div>

          {/* End Call Button */}
          <button
            onClick={handleRedClick}
            className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-95 flex items-center justify-center text-white shadow-xl transition"
            title="Akhiri Panggilan"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>
      ) : (
        /* Incoming Call Controls (Green Accept & Red Reject) */
        <div className="flex items-center justify-around px-8">
          {/* Red Reject Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleRedClick}
              className="w-18 h-18 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-95 flex items-center justify-center text-white shadow-xl transition"
              title="Tolak Panggilan"
            >
              <PhoneOff className="w-8 h-8" />
            </button>
            <span className="text-xs font-medium text-gray-300">Tolak</span>
          </div>

          {/* Green Accept Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleGreenClick}
              className={`w-18 h-18 rounded-full flex items-center justify-center text-white shadow-xl transition ${
                shakeGreen ? 'animate-shake' : ''
              } ${
                isGreenDisabled
                  ? 'bg-green-700/50 opacity-60 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 active:scale-95'
              }`}
              title={isGreenDisabled ? disabledReason : 'Terima Panggilan'}
            >
              <Phone className="w-8 h-8" />
            </button>
            <span className="text-xs font-medium text-gray-300">
              {isGreenDisabled ? 'Ngambek' : 'Terima'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
