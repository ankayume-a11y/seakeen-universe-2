import React, { useState, useEffect } from 'react';
import { IPhoneFrame } from './components/IPhoneFrame';
import { StatusBar } from './components/StatusBar';
import { DynamicIsland } from './components/DynamicIsland';
import { LockScreen } from './components/LockScreen';
import { HomeScreen } from './components/HomeScreen';
import { InstagramApp } from './components/apps/InstagramApp';
import { XApp } from './components/apps/XApp';
import { LineApp } from './components/apps/LineApp';
import { NotesApp } from './components/apps/NotesApp';
import { PhotosApp } from './components/apps/PhotosApp';
import { CameraApp } from './components/apps/CameraApp';
import { MusicApp } from './components/apps/MusicApp';
import { CallScreen } from './components/apps/CallScreen';
import { SimulatorControls } from './components/SimulatorControls';
import { KEEN_CONFIG, KEEN_NOTES, KEEN_INSTAGRAM_PROFILE, KEEN_INSTAGRAM_FEED, KEEN_PHOTOS } from './data/keenData';
import { SEA_CONFIG, SEA_NOTES, SEA_INSTAGRAM_PROFILE, SEA_INSTAGRAM_FEED, SEA_PHOTOS } from './data/seaData';
import {
  KEEN_STEP1_NOTIFS,
  KEEN_STEP1_POSTS,
  CLOVER_GROUP,
  SEA_CONTACT,
  KA_FLUK_CONTACT,
} from './data/storyData';
import { AppId, ChatMessage, ChatThread, NotificationItem, PovMode, XPost } from './types';
import { sound } from './utils/audio';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  // Simulator Base State
  const [pov, setPov] = useState<PovMode>('keen');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [freeMode, setFreeMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Dynamic Island & Media
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [islandNotif, setIslandNotif] = useState<NotificationItem | null>(null);
  const [bannerNotif, setBannerNotif] = useState<NotificationItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Story Progression State
  const [keenStep, setKeenStep] = useState(1);
  const [seaStep, setSeaStep] = useState(1);

  // Notifications Queue
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Call System
  const [isCallScreenOpen, setIsCallScreenOpen] = useState(false);
  const [callProps, setCallProps] = useState<{
    callerName: string;
    callerAvatar: string;
    isGreenDisabled: boolean;
    disabledReason: string;
    isActiveCall: boolean;
    transcriptLines: { speaker: string; text: string }[];
  }>({
    callerName: 'Sea 🦦💕',
    callerAvatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
    isGreenDisabled: true,
    disabledReason: 'Keen masih ngambek, nggak mau angkat!',
    isActiveCall: false,
    transcriptLines: [],
  });
  const [callRejectCount, setCallRejectCount] = useState(0);
  const [waitingForSeaRead, setWaitingForSeaRead] = useState<number | null>(null);

  // X Posts State
  const [xPosts, setXPosts] = useState<XPost[]>(KEEN_STEP1_POSTS);
  const [xPendingReply, setXPendingReply] = useState<{
    postId: string;
    targetText: string;
    placeholder?: string;
  } | null>(null);

  // LINE Chat Threads State
  const [lineThreads, setLineThreads] = useState<ChatThread[]>([
    {
      id: 'clover-boys',
      name: 'CL🍀VER BOYS',
      avatar: 'https://i.pinimg.com/736x/d0/88/24/d0882475f244cca7f684ef951b1360ed.jpg',
      isGroup: true,
      unreadCount: 0,
      messages: [],
    },
    {
      id: 'sea',
      name: 'Sea 🦦💕',
      avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
      unreadCount: 0,
      messages: [
        {
          id: 'prev-1',
          sender: 'me',
          senderName: 'Keen',
          text: 'baby, kamu udah balik syuting?',
          time: '22:00',
        },
        {
          id: 'prev-2',
          sender: 'me',
          senderName: 'Keen',
          image: 'https://i.pinimg.com/736x/d9/b6/9d/d9b69dab2bca9cdfd082ac57e997135d.jpg',
          time: '22:05',
        },
        {
          id: 'prev-3',
          sender: 'me',
          senderName: 'Keen',
          text: 'bales dong pesan aku',
          time: '22:15',
        },
        {
          id: 'prev-4',
          sender: 'me',
          senderName: 'Keen',
          text: 'oh\npantesan chat aku di cuekin.\nAku lihat kamu on call sama Surf di discord. Pasti begadang main game lagi',
          time: '22:40',
        },
      ],
    },
    {
      id: 'ka-fluk',
      name: 'Ka Fluk',
      avatar: '',
      unreadCount: 0,
      messages: [],
    },
  ]);
  const [activeLineChatId, setActiveLineChatId] = useState<string | undefined>(undefined);
  const [linePendingReply, setLinePendingReply] = useState<{
    chatId: string;
    targetText: string;
    placeholder?: string;
    time?: string;
  } | null>(null);
  const [isLineTyping, setIsLineTyping] = useState(false);
  const [lineTypingSender, setLineTypingSender] = useState('');
  const [readyForZoneXNotif, setReadyForZoneXNotif] = useState(false);
  const [readyForRepostXNotif, setReadyForRepostXNotif] = useState(false);
  const [readyForClover6Notif, setReadyForClover6Notif] = useState(false);
  const [readyForKaFluk7Notif, setReadyForKaFluk7Notif] = useState(false);
  const [readyForSeaCall8, setReadyForSeaCall8] = useState(false);
  const [readyForStep9Notif, setReadyForStep9Notif] = useState(false);
  const [readyForStep10Notif, setReadyForStep10Notif] = useState(false);
  const [readyForSea11Notif, setReadyForSea11Notif] = useState(false);
  const [readyForSea12Notif, setReadyForSea12Notif] = useState(false);
  const [readyForSea15Notif, setReadyForSea15Notif] = useState(false);
  const [readyForSeaCall17, setReadyForSeaCall17] = useState(false);
  const [readyForSeaCall19, setReadyForSeaCall19] = useState(false);
  const [readyForSurfNotif, setReadyForSurfNotif] = useState(false);
  const [readyForBebebKeenNotif, setReadyForBebebKeenNotif] = useState(false);
  const [seaXFansLoaded, setSeaXFansLoaded] = useState(false);
  const [isSeaUnlocked, setIsSeaUnlocked] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [lockExternalTrigger, setLockExternalTrigger] = useState<{
    type: 'unlock' | 'camera' | 'notification';
    notif?: NotificationItem;
    timestamp: number;
  } | null>(null);

  // Story Dialog Queues
  const [cloverQueueIndex, setCloverQueueIndex] = useState(0);

  // Active configurations based on current POV
  const config = pov === 'keen' ? KEEN_CONFIG : SEA_CONFIG;
  const notes = pov === 'keen' ? KEEN_NOTES : SEA_NOTES;
  const igProfile = pov === 'keen' ? KEEN_INSTAGRAM_PROFILE : SEA_INSTAGRAM_PROFILE;
  const igFeed = pov === 'keen' ? KEEN_INSTAGRAM_FEED : SEA_INSTAGRAM_FEED;
  const photos = pov === 'keen' ? KEEN_PHOTOS : SEA_PHOTOS;

  // Toggle audio
  const handleToggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) sound.playTap();
  };

  // Listen to fullscreen changes (e.g. user pressing Escape or browser toggle)
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Toggle fullscreen mode
  const handleToggleFullscreen = () => {
    sound.playTap();
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Push notification helper
  const triggerNotification = (notif: NotificationItem) => {
    sound.playNotification();
    setNotifications((prev) => [notif, ...prev]);
    setIslandNotif(notif);
    setBannerNotif(notif);
    setTimeout(() => {
      setIslandNotif((cur) => (cur?.id === notif.id ? null : cur));
      setBannerNotif((cur) => (cur?.id === notif.id ? null : cur));
    }, 4500);
  };

  // Handle clicking on notification anywhere (LockScreen, Dynamic Island, top banner)
  const handleNotificationClick = (notif: NotificationItem) => {
    sound.playTap();
    if (!isUnlocked) {
      setLockExternalTrigger({
        type: 'notification',
        notif,
        timestamp: Date.now(),
      });
      return;
    }
    setBannerNotif(null);
    setIslandNotif(null);
    const target = notif.targetApp || notif.app;
    if (target) {
      setActiveApp(target);
      if (notif.targetChatId) {
        setActiveLineChatId(notif.targetChatId);
      }
    }
  };

  // Handle Switching POV
  const handleSwitchPov = (newPov: PovMode) => {
    if (newPov === 'sea' && !isSeaUnlocked) {
      sound.playTap();
      return;
    }
    setPov(newPov);
    setIsUnlocked(false);
    setActiveApp(null);
    setIsCallScreenOpen(false);
    setIsMusicPlaying(false);
    setNotifications([]);
    sound.playLock();

    if (newPov === 'sea') {
      // Setup Sea universe data
      setupSeaUniverse();
    } else {
      // Setup Keen universe data
      setupKeenUniverse();
    }
  };

  // Initialize Keen Universe
  const setupKeenUniverse = () => {
    setKeenStep(1);
    setXPosts(KEEN_STEP1_POSTS);
    setNotifications([]);
    setCloverQueueIndex(0);

    // Initial lockscreen notifications
    KEEN_STEP1_NOTIFS.forEach((n, idx) => {
      setTimeout(() => {
        triggerNotification(n);
      }, (idx + 1) * 800);
    });
  };

  // Initialize Sea Universe
  const setupSeaUniverse = () => {
    setSeaStep(1);
    setNotifications([]);
    setSeaXFansLoaded(false);
    setReadyForSurfNotif(false);
    setReadyForBebebKeenNotif(false);

    const seaPost: XPost = {
      id: 'sea-post-1',
      author: 'Keen Suvijak',
      handle: '@keenkeno',
      avatar: 'https://pbs.twimg.com/profile_images/2088460965713170432/YOnV9V6c_400x400.jpg',
      content: 'I like this rich handsome man @seatalay',
      images: [
        'https://i.pinimg.com/736x/b3/5e/27/b35e279531c8100d4084cf433ae9f19b.jpg',
        'https://i.pinimg.com/736x/04/b1/af/04b1af8b19e8fc4039b01f99f36133c1.jpg',
      ],
      time: 'Baru saja',
      likes: '14.8K',
      reposts: '4.2K',
      replies: [],
    };
    setXPosts([seaPost]);

    // Sea LINE threads
    setLineThreads([
      {
        id: 'surf',
        name: 'Surf',
        avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
        unreadCount: 0,
        messages: [],
      },
      {
        id: 'bebeb-keen',
        name: 'My bebeb Keen akuh 🦐🥰🤤😘❤️🔥',
        avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
        unreadCount: 0,
        messages: [],
      },
    ]);

    // Skenario 1: Sebelum masuk lockscreen ada muncul notif dari @keenkeno di X. Notif X muncul dan ada bunyi notifnya.
    setTimeout(() => {
      triggerNotification({
        id: `sea-notif-keen-${Date.now()}`,
        app: 'x',
        targetApp: 'x',
        title: 'X · @keenkeno',
        body: 'I like this rich handsome man @seatalay',
        avatar: 'https://pbs.twimg.com/profile_images/2088460965713170432/YOnV9V6c_400x400.jpg',
        time: 'Baru saja',
      });
    }, 800);
  };

  // Init Keen on mount
  useEffect(() => {
    setupKeenUniverse();
  }, []);

  // When Keen enters X in Step 1, stop lockscreen notifications
  useEffect(() => {
    if (pov === 'keen' && keenStep === 1 && activeApp === 'x') {
      // Clear unread
      setNotifications([]);
    }
  }, [activeApp, keenStep, pov]);

  // Effect to load fan replies dynamically when Sea enters X in Step 1
  useEffect(() => {
    if (pov === 'sea' && seaStep === 1 && activeApp === 'x' && !seaXFansLoaded) {
      setSeaXFansLoaded(true);

      const fan1: XPost = {
        id: `rep-fan-1-${Date.now()}`,
        author: 'SeaKeen Nation ✨',
        handle: '@seakeenation',
        avatar: 'https://i.pinimg.com/736x/33/3c/51/333c517e635182693f75fb5c42c54307.jpg',
        content:
          'Inikah sosok rich & handsome punya nya Keen? Iri banget tapi ya ampun gemesin banget sih kalian berdua! 😭🤍\n@keenkeno @seatalay\n#SeaKeen #KeenSea',
        time: 'Baru saja',
        likes: '340',
        reposts: '50',
        isReplyingTo: '@keenkeno @seatalay',
      };

      const fan2: XPost = {
        id: `rep-fan-2-${Date.now()}`,
        author: 'Bucin SK',
        handle: '@bucin_sk',
        avatar: 'https://i.pinimg.com/736x/3f/ef/d9/3fefd999fccb84588b218b0516688fcd.jpg',
        content:
          'Tolong kondisikan itu tangan enggak usah pamer pas malam gini dong. Sirik banget gue lama-lama jadi nyamuk online mereka. Tapi pas liat foto ini jadi auto senyum-senyum sendiri kayak orang gila. 🫠✨\n@keenkeno @seatalay\n#RichHandsomeMan #KeenKeno #SeaTalay',
        time: 'Baru saja',
        likes: '512',
        reposts: '89',
        isReplyingTo: '@keenkeno @seatalay',
      };

      const fan3: XPost = {
        id: `rep-fan-3-${Date.now()}`,
        author: 'SK Universe 24',
        handle: '@sk_universe24',
        avatar: 'https://i.pinimg.com/736x/f8/31/84/f8318427df7444935451478bd5aa21f3.jpg',
        content:
          'CIEEE YANG UDAH BAIKAN! Tadi aja kayaknya sempet ngambek-ngambekan, sekarang udah pamer2 aja. Seneng banget liat kalian akur lagi, tapi iri juga liat bucinnya makin ugal-ugalan! 😡🫶\n@keenkeno @seatalay',
        time: 'Baru saja',
        likes: '890',
        reposts: '140',
        isReplyingTo: '@keenkeno @seatalay',
      };

      setTimeout(() => {
        setXPosts((prev) =>
          prev.map((p) =>
            p.id === 'sea-post-1'
              ? { ...p, replies: [...(p.replies || []), fan1] }
              : p
          )
        );
        triggerNotification({
          id: `notif-fan-skn-${Date.now()}`,
          app: 'x',
          targetApp: 'x',
          title: 'X · @seakeenation',
          body: 'membalas @keenkeno @seatalay: Inikah sosok rich & handsome punya nya Keen?...',
          avatar: 'https://i.pinimg.com/736x/33/3c/51/333c517e635182693f75fb5c42c54307.jpg',
          time: 'Baru saja',
        });
      }, 700);

      setTimeout(() => {
        setXPosts((prev) =>
          prev.map((p) =>
            p.id === 'sea-post-1'
              ? { ...p, replies: [...(p.replies || []), fan2] }
              : p
          )
        );
        triggerNotification({
          id: `notif-fan-bsk-${Date.now()}`,
          app: 'x',
          targetApp: 'x',
          title: 'X · @bucin_sk',
          body: 'membalas @keenkeno @seatalay: Tolong kondisikan itu tangan enggak usah pamer...',
          avatar: 'https://i.pinimg.com/736x/3f/ef/d9/3fefd999fccb84588b218b0516688fcd.jpg',
          time: 'Baru saja',
        });
      }, 1600);

      setTimeout(() => {
        setXPosts((prev) =>
          prev.map((p) =>
            p.id === 'sea-post-1'
              ? { ...p, replies: [...(p.replies || []), fan3] }
              : p
          )
        );
        triggerNotification({
          id: `notif-fan-sku-${Date.now()}`,
          app: 'x',
          targetApp: 'x',
          title: 'X · @sk_universe24',
          body: 'membalas @keenkeno @seatalay: CIEEE YANG UDAH BAIKAN! Tadi aja kayaknya sempet...',
          avatar: 'https://i.pinimg.com/736x/f8/31/84/f8318427df7444935451478bd5aa21f3.jpg',
          time: 'Baru saja',
        });

        // Set pending reply for Sea on virtual keyboard
        setXPendingReply({
          postId: 'sea-post-1',
          targetText: 'tinggal nunggu barangnya nyampe dan cari waktu buat kita ketemuan lagi yaa',
          placeholder: 'Ketik balasan: tinggal nunggu barangnya nyampe...',
        });
      }, 2500);
    }
  }, [pov, seaStep, activeApp, seaXFansLoaded]);

  // Story step descriptions for the helper panel
  const getStepDescription = () => {
    if (pov === 'sea') {
      if (seaStep === 1) return 'Lihat tweet Keen di X ("I like this rich handsome man"), baca respon fans, dan balas tweet Keen!';
      if (seaStep === 2) return 'Buka LINE chat dari Surf, ceritakan momen makan malam & pamer menginap di apartemen Keen!';
      if (seaStep === 3) return 'Buka chat dari My bebeb Keen akuh 🦐🥰🤤😘❤️🔥 dan bujuk Keen keluar dari kamar mandi!';
      return '✨ THE END - Universe Sea Selesai! Jelajahi HP Bebas';
    }

    switch (keenStep) {
      case 1:
        return 'Masukkan kode sandi, lalu buka aplikasi X untuk melihat tweet kegalauan fans SeaKeen.';
      case 2:
        return 'Keluar dari X, buka LINE grup CL🍀VER BOYS dan respon candaan teman-teman!';
      case 3:
        return 'Buka notifikasi X dari @seakeen_zone dan balas postingan fans lewat keyboard virtual.';
      case 4:
        return 'Lihat respon repost heboh dari para fans di X (@sea_nation, @kabar_sea).';
      case 5:
        return 'Buka chat LINE dari Sea 🦦💕. Balas rasa kesalmu lalu read (centang biru) pesan dia!';
      case 6:
        return 'Buka grup CL🍀VER BOYS, ladeni ledekan Ashi, Barcode & Aungpao!';
      case 7:
        return 'Buka chat dari Ka Fluk dan ceritakan alasan kamu mendiamkan Sea.';
      case 8:
        return 'Panggilan masuk dari Sea! Karena masih ngambek, tolak panggilannya (tombol merah)!';
      case 9:
        return 'Buka postingan X @blue_sky99. Balas fans & saling sindir dengan @seatalay!';
      case 10:
        return 'Lihat reaksi lucu fans di X tentang mode ngambek Keen.';
      case 11:
        return 'Buka chat Sea 🦦💕 yang memuji foto cantikmu.';
      case 12:
        return 'Buka postingan heboh Sea di X ("part of my personal collection" + 4 foto).';
      case 13:
        return 'Lihat fans repost & geger karena foto koleksi pribadi Sea dibocorkan.';
      case 14:
        return 'Buka grup CL🍀VER BOYS dan rasakan salting karena foto-foto postingan Sea!';
      case 15:
        return 'Buka chat Sea 🦦💕 yang membujuk kamu di malam hari.';
      case 16:
        return 'Buka grup CL🍀VER BOYS untuk curhat jujur tentang rasa cemburumu pada Surf.';
      case 17:
        return 'Panggilan telepon dari Sea! Angkat teleponnya & dengarkan suara bujukannya!';
      case 18:
        return 'Buka chat Sea: Kado Graphic Card PC baru & bicarakan rencana mabar bareng Sea!';
      case 19:
        return 'Panggilan kejutan dari Sea di bawah jendela apartemenmu! Angkat teleponnya & temui Sea!';
      default:
        return '✨ THE END ✨ Cerita selesai! Jelajahi hp Keen atau ganti POV ke Sea!';
    }
  };

  // ADVANCE STORY STEP HELPER
  const advanceKeenStory = (nextStep: number) => {
    setKeenStep(nextStep);

    // Setup events for specific steps
    if (nextStep === 2) {
      // Notification from Clover Boys
      triggerNotification({
        id: 'notif-clover',
        app: 'line',
        targetApp: 'line',
        targetChatId: 'clover-boys',
        title: 'LINE · CL🍀VER BOYS',
        body: 'Aungpao: Guys, kalian pada buka X nggak sih?',
        avatar: 'https://i.pinimg.com/736x/d0/88/24/d0882475f244cca7f684ef951b1360ed.jpg',
        time: 'Baru saja',
      });
      // Start group chat flow in Clover Boys
      loadCloverDialogueStep2();
    } else if (nextStep === 3) {
      // Notification on X from @seakeen_zone
      const zonePost: XPost = {
        id: 'post-zone',
        author: 'SeaKeen Zone',
        handle: '@seakeen_zone',
        avatar: 'https://i.pinimg.com/736x/63/7c/c2/637cc2a74c919e69911362ece9741303.jpg',
        content: `Keennnn. Kabar mu gimana sih nak? Anak mama ini kemana aja??”\n@keenkeno`,
        image: 'https://i.pinimg.com/736x/93/9d/b1/939db1afff732d6fd54bba937dcb5d35.jpg',
        time: 'Baru saja',
        likes: '3.4K',
        reposts: '890',
        replies: [],
      };
      setXPosts([zonePost, ...KEEN_STEP1_POSTS]);
      triggerNotification({
        id: 'notif-zone',
        app: 'x',
        targetApp: 'x',
        title: 'X · @seakeen_zone',
        body: 'Keennnn. Kabar mu gimana sih nak? Anak mama ini kemana aja??”',
        avatar: 'https://i.pinimg.com/736x/63/7c/c2/637cc2a74c919e69911362ece9741303.jpg',
        time: 'Baru saja',
      });
      setXPendingReply({
        postId: 'post-zone',
        targetText: 'aku baik kokkk mom 😎👍',
        placeholder: 'Ketik: aku baik kokkk mom 😎👍',
      });
    } else if (nextStep === 4) {
      // Fan reposts in X
      const repostPosts: XPost[] = [
        {
          id: 'post-repost-1',
          author: 'Sea Nation 🌊',
          handle: '@sea_nation',
          avatar: 'https://i.pinimg.com/736x/70/a5/8a/70a58ac6ae0fd317ed22476da57d1fe7.jpg',
          content: `Panggilan untuk abang Laut. Anda dimana Hei?!😭 Bro ini beneran hilang dari peradaban apa gimana ini @seatalay`,
          time: '1m',
          likes: '1.5K',
          reposts: '450',
          isRepost: true,
          repostedAuthor: '💬 @keenkeno: nggak tau mom. Chat aku aja nggak dibalas...',
        },
        {
          id: 'post-repost-2',
          author: 'Kabar Sea 📢',
          handle: '@kabar_sea',
          avatar: 'https://i.pinimg.com/736x/d0/88/24/d0882475f244cca7f684ef951b1360ed.jpg',
          content: `Plot twist banget, Keno-nya ada tapi Sea-nya yang ngilang 😭\nWOI LAUT @seatalay BUKA CHAT NYA!! Keen aja didiemin apalagi kita 😭 Tapi serius Sea kamu di mana sih, satu bangsa lagi nyariin kamu ini 🏃‍♂️💨!!\n@seatalay @keenkeno`,
          time: '3m',
          likes: '2.8K',
          reposts: '920',
          isRepost: true,
          repostedAuthor: '💬 @keenkeno: nggak tau mom. Chat aku aja nggak dibalas...',
        },
        {
          id: 'post-repost-3',
          author: 'SeaKeen Nation ✨',
          handle: '@seakeenation',
          avatar: 'https://i.pinimg.com/736x/87/03/a3/8703a3158a932964d7bcee9823cbe483.jpg',
          content: `Seaaaaa 💀 @seatalay muncul dong nak, minimal kasih tanda-tanda kehidupan! 😂\n@seatalay @keenkeno`,
          time: '5m',
          likes: '3.1K',
          reposts: '1.2K',
          isRepost: true,
          repostedAuthor: '💬 @keenkeno: nggak tau mom. Chat aku aja nggak dibalas...',
        },
      ];
      setXPosts((prev) => [...repostPosts, ...prev]);
      triggerNotification({
        id: 'notif-sea-nation',
        app: 'x',
        targetApp: 'x',
        title: 'X · @sea_nation',
        body: 'Panggilan untuk abang Laut. Anda dimana Hei?!😭 Bro ini beneran hilang dari peradaban...',
        avatar: 'https://i.pinimg.com/736x/70/a5/8a/70a58ac6ae0fd317ed22476da57d1fe7.jpg',
        time: 'Baru saja',
      });
      setTimeout(() => {
        triggerNotification({
          id: 'notif-kabar-sea',
          app: 'x',
          targetApp: 'x',
          title: 'X · @kabar_sea',
          body: 'Plot twist banget, Keno-nya ada tapi Sea-nya yang ngilang 😭 WOI LAUT @seatalay BUKA CHAT NYA!!',
          avatar: 'https://i.pinimg.com/736x/d0/88/24/d0882475f244cca7f684ef951b1360ed.jpg',
          time: 'Baru saja',
        });
      }, 700);
      setTimeout(() => {
        triggerNotification({
          id: 'notif-seakeenation',
          app: 'x',
          targetApp: 'x',
          title: 'X · @seakeenation',
          body: 'Seaaaaa 💀 @seatalay muncul dong nak, minimal kasih tanda-tanda kehidupan! 😂',
          avatar: 'https://i.pinimg.com/736x/87/03/a3/8703a3158a932964d7bcee9823cbe483.jpg',
          time: 'Baru saja',
        });
      }, 1400);
    } else if (nextStep === 5) {
      // Morning chat from Sea
      triggerNotification({
        id: 'notif-sea-morning',
        app: 'line',
        targetApp: 'line',
        targetChatId: 'sea',
        title: 'LINE · Sea 🦦💕',
        body: 'sayanggg... maaf banget baru bales sekarang 😭🙏🏻',
        avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
        time: '07.22',
      });
      loadSeaDialogueStep5();
    } else if (nextStep === 6) {
      // Group Clover Boys teasing
      triggerNotification({
        id: 'notif-clover-6',
        app: 'line',
        targetApp: 'line',
        targetChatId: 'clover-boys',
        title: 'LINE · CL🍀VER BOYS',
        body: 'Ashi: WKWKWKWK',
        avatar: 'https://i.pinimg.com/736x/d0/88/24/d0882475f244cca7f684ef951b1360ed.jpg',
        time: '07.30',
      });
      loadCloverDialogueStep6();
    } else if (nextStep === 7) {
      // Ka Fluk chat
      triggerNotification({
        id: 'notif-ka-fluk',
        app: 'line',
        targetApp: 'line',
        targetChatId: 'ka-fluk',
        title: 'LINE · Ka Fluk',
        body: 'Keen',
        avatar: '',
        time: '08.00',
      });
      loadKaFlukDialogueStep7();
    } else if (nextStep === 8) {
      // Incoming call from Sea! (Red button only)
      setCallRejectCount(0);
      setWaitingForSeaRead(null);
      setCallProps({
        callerName: 'Sea 🦦💕',
        callerAvatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
        isGreenDisabled: true,
        disabledReason: 'Keen masih ngambek, nggak mau angkat!',
        isActiveCall: false,
        transcriptLines: [],
      });
      setIsCallScreenOpen(true);
    } else if (nextStep === 9) {
      // @blue_sky99 post in X
      const bluePost: XPost = {
        id: 'post-blue-sky',
        author: 'Blue Sky',
        handle: '@blue_sky99',
        avatar: 'https://i.pinimg.com/1200x/5d/85/2c/5d852c7ba7c4be366e8941c005bcdd6f.jpg',
        content: `akhirnya mereka ada jadwal bareng hari iniiii. Barusan lihat di IG nya Keno~!\nEh tapi kok muka sea di tutup @keenkeno?`,
        image: 'https://pbs.twimg.com/media/HUCn4IBbsAIBW71?format=jpg&name=large',
        time: 'Baru saja',
        likes: '4.2K',
        reposts: '1.5K',
        replies: [],
      };
      setXPosts([bluePost, ...xPosts]);
      triggerNotification({
        id: 'notif-blue-sky',
        app: 'x',
        targetApp: 'x',
        title: 'X · @blue_sky99',
        body: 'akhirnya mereka ada jadwal bareng hari iniiii. Barusan lihat di IG nya Keno~!',
        avatar: 'https://i.pinimg.com/1200x/5d/85/2c/5d852c7ba7c4be366e8941c005bcdd6f.jpg',
        time: 'Baru saja',
      });
      setXPendingReply({
        postId: 'post-blue-sky',
        targetText: 'biarin aja mom. Toh dia juga jarang fotoin aku 😌',
        placeholder: 'Ketik: biarin aja mom. Toh dia juga jarang fotoin aku 😌',
      });
    } else if (nextStep === 10) {
      // Fan reactions about Keen's ngambek
      const ngambekFans: XPost[] = [
        {
          id: 'nb-1',
          author: 'Bubble Stea',
          handle: '@bubblestea_',
          avatar: 'https://i.pinimg.com/736x/fd/2d/b7/fd2db79e9adb3d8146a7c8ff52a554bf.jpg',
          content: `Sumpah ngakak banget liat reply-annya Keno 😭 WKWKWK mode ngambeknya keliatan bgt, mukanya dilipat di RL pasti ini!! Sea mending kamu cepetan elus-elus palanya atau kasih boba deh sebelum dia makin parah ngambeknya wkwkwk 🫠❤️\n@keenkeno @seatalay`,
          time: '2m',
          likes: '2.1K',
          reposts: '650',
        },
        {
          id: 'nb-2',
          author: 'Seaside Keen',
          handle: '@seasidekeen',
          avatar: 'https://i.pinimg.com/736x/c6/94/24/c6942481f41e3f862382bce991ce92d2.jpg',
          content: `Warga X tolong perhatikan, Keen kalo lagi ngambek tuh emang ketahuan bgt dari cara balesnya WKWKWK.\n@keenkeno @seatalay`,
          time: '4m',
          likes: '1.8K',
          reposts: '510',
        },
        {
          id: 'nb-3',
          author: 'Sea Starlight ✨',
          handle: '@seastarlight',
          avatar: 'https://i.pinimg.com/1200x/b2/43/44/b24344a0f316be25ca67a70e1ad782a7.jpg',
          content: `Misteri Keen ngambek terpecahkan gaes 😭👍\nJadi kayaknya Sea sibuk main game dan ga balesin chat Keen ya? Kata gue kurang-kurangin dah Sea!\n@keenkeno @seatalay`,
          time: '5m',
          likes: '3.6K',
          reposts: '1.1K',
        },
      ];
      setXPosts((prev) => [...ngambekFans, ...prev]);
      triggerNotification({
        id: 'notif-bubble',
        app: 'x',
        targetApp: 'x',
        title: 'X · @bubblestea_',
        body: 'Sumpah ngakak banget liat reply-annya Keno 😭 WKWKWK mode ngambeknya keliatan bgt, mukanya dilipat di RL pasti ini!!...',
        avatar: 'https://i.pinimg.com/736x/fd/2d/b7/fd2db79e9adb3d8146a7c8ff52a554bf.jpg',
        time: 'Baru saja',
      });
      setTimeout(() => {
        triggerNotification({
          id: 'notif-seasidekeen',
          app: 'x',
          targetApp: 'x',
          title: 'X · @seasidekeen',
          body: 'Warga X tolong perhatikan, Keen kalo lagi ngambek tuh emang ketahuan bgt dari cara balesnya WKWKWK. @keenkeno @seatalay',
          avatar: 'https://i.pinimg.com/736x/c6/94/24/c6942481f41e3f862382bce991ce92d2.jpg',
          time: 'Baru saja',
        });
      }, 700);
      setTimeout(() => {
        triggerNotification({
          id: 'notif-seastarlight',
          app: 'x',
          targetApp: 'x',
          title: 'X · @seastarlight',
          body: 'Misteri Keen ngambek terpecahkan gaes 😭👍 Jadi kayaknya Sea sibuk main game dan ga balesin chat Keen ya? Kata gue kurang-kurangin dah Sea!',
          avatar: 'https://i.pinimg.com/1200x/b2/43/44/b24344a0f316be25ca67a70e1ad782a7.jpg',
          time: 'Baru saja',
        });
      }, 1400);

      // Siap untuk Skenario 11 begitu Keen keluar dari app X
      setReadyForSea11Notif(true);
    } else if (nextStep === 11) {
      // Skenario 11: Notif pesan dari Sea 🦦💕 & bubble chat masuk satu per satu
      triggerNotification({
        id: `notif-sea-11-${Date.now()}`,
        app: 'line',
        targetApp: 'line',
        targetChatId: 'sea',
        title: 'LINE · Sea 🦦💕',
        body: '📷 [Foto]',
        avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
        time: '12.00',
      });

      const script11 = [
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          image: 'https://pbs.twimg.com/media/HVmPpxDbgAAZBw2?format=jpg&name=4096x4096',
          time: '12.00',
        },
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          text: 'cantiknya pacar aku hari ini',
          time: '12.00',
        },
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          text: 'aduh masih ngambek orgnya',
          time: '12.00',
        },
      ];

      addMessagesSequentially('sea', script11, () => {
        // Setelah bubble chat selesai masuk, siap untuk Skenario 12 saat keluar obrolan
        setReadyForSea12Notif(true);
      });
      // Standby jika pengguna langsung keluar
      setReadyForSea12Notif(true);
    } else if (nextStep === 12) {
      // Skenario 12: Postingan di X oleh @seatalay dengan 4 foto
      const seaPersonalPost: XPost = {
        id: `sea-personal-collection-${Date.now()}`,
        author: 'Sea Dechchart',
        handle: '@seatalay',
        avatar: 'https://pbs.twimg.com/profile_images/2115423123776610304/ZblO-Oj5_400x400.jpg',
        content: `I'm never lying. I really do take pictures of him @keenkeno all the time, but I rarely upload them because they're part of my personal collection. Will share only some of them`,
        images: [
          'https://pbs.twimg.com/media/HUxTHtjboAAILIG?format=jpg&name=large',
          'https://pbs.twimg.com/media/HUNDXNmawAAXkFL?format=jpg&name=large',
          'https://pbs.twimg.com/media/HT6LJOiacAAqDTv?format=jpg&name=large',
          'https://pbs.twimg.com/media/HTsLtVOXEAAjAgQ?format=jpg&name=large',
        ],
        time: 'Baru saja',
        likes: '10K',
        reposts: '7K',
      };
      setXPosts((prev) => [seaPersonalPost, ...prev]);
      triggerNotification({
        id: `notif-sea-post-${Date.now()}`,
        app: 'x',
        targetApp: 'x',
        title: 'X · @seatalay',
        body: "I'm never lying. I really do take pictures of him @keenkeno all the time, but I rarely upload them because they're part of my personal collection. Will share only some of them",
        avatar: 'https://pbs.twimg.com/profile_images/2115423123776610304/ZblO-Oj5_400x400.jpg',
        time: 'Baru saja',
      });
      // Skenario 13 TIDAK otomatis jalan di sini! Menunggu Keen membuka X dan keluar dari app X lagi.
    } else if (nextStep === 13) {
      // Skenario 13: Postingan dan notifikasi dari fans di X muncul satu per satu dengan embed repost postingan Sea
      const seaQuotedPost: XPost = {
        id: `quoted-sea-${Date.now()}`,
        author: 'Sea Dechchart',
        handle: '@seatalay',
        avatar: 'https://pbs.twimg.com/profile_images/2115423123776610304/ZblO-Oj5_400x400.jpg',
        content: `I'm never lying. I really do take pictures of him @keenkeno all the time, but I rarely upload them because they're part of my personal collection. Will share only some of them`,
        images: [
          'https://pbs.twimg.com/media/HUxTHtjboAAILIG?format=jpg&name=large',
          'https://pbs.twimg.com/media/HUNDXNmawAAXkFL?format=jpg&name=large',
          'https://pbs.twimg.com/media/HT6LJOiacAAqDTv?format=jpg&name=large',
          'https://pbs.twimg.com/media/HTsLtVOXEAAjAgQ?format=jpg&name=large',
        ],
        time: 'Baru saja',
        likes: '10K',
        reposts: '7K',
      };

      const fan1: XPost = {
        id: `fan-arc-1-${Date.now()}`,
        author: 'Keenology 🔬',
        handle: '@keenology_',
        avatar: 'https://i.pinimg.com/736x/fe/5d/4c/fe5d4c48d97e017cb217840404047175.jpg',
        content: `WIHH BENERAN BELIAU SIMPAN FOTO-FOTO KEEN 😭 Tolong sering-sering dibocorin koleksinya, Mas Sea! 🙏✨ @keenkeno @seatalay \n#SeaKeen #PersonalCollection #GatekeepKing`,
        time: 'Baru saja',
        likes: '4.8K',
        reposts: '1.9K',
        isRepost: true,
        repostedAuthor: '🔁 Reposted @seatalay’s post',
        quotedPost: seaQuotedPost,
      };

      const fan2: XPost = {
        id: `fan-arc-2-${Date.now()}`,
        author: 'Sea Keen Archive',
        handle: '@sea_keen_archive',
        avatar: 'https://i.pinimg.com/1200x/89/b5/be/89b5be2e39c6a7d04b11f4615a5280a7.jpg',
        content: `Kaget banget pas liat caption-nya Sea 😱🔥 "Personal collection" kata dia... pantesan jarang upload, ternyata emang disimpan sendiri dan di-gatekeep! Beneran gak bohong dong ucapan dia. Lucu banget Keen di jepretan Sea, makasih udah mau sharing koleksi pribadi nya ya mas pacar!\n@keenkeno @seatalay \n#SeaKeenMoments #DailyKeen #GatekeepKeen`,
        time: 'Baru saja',
        likes: '6.2K',
        reposts: '2.4K',
        isRepost: true,
        repostedAuthor: '🔁 Reposted @seatalay’s post',
        quotedPost: seaQuotedPost,
      };

      const fan3: XPost = {
        id: `fan-arc-3-${Date.now()}`,
        author: 'Keen Bakpao 🥟',
        handle: '@keens_bakpao',
        avatar: 'https://i.pinimg.com/1200x/30/e8/af/30e8aff5c7ea63c5153729d8fa024157.jpg',
        content: `Siapa sangka omongannya beneran! Upload lagi dong Sea, jangan pelit-pelit sama koleksi pribadinya! 🤏❤️\n@keenkeno @seatalay \n#SeaKeenIsReal #BeneranDisimpan #GatekeepNoMore`,
        time: 'Baru saja',
        likes: '3.9K',
        reposts: '1.3K',
        isRepost: true,
        repostedAuthor: '🔁 Reposted @seatalay’s post',
        quotedPost: seaQuotedPost,
      };

      // Postingan fans pertama masuk
      setXPosts((prev) => [fan1, ...prev]);
      triggerNotification({
        id: `notif-fan-keenology-${Date.now()}`,
        app: 'x',
        targetApp: 'x',
        title: 'X · @keenology_',
        body: '🔁 Reposted @seatalay’s post: WIHH BENERAN BELIAU SIMPAN FOTO-FOTO KEEN 😭 Tolong sering-sering dibocorin...',
        avatar: 'https://i.pinimg.com/736x/fe/5d/4c/fe5d4c48d97e017cb217840404047175.jpg',
        time: 'Baru saja',
      });

      // Postingan fans kedua masuk setelah jeda
      setTimeout(() => {
        setXPosts((prev) => [fan2, ...prev]);
        triggerNotification({
          id: `notif-fan-archive-${Date.now()}`,
          app: 'x',
          targetApp: 'x',
          title: 'X · @sea_keen_archive',
          body: '🔁 Reposted @seatalay’s post: Kaget banget pas liat caption-nya Sea 😱🔥 "Personal collection" kata dia...',
          avatar: 'https://i.pinimg.com/1200x/89/b5/be/89b5be2e39c6a7d04b11f4615a5280a7.jpg',
          time: 'Baru saja',
        });
      }, 900);

      // Postingan fans ketiga masuk setelah jeda
      setTimeout(() => {
        setXPosts((prev) => [fan3, ...prev]);
        triggerNotification({
          id: `notif-fan-bakpao-${Date.now()}`,
          app: 'x',
          targetApp: 'x',
          title: 'X · @keens_bakpao',
          body: '🔁 Reposted @seatalay’s post: Siapa sangka omongannya beneran! Upload lagi dong Sea...',
          avatar: 'https://i.pinimg.com/1200x/30/e8/af/30e8aff5c7ea63c5153729d8fa024157.jpg',
          time: 'Baru saja',
        });
      }, 1800);
    } else if (nextStep === 14) {
      // Skenario 14: Notifikasi dari pesan grup CL🍀VER BOYS
      triggerNotification({
        id: `notif-clover-14-${Date.now()}`,
        app: 'line',
        targetApp: 'line',
        targetChatId: 'clover-boys',
        title: 'LINE · CL🍀VER BOYS',
        body: 'Aungpao: WOYYYY, GUYS! KALIAN UDAH LIAT POSTINGAN SEA DI X BELUM?!',
        avatar: 'https://i.pinimg.com/736x/d0/88/24/d0882475f244cca7f684ef951b1360ed.jpg',
        time: '18.15',
      });
      loadCloverDialogueStep14();
    } else if (nextStep === 15) {
      // Skenario 15: Pesan dari Sea 🦦💕 masuk satu per satu
      triggerNotification({
        id: `notif-sea-15-${Date.now()}`,
        app: 'line',
        targetApp: 'line',
        targetChatId: 'sea',
        title: 'LINE · Sea 🦦💕',
        body: 'sayangg udah malem loh ini',
        avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
        time: '18.39',
      });

      const script15 = [
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          text: 'sayangg udah malem loh ini',
          time: '18.39',
        },
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          text: 'kita dari tadi udah nggak ngobrol pas lagi jadwal bareng tadi',
          time: '18.39',
        },
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          text: 'kamu juga sampai ga mau pulang bareng aku 😭',
          time: '18.40',
        },
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          text: 'sampai kapan sih ngambeknya?',
          time: '18.41',
        },
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          image: 'https://i.pinimg.com/736x/c0/7c/31/c07c31e518104090c5c111aaf71c1b3b.jpg',
          time: '18.41',
        },
      ];

      addMessagesSequentially('sea', script15);
    } else if (nextStep === 16) {
      // Group Clover boys deep talk
      triggerNotification({
        id: 'notif-clover-16',
        app: 'line',
        targetApp: 'line',
        targetChatId: 'clover-boys',
        title: 'LINE · CL🍀VER BOYS',
        body: 'Ashi: Nah, kan. Langsung diem.',
        avatar: 'https://i.pinimg.com/736x/d0/88/24/d0882475f244cca7f684ef951b1360ed.jpg',
        time: 'Baru saja',
      });
      loadCloverDialogueStep16();
    } else if (nextStep === 17) {
      // Sea calls again, and this time call CAN BE ACCEPTED!
      setCallProps({
        callerName: 'Sea 🦦💕',
        callerAvatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
        isGreenDisabled: false,
        disabledReason: '',
        isActiveCall: false,
        transcriptLines: [
          { speaker: 'Sea 🦦💕', text: 'sayaangggggg' },
          { speaker: 'Keen', text: '…' },
          { speaker: 'Sea 🦦💕', text: 'huhuhu masih ga mau ngomong juga ya?' },
          { speaker: 'Keen', text: 'apa sih?' },
          { speaker: 'Sea 🦦💕', text: 'maafin aku yaaa. Aku janji ga bakal lupa waktu lagi. Nanti kamu boleh sita HP/PC aku deh kalau aku ngulangin lagi' },
          { speaker: 'Keen', text: 'Sea... aku tuh ga suka dicuekin, padahal dari semalam aku nungguin pesan dari kamu.' },
          { speaker: 'Sea 🦦💕', text: 'Iyaaa, maaf ya sayang. Beneran ga ada maksud cuekin kamu kok...' },
          { speaker: 'Keen', text: 'Lagian, aku sebenarnya bukan cuma kesel gara-gara kamu sibuk main game aja...' },
          { speaker: 'Sea 🦦💕', text: 'Eh? Terus gara-gara apa dong?' },
          { speaker: 'Keen', text: 'Ya... aku cemburu aja liat kamu main bareng Surf kemarin.' },
          { speaker: 'Sea 🦦💕', text: '(tertawa kecil gemes) Oooohhhh... jadi pacar aku yang cantik ini cemburu nih? Awwwww gemes banget sih!' },
          { speaker: 'Keen', text: 'Jangan digodain dong! Aku serius, tau...' },
          { speaker: 'Sea 🦦💕', text: 'Denger ya sayang. Surf itu cuma temen biasa. Di hati aku cuma ada kamu, ga ada slot buat yang lain. Mabar sama dia ga ada apa-apanya dibanding waktu aku bareng kamu.' },
          { speaker: 'Keen', text: 'Buktinya apa?' },
          { speaker: 'Sea 🦦💕', text: 'Ini aja aku mau ke apartemen kamu' },
          { speaker: 'Keen', text: 'hah ngapain? Udah malem ini. Ga usah ah!' },
          { speaker: 'Sea 🦦💕', text: 'seharian ini kamu dingin sama aku. Tadi aja pas kerja bareng, kamu jaga jarak terus. Padahal aku kan rindu kamu tau! Aku mau kita pelukan sampai pagi!' },
          { speaker: 'Keen', text: 'Malas ah! Ga yakin cuma pelukan doang' },
          { speaker: 'Sea 🦦💕', text: 'Hehehe, ya paling tambah cium-cium juga' },
          { speaker: 'Keen', text: 'Tuh kan!' },
          { speaker: 'Sea 🦦💕', text: 'Ya gimana ya... aku kan kangen dan cinta mati banget sama kamu.' },
          { speaker: 'Sea 🦦💕', text: 'Eh sebentar..' },
          { speaker: 'Keen', text: 'apa?' },
          { speaker: 'Sea 🦦💕', text: 'Ini aku dimaafin kan, sayang?' },
          { speaker: 'Keen', text: '(tersenyum kecil di ujung telepon) ish Iya iya, dimaafin.' },
          { speaker: 'Sea 🦦💕', text: 'akhirnyaaaa!!' },
          { speaker: 'Keen', text: 'tapi awas aja ya kamu ulangi lagi' },
          { speaker: 'Sea 🦦💕', text: 'siap cintaku' },
          { speaker: 'Sea 🦦💕', text: 'eh wait sayang aku tutup dulu ya callnya. Nanti ku hubungin lagi!' },
          { speaker: 'Sea 🦦💕', text: 'bentar aja kok! Jangan tidur dulu yaa' },
          { speaker: 'Keen', text: 'hm iya' },
        ],
      });
      setIsCallScreenOpen(true);
    } else if (nextStep === 18) {
      // Step 18: Sea sends graphic card gift in LINE chat
      triggerNotification({
        id: 'notif-sea-gift',
        app: 'line',
        targetApp: 'line',
        targetChatId: 'sea',
        title: 'LINE · Sea 🦦💕',
        body: '📷 [Foto]',
        avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
        time: '21.00',
      });
      loadSeaDialogueStep18();
    } else if (nextStep === 19) {
      // Skenario 19: Panggilan masuk dari Sea 🦦💕 di bawah jendela
      setCallProps({
        callerName: 'Sea 🦦💕',
        callerAvatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
        isGreenDisabled: false,
        disabledReason: '',
        isActiveCall: false,
        transcriptLines: [
          { speaker: 'Sea 🦦💕', text: 'halo sayang' },
          { speaker: 'Keen', text: 'iya by?' },
          { speaker: 'Sea 🦦💕', text: 'Coba intip ke luar jendela kamar kamu' },
          { speaker: 'Keen', text: '(melihat keluar jendela) Eh? Kamu... ngapain malem-malem ke apartemen aku?! Aku kan udah bilang jangan! Ini kan udah malam ini!' },
          { speaker: 'Sea 🦦💕', text: '(melambaikan tangan sambil tersenyum ke arah Keen) Kan aku udah bilang aku rindu banget sama kamu' },
          { speaker: 'Keno', text: 'aduh kenapa ga besok aja?' },
          { speaker: 'Sea 🦦💕', text: 'tapi kan aku mau peluk kamu sekarang' },
          { speaker: 'Keen', text: '(suaranya kayah salah tingkah tapi bahagia) Kamu tuh ya... bandel banget! Yaudah, tunggu di situ, aku turun sekarang.' },
          { speaker: 'Sea 🦦💕', text: 'Siap, cinta ku. Aku tunggu ya. I love you, Keen' },
          { speaker: 'Keen', text: 'uhh (salting) iya love you too, Sea!' },
        ],
      });
      setIsCallScreenOpen(true);
    }
  };

  // ADVANCE SEA STORY STEP HELPER
  const advanceSeaStory = (nextStep: number) => {
    setSeaStep(nextStep);

    if (nextStep === 1) {
      setupSeaUniverse();
    } else if (nextStep === 2) {
      // Skenario 2: Setelah keluar dari app X, muncul notif pesan masuk dari Surf
      triggerNotification({
        id: `notif-surf-${Date.now()}`,
        app: 'line',
        targetApp: 'line',
        targetChatId: 'surf',
        title: 'LINE · Surf',
        body: 'Ciee yang udah baikan sama Keen~ 🤣🤭',
        avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
        time: '23.00',
      });
      loadSurfDialogueStep2();
    } else if (nextStep === 3) {
      // Skenario 3: Setelah keluar dari obrolan dengan Surf, muncul pesan masuk dari My bebeb Keen akuh 🦐🥰🤤😘❤️🔥
      triggerNotification({
        id: `notif-bebeb-keen-${Date.now()}`,
        app: 'line',
        targetApp: 'line',
        targetChatId: 'bebeb-keen',
        title: 'LINE · My bebeb Keen akuh 🦐🥰🤤😘❤️🔥',
        body: 'kamu kapan pulangnya sih by?',
        avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
        time: '23.15',
      });
      loadBebebKeenDialogueStep3();
    }
  };

  // DIALOGUE SCRIPTS: Clover Boys Step 2
  const loadCloverDialogueStep2 = () => {
    const script = [
      { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Guys, kalian pada buka X nggak sih?', time: '07.00' },
      { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Kenapa emangnya?', time: '07.00' },
      { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Itu loh… fansnya Sea sama Keen pada galau berjamaah WKWKWK.', time: '07.00' },
      { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Katanya udah kangen banget liat interaksi mereka berdua', time: '07.02' },
      { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'Oh iya gue tadi juga sempet liat', time: '07.02' },
      { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'Ada yang nanya, “Kapan SeaKeen interaksi lagi?” @keen', time: '07.02' },
      { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Si sea juga jarang muncul gue lihat di X', time: '07.02' },
    ];

    addMessagesSequentially('clover-boys', script, () => {
      setLinePendingReply({
        chatId: 'clover-boys',
        targetText: 'Nggak tahu tuh, coba tanya aja sama orangnya 🤷🏻‍♂️',
        placeholder: 'Ketik: Nggak tahu tuh, coba tanya aja sama orangnya 🤷🏻‍♂️',
        time: '07.02',
      });
    });
  };

  // DIALOGUE SCRIPTS: Sea Step 5
  const loadSeaDialogueStep5 = () => {
    const msg = [
      { sender: 'sea', name: 'Sea', avatar: SEA_CONTACT.avatar, text: 'sayanggg... maaf banget baru bales sekarang 😭🙏🏻', time: '07.22' },
    ];
    addMessagesSequentially('sea', msg, () => {
      setLinePendingReply({
        chatId: 'sea',
        targetText: 'baru ingat aku sekarang?',
        placeholder: 'Ketik: baru ingat aku sekarang?',
        time: '07.23',
      });
    });
  };

  // DIALOGUE SCRIPTS: Clover Boys Step 6
  const loadCloverDialogueStep6 = () => {
    // Bersihkan semua pesan obrolan sebelumnya di grup CLOVER BOYS agar skenario 6 mulai bersih dari awal
    setLineThreads((prev) =>
      prev.map((t) => (t.id === 'clover-boys' ? { ...t, messages: [] } : t))
    );

    const script = [
      { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'WKWKWKWK', time: '07.30' },
      { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'Tapi serius, Keen. Jangan dibiasain ngambek gara-gara hal kecil begini, deh', time: '07.30' },
    ];
    addMessagesSequentially('clover-boys', script, () => {
      setLinePendingReply({
        chatId: 'clover-boys',
        targetText: 'Gue nggak ngambek, anjir',
        placeholder: 'Ketik: Gue nggak ngambek, anjir',
        time: '07.31',
      });
    });
  };

  // DIALOGUE SCRIPTS: Ka Fluk Step 7
  const loadKaFlukDialogueStep7 = () => {
    // Bersihkan obrolan ka-fluk sebelumnya agar mulai bersih dari awal
    setLineThreads((prev) =>
      prev.map((t) => (t.id === 'ka-fluk' ? { ...t, messages: [] } : t))
    );

    const script = [
      { sender: 'ka-fluk', name: 'Ka Fluk', avatar: '', text: 'Keen', time: '08.00' },
    ];
    addMessagesSequentially('ka-fluk', script, () => {
      setLinePendingReply({
        chatId: 'ka-fluk',
        targetText: 'iya ka?',
        placeholder: 'Ketik: iya ka?',
        time: '08.00',
      });
    });
  };

  // DIALOGUE SCRIPTS: Clover Boys Step 14
  const loadCloverDialogueStep14 = () => {
    // Bersihkan obrolan clover-boys sebelumnya agar Skenario 14 mulai bersih dari awal
    setLineThreads((prev) =>
      prev.map((t) => (t.id === 'clover-boys' ? { ...t, messages: [] } : t))
    );

    const script = [
      { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'WOYYYY, GUYS! KALIAN UDAH LIAT POSTINGAN SEA DI X BELUM?!', time: '18.15' },
      { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'ANJIR, PAO! BARU JUGA BUKA GRUP, CAPSLOCK LO UDAH BIKIN KAGET!', time: '18.15' },
      { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'WKWKWK Kenapa emangnya, Pao?', time: '18.16' },
      { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'BURU DAH CEK X!!', time: '18.16' },
      { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'OHHHHHHHHHHHHH', time: '18.17' },
      { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'CIEEEEEEEEEEEEEEE 🤭 @Keen', time: '18.17' },
    ];
    addMessagesSequentially('clover-boys', script, () => {
      setLinePendingReply({
        chatId: 'clover-boys',
        targetText: 'Apaan sih?',
        placeholder: 'Ketik: Apaan sih?',
        time: '18.17',
      });
    });
  };

  // DIALOGUE SCRIPTS: Clover Boys Step 16
  const loadCloverDialogueStep16 = () => {
    setLineThreads((prev) =>
      prev.map((t) => (t.id === 'clover-boys' ? { ...t, messages: [] } : t))
    );
    const script = [
      { sender: 'me', name: 'Keen', avatar: CLOVER_GROUP.members.keen.avatar, text: '...', time: '18.42' },
      { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Nah, kan. Langsung diem.', time: '18.42' },
    ];
    addMessagesSequentially('clover-boys', script, () => {
      setLinePendingReply({
        chatId: 'clover-boys',
        targetText: 'Emang gue harus maafin dia?',
        placeholder: 'Ketik: Emang gue harus maafin dia?',
        time: '18.43',
      });
    });
  };

  // DIALOGUE SCRIPTS: Sea Step 18
  const loadSeaDialogueStep18 = () => {
    const script = [
      {
        sender: 'sea',
        name: 'Sea 🦦💕',
        avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
        image: 'https://i.pinimg.com/736x/04/b1/af/04b1af8b19e8fc4039b01f99f36133c1.jpg',
        text: '',
        time: '21.00',
      },
    ];
    addMessagesSequentially('sea', script, () => {
      setLinePendingReply({
        chatId: 'sea',
        targetText: 'hah kok? Itu kamu beli?',
        placeholder: 'Ketik: hah kok? Itu kamu beli?',
        time: '21.00',
      });
    });
  };

  // DIALOGUE SCRIPTS: Surf Step 2 (Sea POV)
  const loadSurfDialogueStep2 = () => {
    setLineThreads((prev) =>
      prev.map((t) =>
        t.id === 'surf'
          ? {
              ...t,
              name: 'Surf',
              avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
              messages: [],
            }
          : t
      )
    );

    const script = [
      {
        sender: 'surf',
        name: 'Surf',
        avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
        text: 'Ciee yang udah baikan sama Keen~ 🤣🤭',
        time: '23.00',
      },
      {
        sender: 'surf',
        name: 'Surf',
        avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
        text: 'Gak sia-sia dari tadi galau seharian ya wkwk.',
        time: '23.00',
      },
    ];

    addMessagesSequentially('surf', script, () => {
      setLinePendingReply({
        chatId: 'surf',
        targetText: 'Hahaha apa itu galau ?😎',
        placeholder: 'Ketik: Hahaha apa itu galau ?😎',
        time: '23.00',
      });
    });
  };

  // DIALOGUE SCRIPTS: Bebeb Keen Step 3 (Sea POV)
  const loadBebebKeenDialogueStep3 = () => {
    setLineThreads((prev) =>
      prev.map((t) =>
        t.id === 'bebeb-keen'
          ? {
              ...t,
              name: 'My bebeb Keen akuh 🦐🥰🤤😘❤️🔥',
              avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
              messages: [],
            }
          : t
      )
    );

    const script = [
      {
        sender: 'keen',
        name: 'My bebeb Keen akuh',
        avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
        text: 'kamu kapan pulangnya sih by?',
        time: '23.15',
      },
      {
        sender: 'keen',
        name: 'My bebeb Keen akuh',
        avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
        image: 'https://i.pinimg.com/736x/89/64/be/8964beaa62b78880675db41c04579d22.jpg',
        time: '23.15',
      },
    ];

    addMessagesSequentially('bebeb-keen', script, () => {
      setLinePendingReply({
        chatId: 'bebeb-keen',
        targetText: 'kan aku bilang mau nginap disini🥲',
        placeholder: 'Ketik: kan aku bilang mau nginap disini🥲',
        time: '23.15',
      });
    });
  };

  // Helper to add incoming chat messages with typing indicator animation (one bubble at a time)
  const addMessagesSequentially = (
    chatId: string,
    msgs: { sender: string; name: string; avatar?: string; text?: string; image?: string; time?: string }[],
    onComplete?: () => void
  ) => {
    if (msgs.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    // Split any multi-line message into individual bubbles so each line enters one by one!
    const singleBubbles: { sender: string; name: string; avatar?: string; text?: string; image?: string; time?: string }[] = [];
    msgs.forEach((m) => {
      if (m.text && m.text.includes('\n') && !m.image) {
        const parts = m.text.split('\n').filter((l) => l.trim().length > 0);
        parts.forEach((line) => {
          singleBubbles.push({ ...m, text: line });
        });
      } else {
        singleBubbles.push(m);
      }
    });

    let i = 0;
    const sendNext = () => {
      if (i >= singleBubbles.length) {
        setIsLineTyping(false);
        if (onComplete) onComplete();
        return;
      }

      const item = singleBubbles[i];
      setIsLineTyping(true);
      setLineTypingSender(item.name);

      setTimeout(() => {
        setIsLineTyping(false);
        sound.playNotification();

        setLineThreads((prev) =>
          prev.map((thread) => {
            if (thread.id === chatId) {
              return {
                ...thread,
                messages: [
                  ...thread.messages,
                  {
                    id: `msg-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
                    sender: item.sender === 'me' ? 'me' : item.sender,
                    senderName: item.name,
                    senderAvatar: item.avatar,
                    text: item.text,
                    image: item.image,
                    time: item.time || '07.02',
                  },
                ],
              };
            }
            return thread;
          })
        );

        i++;
        setTimeout(sendNext, 550);
      }, 950);
    };

    sendNext();
  };

  // USER SENDS MESSAGE IN LINE APP
  const handleLineSendMessage = (chatId: string, text: string) => {
    // If user text has line breaks, split into individual bubbles
    const lines = text.split('\n').filter((l) => l.trim().length > 0);
    const msgTime = linePendingReply?.time || '07.02';

    const newMsgs: ChatMessage[] = lines.map((line, idx) => ({
      id: `user-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      sender: 'me',
      senderName: config.userName,
      senderAvatar: config.userAvatar,
      text: line,
      time: msgTime,
      readStatus: 'read',
    }));

    setLineThreads((prev) =>
      prev.map((t) => (t.id === chatId ? { ...t, messages: [...t.messages, ...newMsgs] } : t))
    );
    setLinePendingReply(null);

    // Progression logic for Keen POV
    if (pov === 'keen') {
      if (keenStep === 2 && chatId === 'clover-boys') {
        handleCloverProgressionStep2(text);
      } else if (keenStep === 5 && chatId === 'sea') {
        handleSeaProgressionStep5(text);
      } else if (keenStep === 6 && chatId === 'clover-boys') {
        handleCloverProgressionStep6(text);
      } else if (keenStep === 7 && chatId === 'ka-fluk') {
        handleKaFlukProgressionStep7(text);
      } else if (keenStep === 14 && chatId === 'clover-boys') {
        handleCloverProgressionStep14(text);
      } else if (keenStep === 16 && chatId === 'clover-boys') {
        handleCloverProgressionStep16(text);
      } else if (keenStep === 18 && chatId === 'sea') {
        handleSeaProgressionStep18(text);
      }
    } else if (pov === 'sea') {
      if (chatId === 'surf') {
        handleSurfProgression(text);
      } else if (chatId === 'bebeb-keen') {
        handleBebebKeenProgression(text);
      }
    }
  };

  // STEP 2 Clover Boys dialogue turns
  const handleCloverProgressionStep2 = (userText: string) => {
    if (userText.includes('Nggak tahu tuh')) {
      const resp = [
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'LAH WKWKWK', time: '07.03' },
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Kok malah nyuruh nanya ke orangnya? Emang lo nggak tahu?', time: '07.03' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Ya gak tahu.',
          placeholder: 'Ketik: Ya gak tahu.',
          time: '07.04',
        });
      });
    } else if (userText.includes('Ya gak tahu')) {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: '👀👀👀', time: '07.04' },
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Bentar, bentar. Kalian berdua lagi berantem kah?', time: '07.04' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Kagak, anjir. Dianya aja yang sibuk banget akhir-akhir ini.',
          placeholder: 'Ketik balasan...',
          time: '07.05',
        });
      });
    } else if (userText.includes('Kagak, anjir')) {
      const resp = [
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'Sibuk apaan? Perasaan kemarin gue liat dia online di discord dah', time: '07.05' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'NAH, BENER!', time: '07.06' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Orang kemaren aja gue sempet mabar sama dia dan Surf kemaren AWOKWOKWOK 🤣🤣🤣🤣', time: '07.06' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Nah, itu dia! Sekalinya punya waktu luang, bukannya nyari gue, malah dipake buat nge-game.',
          placeholder: 'Ketik balasan...',
          time: '07.08',
        });
      });
    } else if (userText.includes('Nah, itu dia!')) {
      const resp = [
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'WKWKWKWK KEEN', time: '07.08' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Apa?',
          placeholder: 'Ketik: Apa?',
          time: '07.09',
        });
      });
    } else if (userText.includes('Apa?')) {
      const resp = [
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'gak kenapa-kenapa. Lanjut, lanjut. 🍿', time: '07.09' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'ya gue bete aja jadinya sekarang',
          placeholder: 'Ketik balasan...',
          time: '07.10',
        });
      });
    } else if (userText.includes('ya gue bete')) {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Ya udah, lo chat aja duluan, Keen. Suruh dia sapa fansnya bentar. Kasian tuh udah pada kangen.', time: '07.10' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Males.',
          placeholder: 'Ketik: Males.',
          time: '07.11',
        });
      });
    } else if (userText.includes('Males.')) {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Lah, kenapa males? Tinggal chat doang, susah amat.', time: '07.11' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Chat gue yang tadi malam aja nggak dibales sampai sekarang.',
          placeholder: 'Ketik balasan...',
          time: '07.12',
        });
      });
    } else if (userText.includes('Chat gue yang tadi malam')) {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'WKWKWKWK ANJIRRR 😭😭😭', time: '07.13' },
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'HAHAHAHAHAHA! MAMPUS SEA!!', time: '07.13' },
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'JIRRR, INI MAH BUKAN SOAL FANS LAGI UDAH. ALAMAT ADA YANG DI SILENT TREATMENT LAGI INIH', time: '07.14' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Berisik, anjir. Gue cuma bilang fakta.',
          placeholder: 'Ketik balasan...',
          time: '07.15',
        });
      });
    } else if (userText.includes('Gue cuma bilang fakta')) {
      const resp = [
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Iya, iya, fakta. Tapi kok kayaknya ada yang ngambek, ya? 👀', time: '07.15' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Siapa yang ngambek?!',
          placeholder: 'Ketik: Siapa yang ngambek?!',
          time: '07.15',
        });
      });
    } else if (userText.includes('Siapa yang ngambek')) {
      const resp = [
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'WKWKWKWK', time: '07.16' },
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'Nggak ada yang nyebut nama, tapi udah sewot duluan.', time: '07.16' },
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Sabar, Keen. Nanti gue bantuin santet online si Sea biar dia langsung bales chat lo. 💀✨', time: '07.17' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'ANJIR, SANTET ONLINE.', time: '07.17' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Emang bisa?', time: '07.17' },
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'ya mana bisa lah pao!', time: '07.18' },
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'WKWKWK', time: '07.18' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Ya udah si', time: '07.19' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: '@keen tinggal chat aja dia lagi padahal', time: '07.19' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Bilang “Abdi sono pisan ka anjeun ” gitu', time: '07.20' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        // Step 2 finished. Wait until Keen exits chat room before triggering Step 3!
        setReadyForZoneXNotif(true);
      });
    }
  };

  // STEP 5 Sea morning chat turns
  const handleSeaProgressionStep5 = (userText: string) => {
    if (userText.includes('baru ingat aku')) {
      const resp = [
        {
          sender: 'sea',
          name: 'Sea',
          avatar: SEA_CONTACT.avatar,
          text: 'Hehehe... jujur banget nih, semalam aku kebablasan begadang maraton main game sampai subuh. Pas bangun kesiangan, baru sempat pegang HP sekarang',
          time: '07.23',
        },
        {
          sender: 'sea',
          name: 'Sea',
          avatar: SEA_CONTACT.avatar,
          image: 'https://i.pinimg.com/736x/7b/fe/d7/7bfed737f8f62cb8d34f18820d7ec4e3.jpg',
          text: '',
          time: '07.24',
        },
      ];
      addMessagesSequentially('sea', resp, () => {
        setLinePendingReply({
          chatId: 'sea',
          targetText: 'ga kaget sih 👍',
          placeholder: 'Ketik: ga kaget sih 👍',
          time: '07.24',
        });
      });
    } else if (userText.includes('ga kaget sih')) {
      const resp = [
        { sender: 'sea', name: 'Sea', avatar: SEA_CONTACT.avatar, text: 'Ehmmm sayang?🥺', time: '07.25' },
      ];
      addMessagesSequentially('sea', resp, () => {
        setLinePendingReply({
          chatId: 'sea',
          targetText: 'Nggak sekali dua kali kamu begini. Yaudah sih',
          placeholder: 'Ketik: Nggak sekali dua kali kamu begini. Yaudah sih',
          time: '07.25',
        });
      });
    } else if (userText.includes('Nggak sekali dua kali')) {
      const resp = [
        { sender: 'sea', name: 'Sea', avatar: SEA_CONTACT.avatar, text: 'sayang, jangan ngambek dong...', time: '07.26' },
        { sender: 'sea', name: 'Sea', avatar: SEA_CONTACT.avatar, text: 'Maaf yaa 😭 Janji deh nggak diulangi lagi!', time: '07.26' },
        { sender: 'sea', name: 'Sea', avatar: SEA_CONTACT.avatar, text: 'sayang?', time: '07.26' },
        { sender: 'sea', name: 'Sea', avatar: SEA_CONTACT.avatar, text: 'P', time: '07.28' },
        { sender: 'sea', name: 'Sea', avatar: SEA_CONTACT.avatar, text: 'sayang beneran marah ya? Maaf yanggg🙏🏻', time: '07.28' },
      ];
      addMessagesSequentially('sea', resp, () => {
        // Step 5 ends. Wait until Keen exits chat room before triggering CL🍀VER BOYS notification!
        setReadyForClover6Notif(true);
      });
    }
  };

  // STEP 6 Clover Boys turns
  const handleCloverProgressionStep6 = (userText: string) => {
    if (userText.includes('Gue nggak ngambek')) {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Iya, nggak ngambek', time: '07.31' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Cuma kesel karena chat nggak dibales ayangnya', time: '07.32' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'padahal lo terus merhatiin dia online di game dan discord, terus ngitungin kapan dia punya waktu luang buat lo. Gitu, kan? 🤭', time: '07.32' },
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'WKWKWKWK PAO, LO KALAU KASIH FAKTA JANGAN TERLALU DI GAS', time: '07.33' },
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Truee 🤣🤣🤣', time: '07.33' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: '🙄',
          placeholder: 'Kirim emoji: 🙄',
          time: '07.34',
        });
      });
    } else if (userText.trim() === '🙄') {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Nih ya gue cuma mengingatkan. Ntar kalau Sea habis ini beneran sibuk terus sampai nggak sempet nyariin lo dan lo nya juga nggak mau nyariin dia karena gengsi, terus lama-lama kalian jadi jarang ngobrol, gimana?', time: '07.34' },
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Betul. Ntar giliran dia beneran ilang dari peredaran, lo sendiri yang nangis di pojokan kamar, keen', time: '07.35' },
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'WKWKWK', time: '07.36' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Dih, ngapain juga gue nangis?',
          placeholder: 'Ketik: Dih, ngapain juga gue nangis?',
          time: '07.36',
        });
      });
    } else if (userText.includes('Dih, ngapain juga gue nangis')) {
      // Keen immediately sends second line
      setLinePendingReply({
        chatId: 'clover-boys',
        targetText: 'Emang gue peduli banget sama dia? 🙄',
        placeholder: 'Ketik: Emang gue peduli banget sama dia? 🙄',
        time: '07.37',
      });
    } else if (userText.includes('Emang gue peduli')) {
      const resp = [
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Oke, noted. Nggak peduli', time: '07.37' },
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'Ok siap si paling nggak peduli, tapi chat semalem belum dibales aja bikin dia gelisah sebenarnya WKWKWKWK.', time: '07.38' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Jangan-jangan dari tadi HP lo cek terus, ya? Siapa tau tiba-tiba ada notifikasi dari Sea gitu', time: '07.38' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'NGARANG LO SEMUA! 🫵',
          placeholder: 'Ketik: NGARANG LO SEMUA! 🫵',
          time: '07.39',
        });
      });
    } else if (userText.includes('NGARANG LO SEMUA')) {
      const resp = [
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'WKWKWK. Muka sih ngetik “nggak peduli”, tapi jari-jari pasti gercep ngecek HP tiap lima detik sekali.', time: '07.39' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'BERISIK!!!!!!',
          placeholder: 'Ketik: BERISIK!!!!!!',
          time: '07.40',
        });
      });
    } else if (userText === 'BERISIK!!!!!!') {
      const resp = [
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'WKWKWKWK LUCU BANGET, ANAK KUCING SATU INI 🤭', time: '07.41' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'ANAK KUCING NGAMBEKAN 🤣🤣🤣', time: '07.42' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'GUE MATIIN YA HAPE GUE!!!!',
          placeholder: 'Ketik: GUE MATIIN YA HAPE GUE!!!!',
          time: '07.42',
        });
      });
    } else if (userText.includes('GUE MATIIN YA HAPE')) {
      const resp = [
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Silakan, Yang Mulia. Tapi jangan lupa cek HP dulu sebelum dimatiin ya', time: '07.43' },
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Sapa tau Sea udah bales 🤭', time: '07.43' },
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'WKWKWKWK ANJIRRRR', time: '07.44' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'BERISIIKKK!!!!',
          placeholder: 'Ketik: BERISIIKKK!!!!',
          time: '07.44',
        });
      });
    } else if (userText.includes('BERISIIKKK')) {
      // Step 6 completed. Wait until Keen exits chat room before triggering Ka Fluk notification!
      setReadyForKaFluk7Notif(true);
    }
  };

  // STEP 7 Ka Fluk dialogue
  const handleKaFlukProgressionStep7 = (userText: string) => {
    if (userText.includes('iya ka?')) {
      const resp = [
        { sender: 'ka-fluk', name: 'Ka Fluk', avatar: '', text: 'apa lagi masalah lo sama Sea sekarang? 😫', time: '08.02' },
      ];
      addMessagesSequentially('ka-fluk', resp, () => {
        setLinePendingReply({
          chatId: 'ka-fluk',
          targetText: 'Nggak tahu tuh Kak',
          placeholder: 'Ketik: Nggak tahu tuh Kak',
          time: '08.02',
        });
      });
    } else if (userText.includes('Nggak tahu tuh Kak')) {
      // Keen mengirim bubble 08.03 satu per satu
      setLinePendingReply({
        chatId: 'ka-fluk',
        targetText: 'males banget gue',
        placeholder: 'Ketik: males banget gue',
        time: '08.03',
      });
    } else if (userText.includes('males banget gue')) {
      const resp = [
        { sender: 'ka-fluk', name: 'Ka Fluk', avatar: '', text: 'Kenapa lagi dia? Perasaan kemarin baik-baik aja.', time: '08.03' },
      ];
      addMessagesSequentially('ka-fluk', resp, () => {
        setLinePendingReply({
          chatId: 'ka-fluk',
          targetText: 'Kebiasaan, Kak. Dicariin dari semalem nggak ada kabar',
          placeholder: 'Ketik: Kebiasaan, Kak. Dicariin dari semalem nggak ada kabar',
          time: '08.04',
        });
      });
    } else if (userText.includes('Dicariin dari semalem') && !userText.includes('baru bales tadi')) {
      // Bubble kedua Keen di 08.04 masuk satu per satu
      setLinePendingReply({
        chatId: 'ka-fluk',
        targetText: 'baru bales tadi. Gara-gara begadang main game sampai subuh.',
        placeholder: 'Ketik: baru bales tadi. Gara-gara begadang main game sampai subuh.',
        time: '08.04',
      });
    } else if (userText.includes('baru bales tadi') && !userText.includes('nggak penting aja buat dia')) {
      // Bubble ketiga Keen di 08.04 masuk satu per satu
      setLinePendingReply({
        chatId: 'ka-fluk',
        targetText: 'gue ngerasa nggak penting aja buat dia',
        placeholder: 'Ketik: gue ngerasa nggak penting aja buat dia',
        time: '08.04',
      });
    } else if (userText.includes('nggak penting aja buat dia')) {
      const resp = [
        { sender: 'ka-fluk', name: 'Ka Fluk', avatar: '', text: 'Lah wkwk, emang Sea gak ada kapoknya ya kalau soal game.', time: '08.05' },
        { sender: 'ka-fluk', name: 'Ka Fluk', avatar: '', text: 'Terus sekarang lo diemin?', time: '08.05' },
      ];
      addMessagesSequentially('ka-fluk', resp, () => {
        setLinePendingReply({
          chatId: 'ka-fluk',
          targetText: 'Iya, gue read doang ka. Males ngerespons, biar dia mikir dulu',
          placeholder: 'Ketik: Iya, gue read doang ka. Males ngerespons, biar dia mikir dulu',
          time: '08.06',
        });
      });
    } else if (userText.includes('biar dia mikir dulu')) {
      const resp = [
        { sender: 'ka-fluk', name: 'Ka Fluk', avatar: '', text: 'tapi kalian ada jadwal bareng loh hari ini', time: '08.06' },
      ];
      addMessagesSequentially('ka-fluk', resp, () => {
        setLinePendingReply({
          chatId: 'ka-fluk',
          targetText: 'ya gapapa ka',
          placeholder: 'Ketik: ya gapapa ka',
          time: '08.07',
        });
      });
    } else if (userText.trim() === 'ya gapapa ka') {
      // Bubble kedua Keen di 08.07 masuk satu per satu
      setLinePendingReply({
        chatId: 'ka-fluk',
        targetText: 'paling ntar gue diemin aja dia',
        placeholder: 'Ketik: paling ntar gue diemin aja dia',
        time: '08.07',
      });
    } else if (userText.includes('paling ntar gue diemin')) {
      const resp = [
        { sender: 'ka-fluk', name: 'Ka Fluk', avatar: '', text: 'keen 😅', time: '08.07' },
      ];
      addMessagesSequentially('ka-fluk', resp, () => {
        // Step 7 ends. Wait until Keen exits messaging app before triggering incoming call from Sea!
        setReadyForSeaCall8(true);
      });
    }
  };

  // STEP 14 Clover boys reaction turns
  const handleCloverProgressionStep14 = (userText: string) => {
    if (userText === 'Apaan sih?') {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'KEENNNNNNNNNNN.', time: '18.18' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'APA?! 😡',
          placeholder: 'Ketik: APA?! 😡',
          time: '18.18',
        });
      });
    } else if (userText.includes('APA?! 😡')) {
      const resp = [
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'WKWKWKWK, SANTAI, KEEN. JANGAN GALAK-GALAK.', time: '18.19' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'BARCODE, ANJIR!',
          placeholder: 'Ketik: BARCODE, ANJIR!',
          time: '18.19',
        });
      });
    } else if (userText.includes('BARCODE, ANJIR')) {
      const resp = [
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Keen, coba deh lo lihat postingan Sea', time: '18.20' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Ngapain?',
          placeholder: 'Ketik: Ngapain?',
          time: '18.20',
        });
      });
    } else if (userText.includes('Ngapain?')) {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Ya dilihat aja, napa. Kecintaan kamuh upload sesuatu tuch 🤭', time: '18.21' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'bisa biasa aja nggak lo?',
          placeholder: 'Ketik: bisa biasa aja nggak lo?',
          time: '18.21',
        });
      });
    } else if (userText.includes('bisa biasa aja')) {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'nggak bisa sih bang 🙏', time: '18.22' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'CIH!',
          placeholder: 'Ketik: CIH!',
          time: '18.22',
        });
      });
    } else if (userText.includes('CIH!')) {
      const resp = [
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Udah, udah', time: '18.23' },
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Pokoknya buka X lo dulu keen, terus lihat postingannya.', time: '18.23' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: '... Udah kok',
          placeholder: 'Ketik: ... Udah kok',
          time: '18.23',
        });
      });
    } else if (userText.includes('... Udah kok')) {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'LAH?!', time: '18.24' },
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'BENTAR. JANGAN2 LO UDAH LIHAT DARI TADI YA?!', time: '18.24' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'BARU AJA KOK!',
          placeholder: 'Ketik: BARU AJA KOK!',
          time: '18.25',
        });
      });
    } else if (userText.includes('BARU AJA KOK')) {
      const resp = [
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Oke, terus menurut lo gimana postingannya?', time: '18.25' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Bagus',
          placeholder: 'Ketik: Bagus',
          time: '18.28',
        });
      });
    } else if (userText === 'Bagus') {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'BAGUS APANYA NIH? FOTONYA? CAPTION-NYA? ATAU ORANG YANG UPLOAD? 👀', time: '18.28' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Ya semuanya',
          placeholder: 'Ketik: Ya semuanya',
          time: '18.29',
        });
      });
    } else if (userText === 'Ya semuanya') {
      // Keen sends bubble kedua di 18.29 masuk satu per satu
      setLinePendingReply({
        chatId: 'clover-boys',
        targetText: 'EH, BUKAN! MAKSUD GUE, GUE JELAS BAGUS DI  FOTO2 ITU!',
        placeholder: 'Ketik: EH, BUKAN! MAKSUD GUE, GUE JELAS BAGUS DI  FOTO2 ITU!',
        time: '18.29',
      });
    } else if (userText.includes('EH, BUKAN!')) {
      const resp = [
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'WKWKWKWKWK ANJIRRRRR', time: '18.30' },
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'YA AMPUN, KEEN', time: '18.30' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'bilang aja kalau lo salting kocak', time: '18.32' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'GUE SALAH KETIK, ANJIR!',
          placeholder: 'Ketik: GUE SALAH KETIK, ANJIR!',
          time: '18.32',
        });
      });
    } else if (userText.includes('GUE SALAH KETIK')) {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'IYA, IYA. SALAH KETIK', time: '18.33' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'TAPI KOK SAMPE SALTING GITU SIH KAK ?', time: '18.33' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'SIAPA YANG SALTING?!',
          placeholder: 'Ketik: SIAPA YANG SALTING?!',
          time: '18.34',
        });
      });
    } else if (userText.includes('SIAPA YANG SALTING')) {
      const resp = [
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'LO, KEEN. LO! 🫵🫵', time: '18.34' },
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'WKWKWK', time: '18.35' },
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Udah, jangan diganggu terus. Kasihan, mukanya pasti udah merah sekarang 🤭', time: '18.35' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'MUKA GUE BIASA AJA!',
          placeholder: 'Ketik: MUKA GUE BIASA AJA!',
          time: '18.36',
        });
      });
    } else if (userText.includes('MUKA GUE BIASA AJA')) {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'BOHONG BANGET', time: '18.36' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'BERISIK ASLI!',
          placeholder: 'Ketik: BERISIK ASLI!',
          time: '18.38',
        });
      });
    } else if (userText.includes('BERISIK ASLI!')) {
      const resp = [
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'Eh, tapi serius. Lo udah maafin Sea belum?', time: '18.38' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        // Step 14 selesai -> Siap untuk Skenario 15 setelah Keen keluar dari obrolan grup CL🍀VER BOYS!
        setReadyForSea15Notif(true);
      });
    }
  };

  // STEP 16 Clover Boys deep talk turns
  const handleCloverProgressionStep16 = (userText: string) => {
    if (userText.includes('Emang gue harus maafin')) {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Ya haruslah, Keen. Masa gara-gara chat nggak dibales doang, lo mo ngambek terus?', time: '18.43' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Bukan cuma itu masalahnya.',
          placeholder: 'Ketik: Bukan cuma itu masalahnya.',
          time: '18.44',
        });
      });
    } else if (userText.includes('Bukan cuma itu masalahnya')) {
      const resp = [
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'Terus apa lagi?', time: '18.44' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Gue sebenarnya kesel nya itu karena dia main game sama Surf dan sampai chat gue ga di bales sama dia',
          placeholder: 'Ketik curhatan...',
          time: '18.45',
        });
      });
    } else if (userText.includes('karena dia main game sama Surf')) {
      // Keen mengirim bubble kedua di 18.45 satu per satu
      setLinePendingReply({
        chatId: 'clover-boys',
        targetText: 'berarti gue ga berarti apa2 buat dia',
        placeholder: 'Ketik: berarti gue ga berarti apa2 buat dia',
        time: '18.45',
      });
    } else if (userText.includes('berarti gue ga berarti apa2')) {
      const resp = [
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'WKWKWKWK, MASIH DIUNGKIT JUGA 😭😭😭', time: '18.46' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Lo cemburu ya karena Surf sempat jadi mantan partner nya Sea dulu??', time: '18.46' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'UGHH!',
          placeholder: 'Ketik: UGHH!',
          time: '18.46',
        });
      });
    } else if (userText.includes('UGHH!')) {
      const resp = [
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'CIEEEEE, CEMBURU DIAAAAA.', time: '18.47' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'BISA NGGAK SIH KALIAN JANGAN CIE-CIEIN GUE TERUS?!',
          placeholder: 'Ketik balasan...',
          time: '18.47',
        });
      });
    } else if (userText.includes('BISA NGGAK SIH')) {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'WKWKWK IYA, IYA. AMPUN, SAYANG.', time: '18.48' },
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Tapi beneran, Keen. Kalau lo masih kesel, bilang aja ke Sea. Jangan malah diem-dieman begini.', time: '18.48' },
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'Nah, setuju! Maafin aja dulu. Kalau masih ada yang bikin lo kesel, omongin baik-baik.', time: '18.48' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'LAGIAN NIH, DARIPADA LO CUMA BISA LIAT POSTINGAN DIA DI X TERUS SALTING SENDIRI, MENDING CHAT ORANGNYA. WKWKWKWK', time: '18.48' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'GUE NGGAK SALTING!',
          placeholder: 'Ketik: GUE NGGAK SALTING!',
          time: '18.49',
        });
      });
    } else if (userText.includes('GUE NGGAK SALTING')) {
      const resp = [
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Oke deh, nggak salting. Terus kenapa tiap nama Sea disebut disini, lo langsung muncul?', time: '18.49' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Itu karena kalian berisik banget di grup!',
          placeholder: 'Ketik balasan...',
          time: '18.50',
        });
      });
    } else if (userText.includes('kalian berisik banget')) {
      const resp = [
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'WKWKWK, ALASAN', time: '18.50' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: '😡😡😡😡',
          placeholder: 'Kirim emoji: 😡😡😡😡',
          time: '18.51',
        });
      });
    } else if (userText.includes('😡😡😡😡')) {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Keen, coba bayangin deh kalau Sea yang ngambek sama lo. Terus dia nggak mau bales chat lo dan nggak mau ngobrol sama lo lagi.', time: '18.51' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Lo bakal gimana?', time: '18.52' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Ya ... sedih sih.',
          placeholder: 'Ketik: Ya ... sedih sih.',
          time: '18.52',
        });
      });
    } else if (userText.includes('Ya ... sedih sih.')) {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'PFTTTT', time: '18.52' },
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'WWWWW', time: '18.53' },
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'ga habis pikir sama udang mungil ini 🤣', time: '18.53' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: '😑',
          placeholder: 'Kirim emoji: 😑',
          time: '18.53',
        });
      });
    } else if (userText.trim() === '😑') {
      const resp = [
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Ya udah, sana chat Sea dulu. Nanti kalau udah dibales, kabarin kita.', time: '18.55' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'Ngapain gue ngabarin kalian?!',
          placeholder: 'Ketik balasan...',
          time: '18.55',
        });
      });
    } else if (userText.includes('Ngapain gue ngabarin')) {
      const resp = [
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Biar kami bisa ikut bahagia melihat dua sejoli akhirnya baikan🥹💕', time: '18.56' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        setLinePendingReply({
          chatId: 'clover-boys',
          targetText: 'GUE BENCI KALIAN SEMUA ! 🫵🫵🫵',
          placeholder: 'Ketik: GUE BENCI KALIAN SEMUA ! 🫵🫵🫵',
          time: '18.56',
        });
      });
    } else if (userText.includes('GUE BENCI KALIAN')) {
      const resp = [
        { sender: 'barcode', name: 'Barcode', avatar: CLOVER_GROUP.members.barcode.avatar, text: 'IYA, IYA. KAMI JUGA SAYANG LO, KEEN 🥰', time: '18.57' },
        { sender: 'ashi', name: 'Ashi', avatar: CLOVER_GROUP.members.ashi.avatar, text: 'Semangat, anak kucing. Semoga chat-nya dibales sebelum lo tidur. 🤭', time: '18.57' },
        { sender: 'aungpao', name: 'Aungpao', avatar: CLOVER_GROUP.members.aungpao.avatar, text: 'Semoga aja Sea langsung bales. Kasihan anaknya udah kangen padahal itu, tapi gengsinya tinggi', time: '18.57' },
      ];
      addMessagesSequentially('clover-boys', resp, () => {
        // Step 16 completed -> Tunggu Keen keluar dari obrolan CL🍀VER BOYS baru muncul panggilan masuk Sea!
        setReadyForSeaCall17(true);
      });
    }
  };

  // STEP 18 Sea Graphic Card gift and surprise
  const handleSeaProgressionStep18 = (userText: string) => {
    if (userText.includes('Itu kamu beli?')) {
      const resp = [
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          text: 'Iyaaaa. Itu aku pesan online sih.',
          time: '21.01',
        },
      ];
      addMessagesSequentially('sea', resp, () => {
        setLinePendingReply({
          chatId: 'sea',
          targetText: 'ih aku iri bangetttt. Padahal aku kepengen beli itu dari lama',
          placeholder: 'Ketik: ih aku iri bangetttt. Padahal aku kepengen beli itu dari lama',
          time: '21.01',
        });
      });
    } else if (userText.includes('iri bangetttt')) {
      const resp = [
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          text: 'itu buat kamu kok',
          time: '21.02',
        },
      ];
      addMessagesSequentially('sea', resp, () => {
        setLinePendingReply({
          chatId: 'sea',
          targetText: 'hah? Aku ganti berapa ini? Boleh nyicil ga?',
          placeholder: 'Ketik: hah? Aku ganti berapa ini? Boleh nyicil ga?',
          time: '21.02',
        });
      });
    } else if (userText.includes('Boleh nyicil ga')) {
      const resp = [
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          text: 'apaan sih yang 🤣',
          time: '21.03',
        },
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          text: 'aku kan beli itu memang buat kamu',
          time: '21.03',
        },
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          text: 'jadi kita bisa mabar jadinya 🥰',
          time: '21.04',
        },
      ];
      addMessagesSequentially('sea', resp, () => {
        setLinePendingReply({
          chatId: 'sea',
          targetText: 'babyyyyyy sea 🥺💓',
          placeholder: 'Ketik: babyyyyyy sea 🥺💓',
          time: '21.04',
        });
      });
    } else if (userText.includes('babyyyyyy sea')) {
      // Keen types makasihhhh
      setLinePendingReply({
        chatId: 'sea',
        targetText: 'makasihhhh',
        placeholder: 'Ketik: makasihhhh',
        time: '21.05',
      });
    } else if (userText.includes('makasihhhh')) {
      // Add Keen cute photo
      const photoFromKeen: ChatMessage = {
        id: `keen-pic-${Date.now()}`,
        sender: 'me',
        senderName: 'Keen',
        senderAvatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
        image: 'https://i.pinimg.com/736x/a4/e4/48/a4e448853b34dee9745b05ddf4a2b4ba.jpg',
        time: '21.05',
      };
      setLineThreads((prev) =>
        prev.map((t) => (t.id === 'sea' ? { ...t, messages: [...t.messages, photoFromKeen] } : t))
      );

      const resp = [
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          text: 'gemeshhh banget cintaku cantikku lope lope aku 🥰',
          time: '21.05',
        },
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          image: 'https://i.pinimg.com/1200x/2c/68/13/2c681315ce90fedf86ac9524045fac7c.jpg',
          time: '21.06',
        },
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          text: 'nanti kalau barangnya sampai kita rakit bareng di PC kamu terus mabar yaaaa 😘',
          time: '21.06',
        },
      ];
      addMessagesSequentially('sea', resp, () => {
        setLinePendingReply({
          chatId: 'sea',
          targetText: 'iyaaa baby 😘',
          placeholder: 'Ketik: iyaaa baby 😘',
          time: '21.07',
        });
      });
    } else if (userText.includes('iyaaa baby 😘')) {
      const resp = [
        {
          sender: 'sea',
          name: 'Sea 🦦💕',
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          text: 'kamu jangan bobo dulu ya cantik... stay awake yaaa~ 🤫❤️',
          time: '21.07',
        },
      ];
      addMessagesSequentially('sea', resp, () => {
        setReadyForSeaCall19(true);
      });
    }
  };

  // SEA UNIVERSE: Chat with Surf
  const handleSurfProgression = (userText: string) => {
    if (userText.includes('apa itu galau')) {
      const resp = [
        {
          sender: 'surf',
          name: 'Surf',
          avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
          text: 'gaya lu! Padahal tadi aja dah mau nangis gara2 didiemin Keen 🤣',
          time: '23.02',
        },
      ];
      addMessagesSequentially('surf', resp, () => {
        setLinePendingReply({
          chatId: 'surf',
          targetText: 'Itu mah tadi. Sekarang gue sudah jadi the most happiest man enih!',
          placeholder: 'Ketik: Itu mah tadi...',
          time: '23.02',
        });
      });
    } else if (userText.includes('the most happiest man')) {
      const resp = [
        {
          sender: 'surf',
          name: 'Surf',
          avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
          text: 'wwwwwwww',
          time: '23.02',
        },
        {
          sender: 'surf',
          name: 'Surf',
          avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
          text: 'Btw kalian pergi kemana itu?',
          time: '23.02',
        },
      ];
      addMessagesSequentially('surf', resp, () => {
        setLinePendingReply({
          chatId: 'surf',
          targetText: 'Oh itu barusan diajakin bebeb akuh makan malam ~',
          placeholder: 'Ketik: Oh itu barusan diajakin bebeb akuh makan malam ~',
          time: '23.03',
        });
      });
    } else if (userText.includes('Oh itu barusan diajakin bebeb akuh makan malam ~')) {
      const resp = [
        {
          sender: 'surf',
          name: 'Surf',
          avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
          text: 'Halah bucin amat wkwk',
          time: '23.03',
        },
        {
          sender: 'surf',
          name: 'Surf',
          avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
          text: 'Tapi beneran cuma makan di luar?',
          time: '23.03',
        },
        {
          sender: 'surf',
          name: 'Surf',
          avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
          text: 'kok saya ragu ya bacanya',
          time: '23.04',
        },
        {
          sender: 'surf',
          name: 'Surf',
          avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
          text: 'Yakin nih gak ada agenda tersembunyi lain? 🧐',
          time: '23.04',
        },
      ];
      addMessagesSequentially('surf', resp, () => {
        setLinePendingReply({
          chatId: 'surf',
          targetText: 'Jujur mah gue mager banget keluar sebenernya wkwk',
          placeholder: 'Ketik: Jujur mah gue mager banget keluar sebenernya wkwk',
          time: '23.05',
        });
      });
    } else if (userText.includes('mager banget keluar sebenernya')) {
      setLinePendingReply({
        chatId: 'surf',
        targetText: 'Maunya anteng cuddling aja di kamar sama dia 🤤',
        placeholder: 'Ketik: Maunya anteng cuddling aja di kamar sama dia 🤤',
        time: '23.05',
      });
    } else if (userText.includes('cuddling aja di kamar sama dia')) {
      setLinePendingReply({
        chatId: 'surf',
        targetText: 'Tapi Keen-nya paranoid duluan, takut gue macem-macem kalo di kamar',
        placeholder: 'Ketik: Tapi Keen-nya paranoid duluan...',
        time: '23.06',
      });
    } else if (userText.includes('paranoid duluan')) {
      setLinePendingReply({
        chatId: 'surf',
        targetText: 'Makanya dia ngajak makan keluar aja biar aman katanya',
        placeholder: 'Ketik: Makanya dia ngajak makan keluar aja biar aman katanya',
        time: '23.06',
      });
    } else if (userText.includes('ngajak makan keluar aja biar aman')) {
      const resp = [
        {
          sender: 'surf',
          name: 'Surf',
          avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
          text: 'Wkwkwkwk anjir Keen tau aja akal bulus lu! 😂',
          time: '23.07',
        },
        {
          sender: 'surf',
          name: 'Surf',
          avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
          text: 'Berarti fix malam ini lu beneran cuma makan malem terus pulang dong?',
          time: '23.07',
        },
      ];
      addMessagesSequentially('surf', resp, () => {
        setLinePendingReply({
          chatId: 'surf',
          targetText: 'Enggak lah wkwk',
          placeholder: 'Ketik: Enggak lah wkwk',
          time: '23.08',
        });
      });
    } else if (userText === 'Enggak lah wkwk') {
      setLinePendingReply({
        chatId: 'surf',
        targetText: 'Rencana dia sih gitu, cuma makan di luar aja tadi, tapi kalau gue kan orangnya tetap sama pendirian gue boss 😎',
        placeholder: 'Ketik: Rencana dia sih gitu...',
        time: '23.08',
      });
    } else if (userText.includes('tetap sama pendirian gue')) {
      setLinePendingReply({
        chatId: 'surf',
        targetText: 'ini aja pulang dari tmpt makan, gue maksa utk bisa nginep di tempat dia hehehe 😏✨',
        placeholder: 'Ketik: ini aja pulang dari tmpt makan...',
        time: '23.09',
      });
    } else if (userText.includes('maksa utk bisa nginep')) {
      const resp = [
        {
          sender: 'surf',
          name: 'Surf',
          avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
          text: 'wkwkwk kasihan banget Keen dapet pacar modelan kaya begini 😭👍',
          time: '23.09',
        },
        {
          sender: 'surf',
          name: 'Surf',
          avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
          text: 'Yaudah deh met pacaran yak, awas aja lo ngajak mabar lagi gue dan gue di seret2 drama lo lagi',
          time: '23.10',
        },
      ];
      addMessagesSequentially('surf', resp, () => {
        setLinePendingReply({
          chatId: 'surf',
          targetText: 'Wkwk tenang, gue udah kapok',
          placeholder: 'Ketik: Wkwk tenang, gue udah kapok',
          time: '23.10',
        });
      });
    } else if (userText.includes('udah kapok')) {
      setLinePendingReply({
        chatId: 'surf',
        targetText: 'Habis ini malahan gue bakal sering ngajak mabar my cintah gueh ketimbang sama lo',
        placeholder: 'Ketik: Habis ini malahan gue bakal sering ngajak mabar...',
        time: '23.10',
      });
    } else if (userText.includes('my cintah gueh')) {
      const resp = [
        {
          sender: 'surf',
          name: 'Surf',
          avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
          text: 'syukur deh. Gue jadi pnya banyak waktu jadinya sama my Java 🥰',
          time: '23.11',
        },
      ];
      addMessagesSequentially('surf', resp, () => {
        setLinePendingReply({
          chatId: 'surf',
          targetText: '📷 [Kirim Foto Mesra]',
          placeholder: 'Kirim foto mesra: 📷 [Kirim Foto Mesra]',
          time: '23.11',
        });
      });
    } else if (userText.includes('Kirim Foto Mesra') || (userText.includes('📷') && activeLineChatId === 'surf')) {
      const photoMsg: ChatMessage = {
        id: `surf-pic-${Date.now()}`,
        sender: 'me',
        senderName: 'Sea',
        senderAvatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
        image: 'https://i.pinimg.com/736x/bd/ba/cf/bdbacfa22e33b807eaa45cb365867e4b.jpg',
        time: '23.11',
      };
      setLineThreads((prev) =>
        prev.map((t) => (t.id === 'surf' ? { ...t, messages: [...t.messages, photoMsg] } : t))
      );

      const resp = [
        {
          sender: 'surf',
          name: 'Surf',
          avatar: 'https://i.pinimg.com/736x/10/85/f1/1085f1683e2951274108f60a6897feac.jpg',
          text: 'PAMER NIH BOCAH!!!',
          time: '23.12',
        },
      ];
      addMessagesSequentially('surf', resp, () => {
        // Step 2 complete -> Tunggu Sea keluar dari obrolan Surf baru muncul notif Bebeb Keen!
        setReadyForBebebKeenNotif(true);
      });
    }
  };

  // SEA UNIVERSE: Chat with My bebeb Keen
  const handleBebebKeenProgression = (userText: string) => {
    if (userText.includes('mau nginap disini')) {
      const resp = [
        {
          sender: 'keen',
          name: 'My bebeb Keen akuh',
          avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
          text: 'Kamu kan udah ketemu aku, udah balik aja ya',
          time: '23.15',
        },
      ];
      addMessagesSequentially('bebeb-keen', resp, () => {
        setLinePendingReply({
          chatId: 'bebeb-keen',
          targetText: 'Ga mauuuuu',
          placeholder: 'Ketik: Ga mauuuuu',
          time: '23.15',
        });
      });
    } else if (userText === 'Ga mauuuuu') {
      setLinePendingReply({
        chatId: 'bebeb-keen',
        targetText: 'Eh itu kamu sampai kapan sih di kamar mandi mulu?',
        placeholder: 'Ketik: Eh itu kamu sampai kapan sih di kamar mandi mulu?',
        time: '23.15',
      });
    } else if (userText.includes('di kamar mandi mulu')) {
      setLinePendingReply({
        chatId: 'bebeb-keen',
        targetText: 'Udah setengah jam loh itu',
        placeholder: 'Ketik: Udah setengah jam loh itu',
        time: '23.16',
      });
    } else if (userText.includes('Udah setengah jam loh')) {
      setLinePendingReply({
        chatId: 'bebeb-keen',
        targetText: 'aku kan kesepian disini 🥲',
        placeholder: 'Ketik: aku kan kesepian disini 🥲',
        time: '23.17',
      });
    } else if (userText.includes('kesepian disini')) {
      setLinePendingReply({
        chatId: 'bebeb-keen',
        targetText: '📷 [Kirim Foto Kesepian]',
        placeholder: 'Kirim foto kesepian: 📷 [Kirim Foto Kesepian]',
        time: '23.17',
      });
    } else if (userText.includes('Kirim Foto Kesepian') || (userText.includes('📷') && activeLineChatId === 'bebeb-keen')) {
      const photoMsg: ChatMessage = {
        id: `keen-pic-${Date.now()}`,
        sender: 'me',
        senderName: 'Sea',
        senderAvatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
        image: 'https://i.pinimg.com/736x/36/8c/dc/368cdc8988b8b981b0d149c628f705d6.jpg',
        time: '23.17',
      };
      setLineThreads((prev) =>
        prev.map((t) => (t.id === 'bebeb-keen' ? { ...t, messages: [...t.messages, photoMsg] } : t))
      );

      const resp = [
        {
          sender: 'keen',
          name: 'My bebeb Keen akuh',
          avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
          text: 'Bodo amat! Kamu ga mau balik soalnya 😡',
          time: '23.18',
        },
      ];
      addMessagesSequentially('bebeb-keen', resp, () => {
        setLinePendingReply({
          chatId: 'bebeb-keen',
          targetText: 'Hahaha, gemes banget sih dikunciin dari dalam',
          placeholder: 'Ketik: Hahaha, gemes banget sih dikunciin dari dalam',
          time: '23.18',
        });
      });
    } else if (userText.includes('dikunciin dari dalam')) {
      setLinePendingReply({
        chatId: 'bebeb-keen',
        targetText: 'Emang kamu gak capek didalam terus?',
        placeholder: 'Ketik: Emang kamu gak capek didalam terus?',
        time: '23.19',
      });
    } else if (userText.includes('didalam terus')) {
      setLinePendingReply({
        chatId: 'bebeb-keen',
        targetText: 'Sini keluar dong, sayang... kangen nih. 🥰',
        placeholder: 'Ketik: Sini keluar dong, sayang... kangen nih. 🥰',
        time: '23.19',
      });
    } else if (userText.includes('Sini keluar dong, sayang')) {
      const resp = [
        {
          sender: 'keen',
          name: 'My bebeb Keen akuh',
          avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
          text: 'GAK MAU! PULANG AJA SANA!',
          time: '23.20',
        },
      ];
      addMessagesSequentially('bebeb-keen', resp, () => {
        setLinePendingReply({
          chatId: 'bebeb-keen',
          targetText: 'kok gitu…',
          placeholder: 'Ketik: kok gitu…',
          time: '23.20',
        });
      });
    } else if (userText === 'kok gitu…') {
      const resp = [
        {
          sender: 'keen',
          name: 'My bebeb Keen akuh',
          avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
          text: 'Lu tuh ya! Dari tadi demen banget nyari kesempatan dalam kesempitan! 😤 paan sih tadi cium2!',
          time: '23.20',
        },
      ];
      addMessagesSequentially('bebeb-keen', resp, () => {
        setLinePendingReply({
          chatId: 'bebeb-keen',
          targetText: 'tiba2 banget pakai lo gue sekarang 🥲',
          placeholder: 'Ketik: tiba2 banget pakai lo gue sekarang 🥲',
          time: '23.22',
        });
      });
    } else if (userText.includes('pakai lo gue sekarang')) {
      const resp = [
        {
          sender: 'keen',
          name: 'My bebeb Keen akuh',
          avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
          text: 'bacot',
          time: '23.22',
        },
      ];
      addMessagesSequentially('bebeb-keen', resp, () => {
        setLinePendingReply({
          chatId: 'bebeb-keen',
          targetText: 'kan wajar dong sayang, kan pacar sendiri. Aku kan gemes banget kalau liat pipi kamu yang suka merah merona tiap kali aku ciumin',
          placeholder: 'Ketik: kan wajar dong sayang, kan pacar sendiri...',
          time: '23.22',
        });
      });
    } else if (userText.includes('suka merah merona')) {
      setLinePendingReply({
        chatId: 'bebeb-keen',
        targetText: 'Makanya aku gak bisa nahan diri buat meluk sama ciumin kamu terus 🤤😘',
        placeholder: 'Ketik: Makanya aku gak bisa nahan diri...',
        time: '23.23',
      });
    } else if (userText.includes('ciumin kamu terus')) {
      const resp = [
        {
          sender: 'keen',
          name: 'My bebeb Keen akuh',
          avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
          text: 'Ah cium-cium mulu! Bibir gue jontor tau gak gara-gara lu ciumin terus! 😡',
          time: '23.23',
        },
        {
          sender: 'keen',
          name: 'My bebeb Keen akuh',
          avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
          text: 'Lu kira bibir gue es krim apa, dijilatin mulu?!',
          time: '23.24',
        },
      ];
      addMessagesSequentially('bebeb-keen', resp, () => {
        setLinePendingReply({
          chatId: 'bebeb-keen',
          targetText: 'Hahaha! Soalnya manis sih, makanya nagih 🤤🤤🤤 ayo keluar dong dari sana',
          placeholder: 'Ketik: Hahaha! Soalnya manis sih, makanya nagih...',
          time: '23.24',
        });
      });
    } else if (userText.includes('Soalnya manis sih')) {
      const resp = [
        {
          sender: 'keen',
          name: 'My bebeb Keen akuh',
          avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
          text: 'Lu janji dulu beneran gak bakal langsung nyosor pas gue buka pintu!',
          time: '23.25',
        },
      ];
      addMessagesSequentially('bebeb-keen', resp, () => {
        setLinePendingReply({
          chatId: 'bebeb-keen',
          targetText: 'Mana bisa janji gitu? Liat muka kamu aja iman aku langsung goyah, Ayang... 🤭',
          placeholder: 'Ketik: Mana bisa janji gitu?...',
          time: '23.25',
        });
      });
    } else if (userText.includes('iman aku langsung goyah')) {
      const resp = [
        {
          sender: 'keen',
          name: 'My bebeb Keen akuh',
          avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
          text: 'TUH KAN! Ah, mending gue tidur aja disini! 😭✋',
          time: '23.26',
        },
      ];
      addMessagesSequentially('bebeb-keen', resp, () => {
        setLinePendingReply({
          chatId: 'bebeb-keen',
          targetText: 'Yaudah kalau gak mau keluar...',
          placeholder: 'Ketik: Yaudah kalau gak mau keluar...',
          time: '23.26',
        });
      });
    } else if (userText === 'Yaudah kalau gak mau keluar...') {
      setLinePendingReply({
        chatId: 'bebeb-keen',
        targetText: 'Pintu kamar mandi kamu tinggal aku dobrak aja',
        placeholder: 'Ketik: Pintu kamar mandi kamu tinggal aku dobrak aja',
        time: '23.27',
      });
    } else if (userText.includes('Pintu kamar mandi kamu tinggal aku dobrak')) {
      setLinePendingReply({
        chatId: 'bebeb-keen',
        targetText: 'Kalau pintu nya ga di buka sampai hitungan ketiga, aku benaran dobrak ya',
        placeholder: 'Ketik: Kalau pintu nya ga di buka sampai hitungan ketiga...',
        time: '23.27',
      });
    } else if (userText.includes('sampai hitungan ketiga')) {
      const resp = [
        {
          sender: 'keen',
          name: 'My bebeb Keen akuh',
          avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
          text: 'Sea',
          time: '23.28',
        },
      ];
      addMessagesSequentially('bebeb-keen', resp, () => {
        setLinePendingReply({
          chatId: 'bebeb-keen',
          targetText: 'satu…',
          placeholder: 'Ketik: satu…',
          time: '23.28',
        });
      });
    } else if (userText === 'satu…') {
      const resp = [
        {
          sender: 'keen',
          name: 'My bebeb Keen akuh',
          avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
          text: 'ASDSFASFSKFK',
          time: '23.28',
        },
      ];
      addMessagesSequentially('bebeb-keen', resp, () => {
        setLinePendingReply({
          chatId: 'bebeb-keen',
          targetText: 'Dua…',
          placeholder: 'Ketik: Dua…',
          time: '23.30',
        });
      });
    } else if (userText === 'Dua…' || userText === 'Dua..') {
      const resp = [
        {
          sender: 'keen',
          name: 'My bebeb Keen akuh',
          avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
          text: 'EHH JANGAN GILA YA!',
          time: '23.30',
        },
      ];
      addMessagesSequentially('bebeb-keen', resp, () => {
        setLinePendingReply({
          chatId: 'bebeb-keen',
          targetText: 'ti..',
          placeholder: 'Ketik: ti..',
          time: '23.31',
        });
      });
    } else if (userText.startsWith('ti')) {
      const resp = [
        {
          sender: 'keen',
          name: 'My bebeb Keen akuh',
          avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
          text: 'IYA IYA!!',
          time: '23.31',
        },
        {
          sender: 'keen',
          name: 'My bebeb Keen akuh',
          avatar: 'https://i.pinimg.com/736x/e9/f8/e8/e9f8e81975662a13c7161b3d07a2a01d.jpg',
          text: 'NIH GUE KELUAR! AWAS LOH YA KALAU BERANI NYOSOR LAGI, GUE SIRAM PAKE AIR!! 🤬🚿',
          time: '23.31',
        },
      ];
      addMessagesSequentially('bebeb-keen', resp, () => {
        setLinePendingReply({
          chatId: 'bebeb-keen',
          targetText: '😇🙏',
          placeholder: 'Ketik: 😇🙏',
          time: '23.31',
        });
      });
    } else if (userText === '😇🙏') {
      // ✨ THE END OF SEA STORY ✨
      setTimeout(() => {
        sound.playNotification();
        setShowEndModal(true);
      }, 1200);
    }
  };

  // USER SENDS REPLY IN X APP
  const handleXPostReply = (postId: string, text: string) => {
    sound.playMessageSent();
    const targetPost = xPosts.find((p) => p.id === postId);
    const replyTargetHandle = targetPost ? targetPost.handle : '@seakeen_zone';
    const isReplyingToSea = text.includes('kok kamu disini');

    const myReply: XPost = {
      id: `rep-${Date.now()}`,
      author: config.userName,
      handle: config.userHandle,
      avatar: config.xProfileAvatar,
      content: text,
      time: 'Baru saja',
      likes: '142',
      reposts: '32',
      isReplyingTo: isReplyingToSea ? '@seatalay' : replyTargetHandle,
    };

    setXPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [...(p.replies || []), myReply],
          };
        }
        return p;
      })
    );
    setXPendingReply(null);

    // Flow for Keen Step 3: Replying to @seakeen_zone
    if (pov === 'keen' && keenStep === 3) {
      if (text.includes('nggak tau mom') || text.includes('Chat aku aja nggak dibalas')) {
        // Keen replied to @seakeen_zone!
        // Wait until Keen exits app X before delivering the fan repost notifications!
        setReadyForRepostXNotif(true);
      } else if (text.includes('aku baik kokkk mom')) {
        setTimeout(() => {
          const zoneFollowUp: XPost = {
            id: `rep-zone-${Date.now()}`,
            author: 'SeaKeen Zone',
            handle: '@seakeen_zone',
            avatar: 'https://i.pinimg.com/736x/63/7c/c2/637cc2a74c919e69911362ece9741303.jpg',
            content: 'aaa kaget dibales Keen 😭. Pac- eh itu temen kamu si laut mana? @keenkeno',
            time: 'Baru saja',
            likes: '450',
            reposts: '89',
            isReplyingTo: '@keenkeno',
          };
          setXPosts((prev) =>
            prev.map((p) =>
              p.id === postId ? { ...p, replies: [...(p.replies || []), zoneFollowUp] } : p
            )
          );
          triggerNotification({
            id: `notif-zone-reply-${Date.now()}`,
            app: 'x',
            targetApp: 'x',
            title: 'X · @seakeen_zone',
            body: 'aaa kaget dibales Keen 😭. Pac- eh itu temen kamu si laut mana? @keenkeno',
            avatar: 'https://i.pinimg.com/736x/63/7c/c2/637cc2a74c919e69911362ece9741303.jpg',
            time: 'Baru saja',
          });

          setXPendingReply({
            postId: 'post-zone',
            targetText: 'nggak tau mom. Chat aku aja nggak dibalas~ sibuk main game kayaknya. Coba tanyain langsung ke orangnya ya @seatalay',
            placeholder: 'Ketik balasan...',
          });
        }, 1200);
      }
    }

    // Flow for Keen Step 9: Replying to @blue_sky99
    if (pov === 'keen' && keenStep === 9) {
      if (text.includes('biarin aja mom')) {
        setTimeout(() => {
          // Sea replies to Keen
          const seaReply: XPost = {
            id: `rep-sea-${Date.now()}`,
            author: 'Sea Dechchart',
            handle: '@seatalay',
            avatar: 'https://pbs.twimg.com/profile_images/2115423123776610304/ZblO-Oj5_400x400.jpg',
            content: 'nggak kok. Aku juga sering kok fotoin kamuuuu',
            time: 'Baru saja',
            likes: '2.1K',
            reposts: '890',
            isReplyingTo: '@keenkeno',
          };
          setXPosts((prev) =>
            prev.map((p) =>
              p.id === postId ? { ...p, replies: [...(p.replies || []), seaReply] } : p
            )
          );

          triggerNotification({
            id: `notif-sea-reply-${Date.now()}`,
            app: 'x',
            targetApp: 'x',
            title: 'X · @seatalay',
            body: 'membalas @keenkeno: nggak kok. Aku juga sering kok fotoin kamuuuu',
            avatar: 'https://pbs.twimg.com/profile_images/2115423123776610304/ZblO-Oj5_400x400.jpg',
            time: 'Baru saja',
          });

          setXPendingReply({
            postId: 'post-blue-sky',
            targetText: 'kok kamu disini? main game aja lagi sana. Kan biasanya ketemu aku juga kamu main game di hp kamu',
            placeholder: 'Ketik balasan...',
          });
        }, 1200);
      } else if (text.includes('kok kamu disini? main game aja lagi')) {
        setTimeout(() => {
          // Fans reply in thread replying to @keenkeno @seatalay
          const fanReplies: XPost[] = [
            {
              id: `f1-${Date.now()}`,
              author: 'Matcha Sea 🍵',
              handle: '@matchasea',
              avatar: 'https://i.pinimg.com/736x/2d/5b/a3/2d5ba309332ca4786ec2a87877abded8.jpg',
              content: `Fix ini mah Keno lagi ngambek wkwkwk! Mana bilangnya 'biarin aja mom' lagi 😭😂" @keenkeno @seatalay`,
              time: 'Baru saja',
              likes: '890',
              reposts: '210',
              isReplyingTo: '@keenkeno @seatalay',
            },
            {
              id: `f2-${Date.now()}`,
              author: 'SeaKeen Nation ✨',
              handle: '@seakeenation',
              avatar: 'https://i.pinimg.com/736x/87/03/a3/8703a3158a932964d7bcee9823cbe483.jpg',
              content: ` NAH KAN! Kalo emang sering fotoin, terus MANA FOTO-FOTONYA SEA?? Kenapa ga pernah diupload di X? Spill sekarang juga! 👀@keenkeno @seatalay`,
              time: 'Baru saja',
              likes: '1.2K',
              reposts: '450',
              isReplyingTo: '@keenkeno @seatalay',
            },
            {
              id: `f3-${Date.now()}`,
              author: 'Galeri Sea 📸',
              handle: '@galeri_sea',
              avatar: 'https://i.pinimg.com/736x/9c/71/88/9c718816460f14d9fd9e48ec314f651a.jpg',
              content: `Ditunggu bukti konkretnya ya Sea!! Kalo ga diupload berarti lu boong kata Keno wkwkwk 📸🤌 @keenkeno @seatalay`,
              time: 'Baru saja',
              likes: '1.5K',
              reposts: '580',
              isReplyingTo: '@keenkeno @seatalay',
            },
          ];
          setXPosts((prev) =>
            prev.map((p) =>
              p.id === postId ? { ...p, replies: [...(p.replies || []), ...fanReplies] } : p
            )
          );
          sound.playNotification();

          // Notifikasi dari fans yang langsung membalas postingan
          triggerNotification({
            id: `notif-matcha-${Date.now()}`,
            app: 'x',
            targetApp: 'x',
            title: 'X · @matchasea',
            body: "membalas @keenkeno @seatalay: Fix ini mah Keno lagi ngambek wkwkwk! Mana bilangnya 'biarin aja mom' lagi 😭😂",
            avatar: 'https://i.pinimg.com/736x/2d/5b/a3/2d5ba309332ca4786ec2a87877abded8.jpg',
            time: 'Baru saja',
          });
          setTimeout(() => {
            triggerNotification({
              id: `notif-seakeenation-${Date.now()}`,
              app: 'x',
              targetApp: 'x',
              title: 'X · @seakeenation',
              body: 'membalas @keenkeno @seatalay: NAH KAN! Kalo emang sering fotoin, terus MANA FOTO-FOTONYA SEA?? Kenapa ga pernah diupload di X? Spill sekarang juga! 👀',
              avatar: 'https://i.pinimg.com/736x/87/03/a3/8703a3158a932964d7bcee9823cbe483.jpg',
              time: 'Baru saja',
            });
          }, 600);
          setTimeout(() => {
            triggerNotification({
              id: `notif-galeri-${Date.now()}`,
              app: 'x',
              targetApp: 'x',
              title: 'X · @galeri_sea',
              body: 'membalas @keenkeno @seatalay: Ditunggu bukti konkretnya ya Sea!! Kalo ga diupload berarti lu boong kata Keno wkwkwk 📸🤌',
              avatar: 'https://i.pinimg.com/736x/9c/71/88/9c718816460f14d9fd9e48ec314f651a.jpg',
              time: 'Baru saja',
            });
          }, 1200);

          // Tunggu Keen keluar dari app X dulu, baru muncul notif di X lagi (Skenario 10)!
          setReadyForStep10Notif(true);
        }, 1200);
      }
    }

    // Flow for Sea Step 1: Replying to Keen's rich handsome man post
    if (pov === 'sea') {
      if (text.includes('tinggal nunggu barangnya nyampe')) {
        setTimeout(() => {
          const keenReplyToSea: XPost = {
            id: `rep-k-${Date.now()}`,
            author: 'Keen Suvijak',
            handle: '@keenkeno',
            avatar: 'https://pbs.twimg.com/profile_images/2088460965713170432/YOnV9V6c_400x400.jpg',
            content: 'aku bisa nyetir kerumah kamu kok nanti~',
            time: 'Baru saja',
            likes: '3.4K',
            reposts: '1.1K',
            isReplyingTo: '@seatalay',
          };
          setXPosts((prev) =>
            prev.map((p) => ({
              ...p,
              replies: [...(p.replies || []), keenReplyToSea],
            }))
          );

          triggerNotification({
            id: `notif-keen-reply-${Date.now()}`,
            app: 'x',
            targetApp: 'x',
            title: 'X · @keenkeno',
            body: 'membalas @seatalay: aku bisa nyetir kerumah kamu kok nanti~',
            avatar: 'https://pbs.twimg.com/profile_images/2088460965713170432/YOnV9V6c_400x400.jpg',
            time: 'Baru saja',
          });

          // Skenario 2: Setelah keluar dari app X, baru muncul notif pesan masuk dari Surf!
          setReadyForSurfNotif(true);
        }, 1500);
      }
    }
  };

  // Reject Call Handler in Step 8 & Step 17
  const handleCallReject = () => {
    setIsCallScreenOpen(false);
    if (keenStep === 17 || keenStep === 19) {
      // Skenario 17 & 19: setiap panggilannya di tolak, Sea 🦦💕 akan telpon lagi sampai Keno angkat telponnya atau sampai Keno tekan tombol hijau
      setTimeout(() => {
        setIsCallScreenOpen(true);
      }, 1500);
      return;
    }
    if (keenStep === 8) {
      const nextReject = callRejectCount + 1;
      setCallRejectCount(nextReject);

      let msgTexts: { text: string; time: string }[] = [];
      if (nextReject === 1) {
        msgTexts = [{ text: 'sayang angkat dongg🥺', time: '08.09' }];
      } else if (nextReject === 2) {
        msgTexts = [{ text: 'huhuhu kok di reject sih, sayang? 😭', time: '08.11' }];
      } else if (nextReject === 3) {
        msgTexts = [
          { text: 'sayang kita kan ada jadwal barengan hari ini', time: '08.13' },
          { text: 'masa kita ketemu nya pas lagi berantem sih', time: '08.13' },
        ];
      } else {
        msgTexts = [{ text: 'sayangggggg 😭😭😭😭😭', time: '08.15' }];
      }

      // Sea mengirim pesan bujukan masuk satu per satu
      setTimeout(() => {
        triggerNotification({
          id: `notif-sea-call-rej-${Date.now()}`,
          app: 'line',
          targetApp: 'line',
          targetChatId: 'sea',
          title: 'LINE · Sea 🦦💕',
          body: msgTexts[0].text,
          avatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
          time: msgTexts[0].time,
        });

        const script = msgTexts.map((m) => ({
          sender: 'sea',
          name: 'Sea',
          avatar: SEA_CONTACT.avatar,
          text: m.text,
          time: m.time,
        }));

        addMessagesSequentially('sea', script, () => {
          // Skenario 8: Tunggu Keen masuk ke obrolan pesan Sea dan baca, baru panggilan masuk lagi!
          if (nextReject < 4) {
            setWaitingForSeaRead(nextReject);
          } else {
            // Finished Step 8 (4 panggilan selesai) -> Tunggu Keen keluar dari app pesan dulu baru muncul notif X skenario 9!
            setWaitingForSeaRead(null);
            setReadyForStep9Notif(true);
          }
        });
      }, 700);
    }
  };

  // Step 8: Trigger panggilan masuk berikutnya setelah Keen masuk ke obrolan pesan Sea 🦦💕 dan membacanya
  useEffect(() => {
    if (pov === 'keen' && keenStep === 8 && waitingForSeaRead !== null) {
      if (activeApp === 'line' && activeLineChatId === 'sea' && !isCallScreenOpen) {
        // Keen berada di dalam obrolan Sea 🦦💕 dan membaca pesannya
        const timer = setTimeout(() => {
          setIsCallScreenOpen(true);
          setWaitingForSeaRead(null);
        }, 2200);
        return () => clearTimeout(timer);
      }
    }
  }, [pov, keenStep, waitingForSeaRead, activeApp, activeLineChatId, isCallScreenOpen]);

  // Accept Call Handler in Step 17
  const handleCallAccept = () => {
    setCallProps((prev) => ({
      ...prev,
      isActiveCall: true,
    }));
  };

  // Call finished Handler in Step 17 or Step 19
  const handleCallFinished = () => {
    setIsCallScreenOpen(false);
    if (keenStep === 17) {
      setTimeout(() => {
        advanceKeenStory(18);
      }, 1200);
    } else if (keenStep === 19) {
      setIsSeaUnlocked(true);
      setTimeout(() => {
        sound.playNotification();
        setShowEndModal(true);
      }, 700);
    }
  };

  // Handle Home Click (Exit App to Home Screen)
  const handleHomeClick = () => {
    // Saat ada panggilan masuk / aktif, tombol back/home tidak bisa dipakai (wajib pilih tombol hijau / merah sesuai skenario)
    if (isCallScreenOpen) {
      sound.playTap();
      return;
    }
    const previousApp = activeApp;
    setActiveApp(null);

    // If waiting for Keen to exit chat/app before triggering @seakeen_zone notif:
    if (readyForZoneXNotif) {
      setReadyForZoneXNotif(false);
      setTimeout(() => {
        advanceKeenStory(3);
      }, 700);
      return;
    }

    // If waiting for Keen to exit app X before triggering fan reposts notif:
    if (readyForRepostXNotif && previousApp === 'x') {
      setReadyForRepostXNotif(false);
      setTimeout(() => {
        advanceKeenStory(4);
      }, 700);
      return;
    }

    // If waiting for Keen to exit Sea chat before triggering Clover Boys group notif:
    if (readyForClover6Notif) {
      setReadyForClover6Notif(false);
      setTimeout(() => {
        advanceKeenStory(6);
      }, 700);
      return;
    }

    // If waiting for Keen to exit Clover Boys chat before triggering Ka Fluk notif:
    if (readyForKaFluk7Notif) {
      setReadyForKaFluk7Notif(false);
      setTimeout(() => {
        advanceKeenStory(7);
      }, 700);
      return;
    }

    // If waiting for Keen to exit Ka Fluk chat before triggering Sea call:
    if (readyForSeaCall8) {
      setReadyForSeaCall8(false);
      setTimeout(() => {
        advanceKeenStory(8);
      }, 700);
      return;
    }

    // If waiting for Keen to exit messaging app before triggering X notif for Step 9:
    if (readyForStep9Notif) {
      setReadyForStep9Notif(false);
      setTimeout(() => {
        advanceKeenStory(9);
      }, 700);
      return;
    }

    // If waiting for Keen to exit app X before triggering Step 10 notif on X:
    if (readyForStep10Notif && previousApp === 'x') {
      setReadyForStep10Notif(false);
      setTimeout(() => {
        advanceKeenStory(10);
      }, 700);
      return;
    }

    // If waiting for Keen to exit app X before triggering Sea chat Step 11:
    if ((readyForSea11Notif || (pov === 'keen' && keenStep === 10)) && previousApp === 'x') {
      setReadyForSea11Notif(false);
      setTimeout(() => {
        advanceKeenStory(11);
      }, 700);
      return;
    }

    // If waiting for Keen to exit Sea chat before triggering Sea X post Step 12:
    if ((readyForSea12Notif || (pov === 'keen' && keenStep === 11)) && (previousApp === 'line' || activeLineChatId === 'sea')) {
      setReadyForSea12Notif(false);
      setTimeout(() => {
        advanceKeenStory(12);
      }, 700);
      return;
    }

    // If waiting for Keen to exit Clover Boys chat in Step 14 before triggering Sea message Step 15:
    if ((readyForSea15Notif || (pov === 'keen' && keenStep === 14)) && (previousApp === 'line' || activeLineChatId === 'clover-boys')) {
      setReadyForSea15Notif(false);
      setTimeout(() => {
        advanceKeenStory(15);
      }, 700);
      return;
    }

    // If waiting for Keen to exit Clover Boys chat in Step 16 before triggering Sea call in Step 17:
    if ((readyForSeaCall17 || (pov === 'keen' && keenStep === 16)) && (previousApp === 'line' || activeLineChatId === 'clover-boys')) {
      setReadyForSeaCall17(false);
      setTimeout(() => {
        advanceKeenStory(17);
      }, 700);
      return;
    }

    // If waiting for Keen to exit Sea chat in Step 18 before triggering incoming call from Sea (Step 19):
    if ((readyForSeaCall19 || (pov === 'keen' && keenStep === 18 && !isCallScreenOpen)) && (previousApp === 'line' || activeLineChatId === 'sea')) {
      setReadyForSeaCall19(false);
      setTimeout(() => {
        advanceKeenStory(19);
      }, 700);
      return;
    }

    // Story step progression hooks on app exit
    if (pov === 'keen') {
      if (keenStep === 1 && previousApp === 'x') {
        advanceKeenStory(2);
      } else if (keenStep === 4 && previousApp === 'x') {
        advanceKeenStory(5);
      } else if (keenStep === 8 && previousApp === 'line') {
        // user checked chat
      } else if (keenStep === 10 && previousApp === 'x') {
        advanceKeenStory(11);
      } else if (keenStep === 11 && previousApp === 'line') {
        advanceKeenStory(12);
      } else if (keenStep === 12 && previousApp === 'x') {
        advanceKeenStory(13);
      } else if (keenStep === 13 && previousApp === 'x') {
        advanceKeenStory(14);
      } else if (keenStep === 15 && previousApp === 'line') {
        advanceKeenStory(16);
      }
    } else if (pov === 'sea') {
      if ((readyForSurfNotif || seaStep === 1) && previousApp === 'x') {
        setReadyForSurfNotif(false);
        setTimeout(() => {
          advanceSeaStory(2);
        }, 700);
        return;
      }
      if ((readyForBebebKeenNotif || seaStep === 2) && (previousApp === 'line' || activeLineChatId === 'surf')) {
        setReadyForBebebKeenNotif(false);
        setTimeout(() => {
          advanceSeaStory(3);
        }, 700);
        return;
      }
    }
  };

  // Quick camera launch from lock screen
  const handleQuickCamera = () => {
    if (!isUnlocked) {
      setLockExternalTrigger({
        type: 'camera',
        timestamp: Date.now(),
      });
      return;
    }
    setActiveApp('camera');
  };

  // Reset story to turn 1
  const handleResetStory = () => {
    if (pov === 'keen') {
      setupKeenUniverse();
    } else {
      setupSeaUniverse();
    }
    setIsUnlocked(false);
    setActiveApp(null);
    setFreeMode(false);
  };

  // Jump to specific scenario
  const handleJumpToStep = (s: number) => {
    setIsUnlocked(true);
    if (pov === 'keen') {
      advanceKeenStory(s);
    } else {
      advanceSeaStory(s);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-2 sm:p-6 text-white font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Main iPhone Frame */}
      <IPhoneFrame
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        isCallActive={isCallScreenOpen}
        onHomeClick={handleHomeClick}
        onPowerClick={() => {
          if (isCallScreenOpen) {
            sound.playTap();
            return;
          }
          setIsUnlocked(false);
          setActiveApp(null);
        }}
        onVolumeUp={() => sound.playTap()}
        onVolumeDown={() => sound.playTap()}
        onActionClick={() => sound.playTap()}
      >
        {/* Dynamic Island */}
        <DynamicIsland
          isCalling={isCallScreenOpen}
          callerName={callProps.callerName}
          isMusicPlaying={isMusicPlaying}
          musicTitle={config.music.title}
          notification={islandNotif}
          onNotificationClick={handleNotificationClick}
          onIslandClick={() => {
            if (isCallScreenOpen) {
              // already on call
            } else if (islandNotif) {
              handleNotificationClick(islandNotif);
            } else if (isMusicPlaying) {
              if (isUnlocked) {
                setActiveApp('music');
              }
            }
          }}
        />

        {/* Status Bar */}
        <StatusBar dark={false} />

        {/* SCREEN CONTENT ROUTER */}
        {!isUnlocked ? (
          /* Lock Screen */
          <LockScreen
            wallpaper={config.lockWallpaper}
            correctPasscode={config.passcode}
            onUnlocked={() => {
              setIsUnlocked(true);
              setLockExternalTrigger(null);
            }}
            notifications={notifications}
            onNotificationClick={(notif) => {
              setIsUnlocked(true);
              setBannerNotif(null);
              setIslandNotif(null);
              const target = notif.targetApp || notif.app;
              if (target) {
                setActiveApp(target);
                if (notif.targetChatId) {
                  setActiveLineChatId(notif.targetChatId);
                }
              }
            }}
            onQuickCamera={() => {
              setIsUnlocked(true);
              setActiveApp('camera');
            }}
            externalTrigger={lockExternalTrigger}
          />
        ) : (
          /* Unlocked System Screen */
          <div className="relative w-full h-full flex flex-col overflow-hidden">
            {/* Top iOS Slide-down Notification Banner (when unlocked) */}
            {bannerNotif && (
              <div
                onClick={() => handleNotificationClick(bannerNotif)}
                className="absolute top-12 left-2.5 right-2.5 z-50 bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl rounded-2xl p-2.5 shadow-2xl border border-gray-200/80 dark:border-neutral-700/80 flex items-start gap-2.5 cursor-pointer animate-in fade-in slide-in-from-top-4 duration-300 active:scale-[0.98] transition select-none"
              >
                {bannerNotif.avatar ? (
                  <img
                    src={bannerNotif.avatar}
                    alt=""
                    className="w-9 h-9 rounded-xl object-cover shrink-0 shadow-xs"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
                    {bannerNotif.app.toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-semibold text-xs text-gray-900 dark:text-white truncate">
                      {bannerNotif.title}
                    </p>
                    <span className="text-[10px] text-gray-400 shrink-0">{bannerNotif.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2 leading-snug">
                    {bannerNotif.body}
                  </p>
                </div>
              </div>
            )}

            {/* Home Screen (Always present as base) */}
            <HomeScreen
              wallpaper={config.homeWallpaper}
              onOpenApp={(appId) => setActiveApp(appId)}
              unreadCounts={{
                x: notifications.filter((n) => n.app === 'x').length,
                line: notifications.filter((n) => n.app === 'line').length,
                instagram: 0,
              }}
            />

            {/* Active Applications */}
            {activeApp === 'instagram' && (
              <InstagramApp
                profile={igProfile}
                feedPosts={igFeed}
                onClose={() => setActiveApp(null)}
              />
            )}

            {activeApp === 'x' && (
              <XApp
                posts={xPosts}
                currentStoryStep={keenStep}
                userHandle={config.userHandle}
                userAvatar={config.xProfileAvatar}
                onPostReply={handleXPostReply}
                pendingReply={xPendingReply}
                onClose={handleHomeClick}
              />
            )}

            {activeApp === 'line' && (
              <LineApp
                threads={lineThreads}
                activeChatId={activeLineChatId}
                onSelectChat={(id) => setActiveLineChatId(id)}
                onBackToList={() => {
                  setActiveLineChatId(undefined);
                  if (readyForZoneXNotif) {
                    setReadyForZoneXNotif(false);
                    setTimeout(() => advanceKeenStory(3), 700);
                  }
                  if (readyForClover6Notif) {
                    setReadyForClover6Notif(false);
                    setTimeout(() => advanceKeenStory(6), 700);
                  }
                  if (readyForKaFluk7Notif) {
                    setReadyForKaFluk7Notif(false);
                    setTimeout(() => advanceKeenStory(7), 700);
                  }
                  if (readyForSeaCall8) {
                    setReadyForSeaCall8(false);
                    setTimeout(() => advanceKeenStory(8), 700);
                  }
                  if (readyForStep9Notif) {
                    setReadyForStep9Notif(false);
                    setTimeout(() => advanceKeenStory(9), 700);
                  }
                  if (readyForSea12Notif || (pov === 'keen' && keenStep === 11 && activeLineChatId === 'sea')) {
                    setReadyForSea12Notif(false);
                    setTimeout(() => advanceKeenStory(12), 700);
                  }
                  if (readyForSea15Notif || (pov === 'keen' && keenStep === 14 && activeLineChatId === 'clover-boys')) {
                    setReadyForSea15Notif(false);
                    setTimeout(() => advanceKeenStory(15), 700);
                  }
                  if (pov === 'sea' && (readyForBebebKeenNotif || (seaStep === 2 && activeLineChatId === 'surf'))) {
                    setReadyForBebebKeenNotif(false);
                    setTimeout(() => advanceSeaStory(3), 700);
                  }
                }}
                pendingReply={linePendingReply}
                onSendMessage={handleLineSendMessage}
                isOtherTyping={isLineTyping}
                typingSenderName={lineTypingSender}
                onStartCall={(chatId) => {
                  if (chatId === 'sea') {
                    advanceKeenStory(17);
                  }
                }}
                onClose={handleHomeClick}
              />
            )}

            {activeApp === 'notes' && (
              <NotesApp notes={notes} onClose={() => setActiveApp(null)} />
            )}

            {activeApp === 'photos' && (
              <PhotosApp
                photos={photos}
                userName={config.userName}
                onClose={() => setActiveApp(null)}
              />
            )}

            {activeApp === 'camera' && (
              <CameraApp
                frontVideo={config.camera.front}
                backVideo={config.camera.back}
                onClose={() => setActiveApp(null)}
              />
            )}

            {activeApp === 'music' && (
              <MusicApp
                music={config.music}
                isPlaying={isMusicPlaying}
                onTogglePlay={(playing) => setIsMusicPlaying(playing)}
                onClose={() => setActiveApp(null)}
              />
            )}

            {activeApp === 'phone' && (
              <div className="absolute inset-0 z-20 bg-neutral-900 text-white flex flex-col justify-center items-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-4 border border-green-500/30">
                  <Heart className="w-10 h-10 fill-green-400" />
                </div>
                <h2 className="text-xl font-bold mb-1">Daftar Kontak Favorit</h2>
                <p className="text-xs text-gray-400 mb-6">
                  {pov === 'sea' ? 'Panggilan Cepat Sea untuk Keen' : 'Panggilan Cepat Keen & Sea'}
                </p>
                <button
                  onClick={() => {
                    sound.playTap();
                    setActiveApp('line');
                    if (pov === 'sea') {
                      setActiveLineChatId('bebeb-keen');
                    } else {
                      setActiveLineChatId('sea');
                    }
                  }}
                  className="px-6 py-2.5 rounded-full bg-green-600 hover:bg-green-500 font-semibold text-xs transition"
                >
                  {pov === 'sea' ? 'Hubungi My bebeb Keen akuh 🦐🥰🤤😘❤️🔥' : 'Hubungi Sea 🦦💕'}
                </button>
              </div>
            )}

            {/* In-Call Screen Overlay (Ringing or Active transcript) */}
            {isCallScreenOpen && (
              <CallScreen
                callerName={callProps.callerName}
                callerAvatar={callProps.callerAvatar}
                isGreenDisabled={callProps.isGreenDisabled}
                disabledReason={callProps.disabledReason}
                onReject={handleCallReject}
                onAccept={handleCallAccept}
                isActiveCall={callProps.isActiveCall}
                transcriptLines={callProps.transcriptLines}
                onCallFinished={handleCallFinished}
              />
            )}

            {/* End Story Completion Modal */}
            {showEndModal && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in select-none">
                <div className="bg-neutral-900 border border-neutral-700/80 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center text-3xl shadow-lg">
                    ✨
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1.5">✨ THE END ✨</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {pov === 'keen'
                        ? 'Cerita dari POV Keen selesai! Sekarang kamu bisa menjelajahi isi HP Keen dalam bentuk freemode atau berganti POV ke Sea (cerita bonus).'
                        : 'Cerita dari POV Sea selesai! Sekarang kamu bisa menjelajahi isi HP Sea dalam mode bebas (Freemode).'}
                    </p>
                  </div>
                  <div className="space-y-2.5 pt-2">
                    <button
                      onClick={() => {
                        sound.playTap();
                        setShowEndModal(false);
                        setFreeMode(true);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-semibold text-xs border border-amber-500/30 flex items-center justify-center gap-2 transition active:scale-95 shadow"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{pov === 'keen' ? 'Jelajahi HP Keen (Freemode)' : 'Jelajahi HP Sea (Freemode)'}</span>
                    </button>
                    {pov === 'keen' ? (
                      <button
                        onClick={() => {
                          sound.playTap();
                          setShowEndModal(false);
                          handleSwitchPov('sea');
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
                      >
                        <span>Berganti POV ke Sea (Cerita Bonus) 🦦</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          sound.playTap();
                          setShowEndModal(false);
                          handleSwitchPov('keen');
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
                      >
                        <span>Kembali ke POV Keen 🦐</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </IPhoneFrame>

      {/* Simulator Controls Toolbar on Desk */}
      <SimulatorControls
        pov={pov}
        onSwitchPov={handleSwitchPov}
        currentStep={pov === 'keen' ? keenStep : seaStep}
        totalSteps={pov === 'keen' ? 19 : 3}
        stepDescription={getStepDescription()}
        onNextStep={() => {
          if (pov === 'keen') {
            advanceKeenStory(Math.min(19, keenStep + 1));
          } else {
            advanceSeaStory(Math.min(3, seaStep + 1));
          }
        }}
        onJumpToStep={handleJumpToStep}
        onResetStory={handleResetStory}
        freeMode={freeMode}
        onToggleFreeMode={() => {
          setFreeMode(!freeMode);
          if (!isUnlocked) setIsUnlocked(true);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        isSeaUnlocked={isSeaUnlocked}
      />
    </div>
  );
}
