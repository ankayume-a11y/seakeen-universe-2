import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Repeat2,
  MessageCircle,
  Share,
  Bookmark,
  Sparkles,
  ArrowLeft,
  BadgeCheck,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { XPost } from '../../types';
import { VirtualKeyboard } from '../VirtualKeyboard';

interface XAppProps {
  posts: XPost[];
  currentStoryStep: number;
  userHandle: string;
  userAvatar: string;
  onPostReply?: (postId: string, text: string) => void;
  pendingReply?: {
    postId: string;
    targetText: string;
    placeholder?: string;
  } | null;
  onClose: () => void;
}

const isVerifiedXAccount = (handle?: string, author?: string): boolean => {
  if (!handle && !author) return false;
  const h = (handle || '').toLowerCase().trim();
  const a = (author || '').toLowerCase().trim();
  if (h === '@seatalay' || h === '@keenkeno') return true;
  if (h.startsWith('@seatalay') || h.startsWith('@keenkeno')) return true;
  if (h.includes('seatalay') || h.includes('keenkeno')) return true;
  if (a === 'sea' || a === 'sea talay' || a === 'keen' || a === 'keen suvijak' || a === 'keno') return true;
  return false;
};

export const XApp: React.FC<XAppProps> = ({
  posts,
  currentStoryStep,
  userHandle,
  userAvatar,
  onPostReply,
  pendingReply,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [reposts, setReposts] = useState<Record<string, boolean>>({});
  const [selectedPost, setSelectedPost] = useState<XPost | null>(null);
  const feedContainerRef = useRef<HTMLDivElement>(null);

  // Directly show the newest post at the top when entering app X or when posts update
  useEffect(() => {
    if (feedContainerRef.current) {
      feedContainerRef.current.scrollTop = 0;
    }
    const t1 = setTimeout(() => {
      if (feedContainerRef.current) {
        feedContainerRef.current.scrollTop = 0;
      }
    }, 50);
    const t2 = setTimeout(() => {
      if (feedContainerRef.current) {
        feedContainerRef.current.scrollTop = 0;
      }
    }, 150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [posts, selectedPost]);

  const toggleLike = (id: string) => {
    sound.playTap();
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRepost = (id: string) => {
    sound.playTap();
    setReposts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="absolute inset-0 z-20 bg-black text-white flex flex-col overflow-hidden select-none">
      {/* Top Header */}
      <div className="pt-11 px-4 pb-2 border-b border-neutral-800 flex items-center justify-between bg-black/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          {selectedPost ? (
            <button
              onClick={() => setSelectedPost(null)}
              className="p-1 hover:bg-neutral-800 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          ) : (
            <img
              src={userAvatar}
              alt=""
              className="w-7 h-7 rounded-full object-cover border border-neutral-700"
            />
          )}
        </div>

        {/* X Logo */}
        <div className="font-extrabold text-xl tracking-wider">𝕏</div>

        <button onClick={() => sound.playTap()} className="p-1 text-gray-400 hover:text-white">
          <Sparkles className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      {!selectedPost && (
        <div className="flex border-b border-neutral-800 text-xs font-semibold shrink-0">
          <button
            onClick={() => {
              sound.playTap();
              setActiveTab('forYou');
            }}
            className={`flex-1 py-3 text-center relative ${
              activeTab === 'forYou' ? 'text-white' : 'text-gray-500'
            }`}
          >
            Untuk Anda
            {activeTab === 'forYou' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-sky-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => {
              sound.playTap();
              setActiveTab('following');
            }}
            className={`flex-1 py-3 text-center relative ${
              activeTab === 'following' ? 'text-white' : 'text-gray-500'
            }`}
          >
            Mengikuti
            {activeTab === 'following' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-sky-500 rounded-full" />
            )}
          </button>
        </div>
      )}

      {/* Tweets Feed */}
      <div
        ref={feedContainerRef}
        className="flex-1 overflow-y-auto no-scrollbar divide-y divide-neutral-900 pb-20 scroll-smooth"
      >
        {(selectedPost ? [selectedPost] : posts).map((post) => (
          <div
            key={post.id}
            onClick={() => {
              if (!selectedPost) {
                sound.playTap();
                setSelectedPost(post);
              }
            }}
            className="p-3.5 hover:bg-neutral-950/60 transition cursor-pointer"
          >
            {/* Repost Header if any */}
            {post.isRepost && (
              <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1.5 ml-8 font-medium">
                <Repeat2 className="w-3.5 h-3.5 text-gray-400" />
                <span>{post.repostedAuthor || 'Reposted'}</span>
              </div>
            )}

            <div className="flex gap-3">
              {/* Avatar */}
              <img
                src={post.avatar}
                alt=""
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-800"
              />

              {/* Tweet Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-bold text-xs text-white truncate">{post.author}</span>
                  {isVerifiedXAccount(post.handle, post.author) && (
                    <BadgeCheck className="w-3.5 h-3.5 text-sky-400 shrink-0 inline fill-sky-400/20" />
                  )}
                  <span className="text-gray-500 text-xs truncate">{post.handle}</span>
                  <span className="text-gray-600 text-xs">·</span>
                  <span className="text-gray-500 text-xs shrink-0">{post.time}</span>
                </div>

                {post.isReplyingTo && (
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Membalas <span className="text-sky-400">{post.isReplyingTo}</span>
                  </p>
                )}

                {/* Text Body */}
                <p className="text-xs text-gray-200 mt-1.5 leading-relaxed whitespace-pre-line break-words">
                  {post.content}
                </p>

                {/* Single Image */}
                {post.image && (
                  <div className="mt-2.5 rounded-2xl overflow-hidden border border-neutral-800 max-h-72">
                    <img
                      src={post.image}
                      alt=""
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Multiple Images Grid */}
                {post.images && post.images.length > 0 && (
                  <div className="mt-2.5 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden border border-neutral-800 max-h-80">
                    {post.images.map((imgUrl, idx) => (
                      <div key={idx} className="aspect-square overflow-hidden bg-neutral-900">
                        <img
                          src={imgUrl}
                          alt=""
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Quoted / Embedded Post */}
                {post.quotedPost && (
                  <div className="mt-2.5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={post.quotedPost.avatar}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-bold text-xs text-white">{post.quotedPost.author}</span>
                      {isVerifiedXAccount(post.quotedPost.handle, post.quotedPost.author) && (
                        <BadgeCheck className="w-3 h-3 text-sky-400 inline fill-sky-400/20" />
                      )}
                      <span className="text-gray-500 text-xs">{post.quotedPost.handle}</span>
                      <span className="text-gray-600 text-xs">·</span>
                      <span className="text-gray-500 text-xs">{post.quotedPost.time}</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                      {post.quotedPost.content}
                    </p>
                    {post.quotedPost.images && post.quotedPost.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden max-h-56">
                        {post.quotedPost.images.map((img, i) => (
                          <div key={i} className="aspect-square bg-neutral-950 overflow-hidden">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-[10px] text-gray-500 pt-1.5 border-t border-neutral-800/60">
                      <span>{post.quotedPost.reposts} Repost</span>
                      <span>{post.quotedPost.likes} Suka</span>
                    </div>
                  </div>
                )}

                {/* Interactive Action Bar */}
                <div className="flex items-center justify-between text-gray-500 text-xs mt-3 pt-1 max-w-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playTap();
                      setSelectedPost(post);
                    }}
                    className="flex items-center gap-1.5 hover:text-sky-400"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-[11px]">{post.replies?.length || 18}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRepost(post.id);
                    }}
                    className={`flex items-center gap-1.5 ${
                      reposts[post.id] ? 'text-green-500' : 'hover:text-green-500'
                    }`}
                  >
                    <Repeat2 className="w-4 h-4" />
                    <span className="text-[11px]">
                      {reposts[post.id] ? '1' : post.reposts || '245'}
                    </span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(post.id);
                    }}
                    className={`flex items-center gap-1.5 ${
                      likes[post.id] ? 'text-rose-500' : 'hover:text-rose-500'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${likes[post.id] ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                    <span className="text-[11px]">
                      {likes[post.id] ? '1' : post.likes || '1.2K'}
                    </span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playTap();
                    }}
                    className="hover:text-sky-400"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playTap();
                    }}
                    className="hover:text-sky-400"
                  >
                    <Share className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Render Nested Thread Replies if present */}
            {post.replies && post.replies.length > 0 && (
              <div className="mt-3 ml-10 pl-3 border-l-2 border-neutral-800 space-y-3">
                {post.replies.map((reply) => (
                  <div key={reply.id} className="pt-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={reply.avatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover border border-neutral-700"
                      />
                      <div className="flex items-center gap-1.5 leading-tight">
                        <span className="font-bold text-xs text-white">{reply.author}</span>
                        {isVerifiedXAccount(reply.handle, reply.author) && (
                          <BadgeCheck className="w-3.5 h-3.5 text-sky-400 shrink-0 inline fill-sky-400/20" />
                        )}
                        <span className="text-gray-500 text-[11px]">{reply.handle}</span>
                      </div>
                    </div>
                    {reply.isReplyingTo && (
                      <p className="text-[10px] text-gray-500 mt-0.5 ml-9">
                        Membalas <span className="text-sky-400">{reply.isReplyingTo}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-200 mt-1 ml-9 whitespace-pre-line leading-relaxed">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Virtual Keyboard bottom bar if a story reply is pending */}
      {pendingReply && (
        <div className="shrink-0 z-30">
          <VirtualKeyboard
            targetText={pendingReply.targetText}
            placeholder={pendingReply.placeholder || 'Ketik balasan Anda...'}
            onSend={(text) => {
              if (onPostReply) {
                onPostReply(pendingReply.postId, text);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};
