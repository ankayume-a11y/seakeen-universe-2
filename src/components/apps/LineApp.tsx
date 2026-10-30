import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Phone,
  Video,
  Search,
  MoreVertical,
  Image as ImageIcon,
  Smile,
  Mic,
  CheckCheck,
  X as CloseIcon,
  Maximize2,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { ChatMessage, ChatThread } from '../../types';
import { VirtualKeyboard } from '../VirtualKeyboard';

interface LineAppProps {
  threads: ChatThread[];
  activeChatId?: string;
  onSelectChat: (id: string) => void;
  onBackToList: () => void;
  pendingReply?: {
    chatId: string;
    targetText: string;
    placeholder?: string;
  } | null;
  onSendMessage: (chatId: string, text: string) => void;
  isOtherTyping?: boolean;
  typingSenderName?: string;
  onStartCall?: (chatId: string) => void;
  onClose: () => void;
}

export const LineApp: React.FC<LineAppProps> = ({
  threads,
  activeChatId,
  onSelectChat,
  onBackToList,
  pendingReply,
  onSendMessage,
  isOtherTyping = false,
  typingSenderName = '',
  onStartCall,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find((t) => t.id === activeChatId);

  // Smooth & immediate scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end',
      });
    }
  }, []);

  // Auto scroll to bottom when messages, typing status, pendingReply, or active chat changes
  useEffect(() => {
    scrollToBottom(true);
    const t1 = setTimeout(() => scrollToBottom(false), 50);
    const t2 = setTimeout(() => scrollToBottom(true), 150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeThread?.messages, isOtherTyping, pendingReply, activeChatId, scrollToBottom]);

  // Keep pinned to bottom whenever container resizes (e.g., keyboard mounts or shifts layout)
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      scrollToBottom(false);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeChatId, scrollToBottom]);

  const filteredThreads = threads.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="absolute inset-0 z-20 bg-[#f4f4f7] dark:bg-[#121212] text-gray-900 dark:text-white flex flex-col overflow-hidden select-none">
      {/* If Chat List View */}
      {!activeThread ? (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="pt-11 px-4 pb-3 bg-[#06c755] text-white flex items-center justify-between shadow-sm shrink-0">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Obrolan</h1>
              <p className="text-[11px] opacity-90">LINE Messenger</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => sound.playTap()} className="p-1 hover:opacity-80">
                <Search className="w-5 h-5" />
              </button>
              <button onClick={() => sound.playTap()} className="p-1 hover:opacity-80">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-3 py-2 bg-white dark:bg-[#1a1a1c] border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-neutral-800 rounded-full text-xs text-gray-500">
              <Search className="w-4 h-4" />
              <input
                type="text"
                placeholder="Cari obrolan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Thread List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-neutral-800 bg-white dark:bg-[#18181a]">
            {filteredThreads.map((thread) => {
              const lastMsg = thread.messages[thread.messages.length - 1];
              const lastText = lastMsg?.text || (lastMsg?.image ? '📷 [Foto]' : 'Belum ada pesan');
              const lastTime = lastMsg?.time || 'Kemarin';

              return (
                <div
                  key={thread.id}
                  onClick={() => {
                    sound.playTap();
                    onSelectChat(thread.id);
                  }}
                  className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-neutral-800/50 cursor-pointer transition"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {thread.avatar ? (
                      <img
                        src={thread.avatar}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-neutral-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold text-sm">
                        {thread.name[0]}
                      </div>
                    )}
                    {thread.unreadCount && thread.unreadCount > 0 ? (
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow">
                        {thread.unreadCount}
                      </span>
                    ) : null}
                  </div>

                  {/* Thread details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-semibold text-xs truncate text-gray-900 dark:text-white">
                        {thread.name}
                      </p>
                      <span className="text-[10px] text-gray-400 shrink-0">{lastTime}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      {lastMsg?.sender === 'me' ? 'Anda: ' : ''}
                      {lastText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Inside Active Chat Room View */
        <div className="flex flex-col h-full bg-[#8cabd9]/20 dark:bg-[#0c0d10]">
          {/* Chat Room Top Bar */}
          <div className="pt-11 px-3 pb-2.5 bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playTap();
                  onBackToList();
                }}
                className="p-1 -ml-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              {activeThread.avatar ? (
                <img
                  src={activeThread.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-xs font-bold text-white">
                  {activeThread.name[0]}
                </div>
              )}
              <div className="leading-tight">
                <p className="font-bold text-xs truncate max-w-[150px]">{activeThread.name}</p>
                <p className="text-[10px] text-green-600 dark:text-green-400 font-medium">
                  {isOtherTyping ? 'sedang mengetik...' : 'online'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <button
                onClick={() => {
                  if (onStartCall) onStartCall(activeThread.id);
                }}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full"
                title="Panggilan Suara"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button onClick={() => sound.playTap()} className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full">
                <Video className="w-4 h-4" />
              </button>
              <button onClick={() => sound.playTap()} className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-3 py-3 space-y-3 no-scrollbar scroll-smooth"
          >
            {activeThread.messages.map((msg, index) => {
              const isMe = msg.sender === 'me';
              const prevMsg = activeThread.messages[index - 1];
              const showTimeDivider = msg.time && (!prevMsg || prevMsg.time !== msg.time);

              return (
                <React.Fragment key={msg.id}>
                  {showTimeDivider && (
                    <div className="flex justify-center my-2 select-none">
                      <span className="px-3 py-0.5 rounded-full bg-black/15 dark:bg-white/10 text-[10px] font-semibold text-gray-600 dark:text-gray-300 backdrop-blur-xs shadow-xs">
                        {msg.time.startsWith('[') ? msg.time : `[${msg.time}]`}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-full`}
                  >
                    {/* Sender Name in group */}
                    {!isMe && activeThread.isGroup && (
                      <div className="flex items-center gap-1.5 mb-1 ml-9">
                        <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                          {msg.senderName}
                        </span>
                      </div>
                    )}

                    <div className={`flex items-end gap-1.5 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar for others */}
                      {!isMe && (
                        (msg.senderAvatar || activeThread.avatar) ? (
                          <img
                            src={msg.senderAvatar || activeThread.avatar}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover shrink-0 mb-1 border border-gray-300 dark:border-neutral-700"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0 mb-1 border border-gray-300 dark:border-neutral-700">
                            {msg.senderName?.[0] || activeThread.name[0]}
                          </div>
                        )
                      )}

                      {/* Avatar for user (Keen) */}
                      {isMe && msg.senderAvatar && (
                        <img
                          src={msg.senderAvatar}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover shrink-0 mb-1 border border-emerald-500/40"
                        />
                      )}

                      {/* Bubble */}
                      <div
                        className={`rounded-2xl text-xs shadow-sm break-words ${
                          isMe
                            ? 'bg-[#06c755] text-white rounded-br-xs font-normal'
                            : 'bg-white dark:bg-[#252528] text-gray-900 dark:text-white rounded-bl-xs'
                        } ${msg.image && !msg.text ? 'p-1' : 'px-3.5 py-2'}`}
                      >
                        {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}

                        {msg.image && (
                          <div
                            className={`${msg.text ? 'mt-2' : ''} relative group cursor-pointer overflow-hidden rounded-xl bg-black/5 dark:bg-black/20`}
                            onClick={() => {
                              sound.playTap();
                              setPreviewImage(msg.image || null);
                            }}
                          >
                            <img
                              src={msg.image}
                              alt="Foto terkirim"
                              className="w-auto max-w-[240px] sm:max-w-[260px] h-auto object-contain block mx-auto rounded-xl hover:opacity-95 transition-opacity"
                              loading="lazy"
                              onLoad={() => scrollToBottom(false)}
                            />
                            <div className="absolute bottom-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white p-1 rounded-md opacity-80 group-hover:opacity-100 transition shadow backdrop-blur-xs flex items-center gap-1 text-[10px]">
                              <Maximize2 className="w-3 h-3" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Time & Read Status */}
                      <div className="flex flex-col text-[9px] text-gray-400 shrink-0 self-end mb-0.5 leading-tight">
                        {isMe && (
                          <span className="text-sky-500 font-semibold flex items-center gap-0.5">
                            Dibaca
                            <CheckCheck className="w-3 h-3 inline" />
                          </span>
                        )}
                        <span>{msg.time ? msg.time.replace(/[\[\]]/g, '') : ''}</span>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            {/* Typing Indicator Bubble */}
            {isOtherTyping && (
              <div className="flex items-end gap-2 text-xs">
                {activeThread.avatar && (
                  <img
                    src={activeThread.avatar}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                )}
                <div className="bg-white dark:bg-[#252528] px-3.5 py-2.5 rounded-2xl rounded-bl-xs shadow-sm flex items-center gap-1.5">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                    {typingSenderName || activeThread.name} sedang mengetik
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Bottom Keyboard Area */}
          {pendingReply && pendingReply.chatId === activeThread.id ? (
            <div className="shrink-0 z-30">
              <VirtualKeyboard
                targetText={pendingReply.targetText}
                placeholder={pendingReply.placeholder || 'Ketik balasan Anda...'}
                onSend={(text) => {
                  onSendMessage(activeThread.id, text);
                  setTimeout(() => scrollToBottom(true), 60);
                }}
              />
            </div>
          ) : (
            /* Idle bottom action bar if no reply is currently required */
            <div className="px-3 py-2 bg-white dark:bg-[#1c1c1e] border-t border-gray-200 dark:border-neutral-800 flex items-center gap-2 text-gray-500 shrink-0">
              <button onClick={() => sound.playTap()} className="p-1 hover:text-green-500">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button onClick={() => sound.playTap()} className="p-1 hover:text-green-500">
                <Smile className="w-5 h-5" />
              </button>
              <div className="flex-1 px-3 py-1.5 bg-gray-100 dark:bg-neutral-800 rounded-full text-xs text-gray-400 italic">
                Menunggu pesan masuk...
              </div>
              <button onClick={() => sound.playTap()} className="p-1 hover:text-green-500">
                <Mic className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3"
          onClick={() => setPreviewImage(null)}
        >
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playTap();
                setPreviewImage(null);
              }}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition shadow-lg backdrop-blur-md"
              aria-label="Tutup"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <div
            className="relative flex items-center justify-center max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Pratinjau foto penuh"
              className="max-w-[94vw] max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl transition-all"
            />
          </div>
          <p className="mt-3 text-xs text-neutral-300 font-medium select-none">
            Ketuk di mana saja untuk menutup
          </p>
        </div>
      )}
    </div>
  );
};
