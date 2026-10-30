export type PovMode = 'keen' | 'sea';

export type AppId = 'x' | 'instagram' | 'line' | 'notes' | 'camera' | 'photos' | 'music' | 'phone';

export interface PostComment {
  id: string;
  author: string;
  authorHandle: string;
  avatar: string;
  text: string;
  time: string;
  likes?: number;
}

export interface XPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  image?: string;
  images?: string[];
  time: string;
  likes: string;
  reposts: string;
  replies?: XPost[];
  isReplyingTo?: string;
  isRepost?: boolean;
  repostedAuthor?: string;
  originalAuthor?: string;
  quotedPost?: XPost;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | string;
  senderName: string;
  senderAvatar?: string;
  text?: string;
  image?: string;
  time: string;
  readStatus?: 'read' | 'delivered' | 'sent';
}

export interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  isGroup?: boolean;
  unreadCount?: number;
  lastMessage?: string;
  lastTime?: string;
  messages: ChatMessage[];
}

export interface NoteItem {
  id: string;
  title: string;
  date: string;
  content: string;
}

export interface InstagramPost {
  id: string;
  author: string;
  authorAvatar: string;
  caption: string;
  image: string;
  likes: string;
  time: string;
}

export interface NotificationItem {
  id: string;
  app: 'x' | 'line' | 'instagram' | 'phone';
  title: string;
  subtitle?: string;
  body: string;
  avatar?: string;
  time: string;
  read?: boolean;
  targetApp?: AppId;
  targetChatId?: string;
  meta?: unknown;
}
