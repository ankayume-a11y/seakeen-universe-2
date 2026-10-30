import React, { useState } from 'react';
import {
  Grid,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  Home,
  Search,
  PlusSquare,
  Film,
  User,
  ChevronDown,
  Menu,
  Bell,
  X,
  BadgeCheck,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { InstagramPost } from '../../types';

interface InstagramAppProps {
  profile: {
    username: string;
    name: string;
    bio: string;
    followers: string;
    following: string;
    avatar: string;
    photos: string[];
  };
  feedPosts: InstagramPost[];
  onClose: () => void;
}

export const InstagramApp: React.FC<InstagramAppProps> = ({
  profile,
  feedPosts,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'feed'>('profile');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [likedFeed, setLikedFeed] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    sound.playTap();
    setLikedFeed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const highlights = [
    { title: 'Series 🎬', img: profile.photos[0] },
    { title: 'Trip ✈️', img: profile.photos[1] },
    { title: 'Music 🎸', img: profile.photos[2] },
    { title: 'My 🤍', img: profile.photos[3] },
    { title: 'Shooting 📸', img: profile.photos[4] },
  ];

  return (
    <div className="absolute inset-0 z-20 bg-black text-white flex flex-col overflow-hidden select-none">
      {/* Top Bar */}
      <div className="pt-11 px-4 pb-2 border-b border-neutral-800 flex items-center justify-between bg-black/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight">
          <span>{profile.username}</span>
          <BadgeCheck className="w-4 h-4 text-sky-400 fill-sky-400/20 shrink-0" />
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-4 text-white">
          <button onClick={() => sound.playTap()} className="hover:opacity-75">
            <PlusSquare className="w-5 h-5" />
          </button>
          <button onClick={() => sound.playTap()} className="hover:opacity-75">
            <Heart className="w-5 h-5" />
          </button>
          <button onClick={() => sound.playTap()} className="hover:opacity-75">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'profile' ? (
          <div>
            {/* Profile Info Header */}
            <div className="px-4 pt-3 pb-2">
              <div className="flex items-center justify-between mb-3">
                {/* Avatar with story ring */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full rounded-full object-cover border-2 border-black"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 flex justify-around ml-4 text-center">
                  <div>
                    <p className="font-bold text-base leading-tight">{profile.photos.length}</p>
                    <p className="text-xs text-gray-400">Postingan</p>
                  </div>
                  <div>
                    <p className="font-bold text-base leading-tight">{profile.followers}</p>
                    <p className="text-xs text-gray-400">Pengikut</p>
                  </div>
                  <div>
                    <p className="font-bold text-base leading-tight">{profile.following}</p>
                    <p className="text-xs text-gray-400">Mengikuti</p>
                  </div>
                </div>
              </div>

              {/* Name & Bio */}
              <div className="text-xs">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="font-bold text-white text-sm">{profile.name}</p>
                  <BadgeCheck className="w-4 h-4 text-sky-400 fill-sky-400/20 shrink-0" />
                </div>
                <p className="text-gray-400 font-medium">{profile.bio}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={() => sound.playTap()}
                  className="py-1.5 rounded-lg bg-neutral-800 text-xs font-semibold hover:bg-neutral-700 active:scale-98 transition text-center"
                >
                  Edit profil
                </button>
                <button
                  onClick={() => sound.playTap()}
                  className="py-1.5 rounded-lg bg-neutral-800 text-xs font-semibold hover:bg-neutral-700 active:scale-98 transition text-center"
                >
                  Bagikan profil
                </button>
              </div>

              {/* Story Highlights */}
              <div className="flex gap-4 mt-4 overflow-x-auto no-scrollbar pb-1">
                {highlights.map((h, i) => (
                  <div
                    key={i}
                    onClick={() => sound.playTap()}
                    className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-full p-[1px] border border-neutral-700 bg-neutral-900">
                      <img src={h.img} alt="" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <span className="text-[10px] text-gray-300 truncate max-w-[60px]">{h.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid Tabs */}
            <div className="border-t border-neutral-800 flex items-center justify-around mt-2">
              <button className="py-2.5 flex-1 flex justify-center border-b-2 border-white text-white">
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => sound.playTap()}
                className="py-2.5 flex-1 flex justify-center text-gray-500 hover:text-white"
              >
                <Film className="w-5 h-5" />
              </button>
              <button
                onClick={() => sound.playTap()}
                className="py-2.5 flex-1 flex justify-center text-gray-500 hover:text-white"
              >
                <User className="w-5 h-5" />
              </button>
            </div>

            {/* 3-Column Photo Grid */}
            <div className="grid grid-cols-3 gap-0.5 pb-16">
              {profile.photos.map((url, index) => (
                <div
                  key={index}
                  onClick={() => {
                    sound.playTap();
                    setSelectedPhoto(url);
                  }}
                  className="aspect-square bg-neutral-900 relative group cursor-pointer overflow-hidden"
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Home Feed Tab */
          <div className="divide-y divide-neutral-900 pb-16">
            {feedPosts.map((post) => (
              <div key={post.id} className="py-2">
                {/* Post Author */}
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.authorAvatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-neutral-800"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="font-semibold text-xs leading-none">{post.author}</p>
                        <BadgeCheck className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20 shrink-0" />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">{post.time}</p>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>

                {/* Post Image */}
                <div
                  className="aspect-square w-full bg-neutral-900 overflow-hidden cursor-pointer"
                  onClick={() => toggleLike(post.id)}
                >
                  <img src={post.image} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Actions */}
                <div className="px-3 pt-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-4">
                      <button onClick={() => toggleLike(post.id)}>
                        <Heart
                          className={`w-6 h-6 transition-transform active:scale-125 ${
                            likedFeed[post.id] ? 'fill-red-500 text-red-500' : 'text-white'
                          }`}
                        />
                      </button>
                      <button onClick={() => sound.playTap()}>
                        <MessageCircle className="w-6 h-6 text-white" />
                      </button>
                      <button onClick={() => sound.playTap()}>
                        <Share2 className="w-6 h-6 text-white" />
                      </button>
                    </div>
                    <button onClick={() => sound.playTap()}>
                      <Bookmark className="w-6 h-6 text-white" />
                    </button>
                  </div>

                  <p className="font-bold text-xs mb-1">{post.likes}</p>
                  <p className="text-xs leading-relaxed">
                    <span className="font-bold mr-1.5 inline-flex items-center gap-1">
                      <span>{post.author}</span>
                      <BadgeCheck className="w-3 h-3 text-sky-400 fill-sky-400/20 shrink-0" />
                    </span>
                    <span>{post.caption}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Photo Modal */}
      {selectedPhoto && (
        <div
          className="absolute inset-0 z-50 bg-black/95 flex flex-col justify-center items-center p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-12 right-4 p-2 text-white bg-neutral-800 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={selectedPhoto}
            alt=""
            className="max-h-[75%] max-w-full rounded-xl object-contain shadow-2xl"
          />
          <div className="mt-4 flex items-center gap-6 text-white">
            <button onClick={(e) => { e.stopPropagation(); sound.playTap(); }} className="flex items-center gap-1.5 text-xs">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <span>Suka</span>
            </button>
            <button onClick={(e) => { e.stopPropagation(); sound.playTap(); }} className="flex items-center gap-1.5 text-xs">
              <MessageCircle className="w-5 h-5" />
              <span>Komentar</span>
            </button>
            <button onClick={(e) => { e.stopPropagation(); sound.playTap(); }} className="flex items-center gap-1.5 text-xs">
              <Share2 className="w-5 h-5" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>
      )}

      {/* Instagram Bottom Nav Bar */}
      <div className="border-t border-neutral-900 bg-black/95 backdrop-blur-md px-6 py-2.5 flex items-center justify-between text-white shrink-0 z-10">
        <button
          onClick={() => {
            sound.playTap();
            setActiveTab('feed');
          }}
          className={`p-1 ${activeTab === 'feed' ? 'text-white' : 'text-gray-500'}`}
        >
          <Home className="w-6 h-6" />
        </button>
        <button onClick={() => sound.playTap()} className="p-1 text-gray-500">
          <Search className="w-6 h-6" />
        </button>
        <button onClick={() => sound.playTap()} className="p-1 text-gray-500">
          <PlusSquare className="w-6 h-6" />
        </button>
        <button onClick={() => sound.playTap()} className="p-1 text-gray-500">
          <Film className="w-6 h-6" />
        </button>
        <button
          onClick={() => {
            sound.playTap();
            setActiveTab('profile');
          }}
          className={`p-1 rounded-full ${
            activeTab === 'profile' ? 'ring-2 ring-white' : 'opacity-70'
          }`}
        >
          <img src={profile.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
        </button>
      </div>
    </div>
  );
};
