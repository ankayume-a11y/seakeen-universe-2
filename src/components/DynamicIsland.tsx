import React, { useState } from 'react';
import { Music, Phone, Volume2, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { NotificationItem } from '../types';

interface DynamicIslandProps {
  isCalling?: boolean;
  callerName?: string;
  isMusicPlaying?: boolean;
  musicTitle?: string;
  notification?: NotificationItem | null;
  onIslandClick?: () => void;
  onNotificationClick?: (notif: NotificationItem) => void;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  isCalling = false,
  callerName = '',
  isMusicPlaying = false,
  musicTitle = '',
  notification = null,
  onIslandClick,
  onNotificationClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    sound.playTap();
    if (notification && onNotificationClick) {
      onNotificationClick(notification);
      return;
    }
    setIsExpanded((prev) => !prev);
    if (onIslandClick) onIslandClick();
  };

  // Determine state
  const hasCall = isCalling;
  const hasMusic = isMusicPlaying;
  const hasNotif = !!notification;

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <div
        onClick={handleClick}
        className={`bg-black text-white rounded-full flex items-center justify-between transition-all duration-300 ease-spring shadow-lg cursor-pointer ${
          isExpanded || hasNotif
            ? 'w-72 px-4 py-2.5 rounded-3xl'
            : hasCall
            ? 'w-48 px-3.5 py-1.5'
            : hasMusic
            ? 'w-44 px-3 py-1'
            : 'w-28 h-7 px-2'
        }`}
      >
        {/* If notification active in island */}
        {hasNotif && !hasCall && (
          <div className="flex items-center gap-2 w-full text-xs animate-fade-in group">
            {notification.avatar ? (
              <img
                src={notification.avatar}
                alt=""
                className="w-5 h-5 rounded-full object-cover border border-white/20 shrink-0"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            )}
            <div className="truncate flex-1">
              <p className="font-semibold text-white leading-tight truncate">{notification.title}</p>
              <p className="text-[11px] text-gray-300 leading-tight truncate">{notification.body}</p>
            </div>
            <span className="text-[10px] text-blue-400 group-hover:underline shrink-0 font-medium">Buka</span>
          </div>
        )}

        {/* If call active */}
        {hasCall && (
          <div className="flex items-center justify-between w-full text-xs">
            <div className="flex items-center gap-1.5 text-green-400">
              <Phone className="w-3.5 h-3.5 animate-bounce" />
              <span className="font-medium text-white truncate max-w-[90px]">{callerName || 'Panggilan'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="w-1.5 h-4 bg-green-500 rounded-full animate-pulse delay-75" />
              <span className="w-1.5 h-2 bg-green-500 rounded-full animate-pulse delay-150" />
            </div>
          </div>
        )}

        {/* If music playing */}
        {!hasCall && !hasNotif && hasMusic && (
          <div className="flex items-center justify-between w-full text-xs">
            <div className="flex items-center gap-1.5 text-pink-400">
              <Music className="w-3 h-3" />
              <span className="text-[11px] text-gray-200 truncate max-w-[80px]">{musicTitle || 'Playing'}</span>
            </div>
            {/* Equalizer Wave */}
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-1 bg-pink-500 rounded-full animate-[ping_1s_infinite] h-2" />
              <span className="w-1 bg-pink-500 rounded-full animate-[pulse_0.8s_infinite] h-3" />
              <span className="w-1 bg-pink-500 rounded-full animate-[ping_1.2s_infinite] h-2.5" />
            </div>
          </div>
        )}

        {/* Idle default island */}
        {!hasCall && !hasNotif && !hasMusic && (
          <div className="flex items-center justify-between w-full h-full">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-gray-900 ml-1 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-blue-900/60" />
            </div>
            <div className="w-2 h-2 rounded-full bg-orange-500/20 mr-1" />
          </div>
        )}
      </div>
    </div>
  );
};
