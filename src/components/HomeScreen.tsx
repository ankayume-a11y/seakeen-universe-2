import React from 'react';
import {
  MessageCircle,
  Camera,
  Image as ImageIcon,
  Music,
  FileText,
  Phone,
  Compass,
  Settings,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { AppId } from '../types';

interface HomeScreenProps {
  wallpaper: string;
  onOpenApp: (appId: AppId) => void;
  unreadCounts: {
    x?: number;
    line?: number;
    instagram?: number;
  };
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  wallpaper,
  onOpenApp,
  unreadCounts,
}) => {
  const apps = [
    {
      id: 'x' as AppId,
      name: 'X',
      icon: (
        <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md">
          𝕏
        </div>
      ),
      badge: unreadCounts.x,
    },
    {
      id: 'instagram' as AppId,
      name: 'Instagram',
      icon: (
        <div className="w-full h-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-md">
          <div className="w-6 h-6 border-2 border-white rounded-lg flex items-center justify-center relative">
            <div className="w-2.5 h-2.5 border-2 border-white rounded-full" />
            <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 right-0.5" />
          </div>
        </div>
      ),
      badge: unreadCounts.instagram,
    },
    {
      id: 'line' as AppId,
      name: 'LINE',
      icon: (
        <div className="w-full h-full bg-[#06c755] rounded-2xl flex items-center justify-center text-white shadow-md">
          <MessageCircle className="w-7 h-7 fill-white stroke-none" />
        </div>
      ),
      badge: unreadCounts.line,
    },
    {
      id: 'notes' as AppId,
      name: 'Catatan',
      icon: (
        <div className="w-full h-full bg-amber-100 dark:bg-amber-200 text-amber-900 rounded-2xl flex flex-col justify-between p-2 shadow-md border border-amber-300">
          <div className="w-4 h-1 bg-amber-400 rounded-full" />
          <FileText className="w-6 h-6 self-center text-amber-800" />
          <div className="w-full h-1 bg-amber-300 rounded-full" />
        </div>
      ),
    },
    {
      id: 'photos' as AppId,
      name: 'Foto',
      icon: (
        <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-white shadow-md p-2">
          <div className="w-full h-full rounded-xl bg-gradient-to-tr from-sky-400 via-pink-400 to-amber-300 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-white drop-shadow" />
          </div>
        </div>
      ),
    },
    {
      id: 'camera' as AppId,
      name: 'Kamera',
      icon: (
        <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center text-white shadow-md">
          <Camera className="w-7 h-7 text-gray-200" />
        </div>
      ),
    },
    {
      id: 'music' as AppId,
      name: 'Musik',
      icon: (
        <div className="w-full h-full bg-gradient-to-tr from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-md">
          <Music className="w-7 h-7 text-white fill-white" />
        </div>
      ),
    },
    {
      id: 'phone' as AppId,
      name: 'Telepon',
      icon: (
        <div className="w-full h-full bg-[#34c759] rounded-2xl flex items-center justify-center text-white shadow-md">
          <Phone className="w-7 h-7 fill-white stroke-none" />
        </div>
      ),
    },
  ];

  return (
    <div
      className="absolute inset-0 z-10 bg-cover bg-center flex flex-col justify-between p-5 pt-14 pb-8 select-none overflow-hidden"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      {/* Subtle backdrop overlay */}
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />

      {/* Top iOS Widgets */}
      <div className="relative z-10 grid grid-cols-2 gap-3 mb-2">
        {/* Widget 1: Clock / Date */}
        <div
          onClick={() => sound.playTap()}
          className="bg-white/30 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-3.5 text-white shadow-lg cursor-pointer hover:bg-white/40 transition"
        >
          <div className="flex items-center gap-1.5 text-amber-300 mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Jakarta</span>
          </div>
          <p className="text-2xl font-bold tracking-tight">23:20</p>
          <p className="text-[11px] text-white/80 mt-1 font-medium">Rabu, 28 Okt</p>
        </div>

        {/* Widget 2: Love / Story Widget */}
        <div
          onClick={() => sound.playTap()}
          className="bg-white/30 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-3.5 text-white shadow-lg cursor-pointer hover:bg-white/40 transition flex flex-col justify-between"
        >
          <div className="flex items-center gap-1.5 text-pink-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">SeaKeen Universe</span>
          </div>
          <p className="text-xs font-semibold leading-tight line-clamp-2">
            "Berapa kali di buat sayang : ♾️ kali"
          </p>
          <div className="flex items-center gap-1 text-[10px] text-pink-200">
            <span>Special Universe 🦦🦐</span>
          </div>
        </div>
      </div>

      {/* Main Apps Grid */}
      <div className="relative z-10 grid grid-cols-4 gap-y-4 gap-x-3 px-1 my-auto">
        {apps.map((app) => (
          <div
            key={app.id}
            onClick={() => {
              sound.playTap();
              onOpenApp(app.id);
            }}
            className="flex flex-col items-center gap-1 cursor-pointer group active:scale-95 transition"
          >
            <div className="relative w-14 h-14 rounded-2xl group-hover:scale-105 transition-transform duration-200">
              {app.icon}
              {app.badge && app.badge > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-[20px] text-center shadow-lg ring-2 ring-white/50 animate-pulse">
                  {app.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[11px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-center tracking-tight truncate max-w-[64px]">
              {app.name}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Floating iOS Dock */}
      <div className="relative z-10 bg-white/35 dark:bg-white/20 backdrop-blur-2xl border border-white/25 rounded-[30px] p-2.5 px-3 flex items-center justify-around shadow-2xl">
        {[apps[7], apps[2], apps[0], apps[1]].map((app) => (
          <div
            key={app.id}
            onClick={() => {
              sound.playTap();
              onOpenApp(app.id);
            }}
            className="relative w-13 h-13 rounded-2xl cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200"
          >
            {app.icon}
            {app.badge && app.badge > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-md ring-2 ring-white/50">
                {app.badge}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
