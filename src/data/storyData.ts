import { ChatMessage, NotificationItem, XPost } from '../types';

export interface StoryState {
  pov: 'keen' | 'sea';
  step: number;
  totalSteps: number;
  unlocked: boolean;
  freeMode: boolean;
}

// Keen Story Notifications
export const KEEN_STEP1_NOTIFS: NotificationItem[] = [
  {
    id: 'notif-x-1',
    app: 'x',
    targetApp: 'x',
    title: 'X · @seakeen_dailyy',
    subtitle: 'seakeen_dailyy mentweet',
    body: 'Gue rasa akun ini udah mau berubah jadi museum sejarah deh 😭💔 Sepi banget...',
    avatar: 'https://i.pinimg.com/736x/2e/19/26/2e19264427d3d4d5f737f4723eb80503.jpg',
    time: 'Baru saja',
  },
  {
    id: 'notif-x-2',
    app: 'x',
    targetApp: 'x',
    title: 'X · @oceanfor_keen',
    subtitle: 'oceanfor_keen mentweet',
    body: 'Lagi scroll galeri terus ketemu foto pas behind the scenes series kemarin... 🥺✨',
    avatar: 'https://i.pinimg.com/736x/d9/b6/9d/d9b69dab2bca9cdfd082ac57e997135d.jpg',
    time: '1m yang lalu',
  },
  {
    id: 'notif-x-3',
    app: 'x',
    targetApp: 'x',
    title: 'X · @seakeenlover_',
    subtitle: 'seakeenlover_ mentweet',
    body: 'Ada yang merasa TL-nya sepi banget juga ga sih belakangan ini? 🙋🏻‍♀️ KANGEN SEAKEEN BGT!',
    avatar: 'https://i.pinimg.com/736x/d0/28/c2/d028c2f07329c62110e8447216509958.jpg',
    time: '2m yang lalu',
  },
  {
    id: 'notif-x-4',
    app: 'x',
    targetApp: 'x',
    title: 'X · @sk_delusional',
    subtitle: 'sk_delusional mentweet',
    body: 'Dah lah... hari ke-5 tanpa hilal kebersamaan SeaKeen. Jiwa shipper-ku mulai layu 🥀😭',
    avatar: 'https://i.pinimg.com/736x/5d/42/e8/5d42e81d4678802413cc3c351a013318.jpg',
    time: '3m yang lalu',
  },
  {
    id: 'notif-x-5',
    app: 'x',
    targetApp: 'x',
    title: 'X · @seakeen_orbit',
    subtitle: 'seakeen_orbit mentweet',
    body: 'Me waiting for SeaKeen new interaction be like... 💀⏳ Ya Tuhan cuma minta foto bareng...',
    avatar: 'https://i.pinimg.com/736x/63/7c/c2/637cc2a74c919e69911362ece9741303.jpg',
    time: '5m yang lalu',
  },
];

export const KEEN_STEP1_POSTS: XPost[] = [
  {
    id: 'post-1',
    author: 'SeaKeen Daily 🌊🦐',
    handle: '@seakeen_dailyy',
    avatar: 'https://i.pinimg.com/736x/2e/19/26/2e19264427d3d4d5f737f4723eb80503.jpg',
    content: `Gue rasa akun ini udah mau berubah jadi museum sejarah deh 😭💔 Sepi banget nggak ada asupan SeaKeen beberapa hari ini, tolong dong minimal story/reply-an satu dua biji aja biar gak gila gue kangennyaaaa AAAAHHH 🤏🏻\n@seatalay @keenkeno`,
    time: '2j',
    likes: '1.2K',
    reposts: '438',
  },
  {
    id: 'post-2',
    author: 'Ocean for Keen 🌊',
    handle: '@oceanfor_keen',
    avatar: 'https://i.pinimg.com/736x/d9/b6/9d/d9b69dab2bca9cdfd082ac57e997135d.jpg',
    content: `Lagi scroll galeri terus ketemu foto pas behind the scenes series kemarin... Kangen bgt sama vibes mereka berdua pas lagi bareng 🥺✨ Sekarang jadwalnya pada terpisah mulu. Drop foto selfie bareng satu aja dong kalian @seatalay @keenkeno 🙏🏻`,
    image: 'https://i.pinimg.com/736x/86/a9/9c/86a99c80bc431299702dacb1a697d031.jpg',
    time: '3j',
    likes: '2.5K',
    reposts: '890',
  },
  {
    id: 'post-3',
    author: 'SeaKeen Lover',
    handle: '@seakeenlover_',
    avatar: 'https://i.pinimg.com/736x/d0/28/c2/d028c2f07329c62110e8447216509958.jpg',
    content: `Ada yang merasa TL-nya sepi banget juga ga sih belakangan ini? 🙋🏻‍♀️ Mau ngeluh tapi takut dibilang lebay, tapi beneran KANGEN SEAKEEN BGT BGT BGT. Mana nih teman-teman yang lagi sama-sama kehausan momen mereka?!\n@seatalay @keenkeno`,
    time: '4j',
    likes: '980',
    reposts: '312',
  },
  {
    id: 'post-4',
    author: 'SK Delusional Team',
    handle: '@sk_delusional',
    avatar: 'https://i.pinimg.com/736x/5d/42/e8/5d42e81d4678802413cc3c351a013318.jpg',
    content: `Dah lah... hari ke-5 tanpa hilal kebersamaan SeaKeen. Jiwa shipper-ku mulai layu bagaikan tanaman tak disiram 🥀😭 Tolong siramin aku! hatiku sudah kekeringan ini!"\n@seatalay @keenkeno`,
    time: '5j',
    likes: '1.8K',
    reposts: '620',
  },
  {
    id: 'post-5',
    author: 'SeaKeen Orbit ✨',
    handle: '@seakeen_orbit',
    avatar: 'https://i.pinimg.com/736x/63/7c/c2/637cc2a74c919e69911362ece9741303.jpg',
    content: `Me waiting for SeaKeen new interaction be like... 💀⏳ Ya Tuhan hamba tidak minta banyak, cuma minta mereka upload foto bareng hari ini, Aamiin paling kenceng!\n@seatalay @keenkeno`,
    image: 'https://i.pinimg.com/736x/38/26/ca/3826ca7ba7929b2219cfd91e4f081cb7.jpg',
    time: '6j',
    likes: '3.1K',
    reposts: '1.1K',
  },
];

// Profile data for Clover Boys
export const CLOVER_GROUP = {
  id: 'clover-boys',
  name: 'CL🍀VER BOYS',
  avatar: 'https://i.pinimg.com/736x/d0/88/24/d0882475f244cca7f684ef951b1360ed.jpg',
  members: {
    ashi: {
      name: 'Ashi',
      avatar: 'https://i.pinimg.com/736x/17/57/cc/1757cc91c59b42d8cbc7440f06c9ab5e.jpg',
    },
    barcode: {
      name: 'Barcode',
      avatar: 'https://i.pinimg.com/1200x/86/6e/ce/866ece5ee4ffe51d62ae36bd7f4a7286.jpg',
    },
    aungpao: {
      name: 'Aungpao',
      avatar: 'https://i.pinimg.com/736x/0d/60/7f/0d607fd67100db0d93bfb990d11ca0b6.jpg',
    },
    keen: {
      name: 'Keen',
      avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
    },
  },
};

export const SEA_CONTACT = {
  id: 'sea',
  name: 'Sea 🦦💕',
  avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
};

export const KA_FLUK_CONTACT = {
  id: 'ka-fluk',
  name: 'Ka Fluk',
  avatar: '', // ga ada foto profil
};
