import { InstagramPost, NoteItem } from '../types';

export const SEA_CONFIG = {
  passcode: '2709',
  lockWallpaper: 'https://i.pinimg.com/736x/ec/7d/e7/ec7de749589ce8219593f948fe928ad3.jpg',
  homeWallpaper: 'https://i.pinimg.com/736x/46/63/6b/46636bbdcb55a20dbd14cf44438549de.jpg',
  userHandle: '@seatalay',
  userName: 'Sea',
  userAvatar: 'https://i.pinimg.com/736x/10/9d/6b/109d6b41f52504dcf12c087a2e9e3131.jpg',
  xProfileAvatar: 'https://pbs.twimg.com/profile_images/2115423123776610304/ZblO-Oj5_400x400.jpg',
  camera: {
    front: 'https://video.twimg.com/amplify_video/2063243552654798848/vid/avc1/1080x1920/NFeB7M5qpoLBqnGW.mp4?tag=27',
    back: 'https://video.twimg.com/amplify_video/2079960824299622401/vid/avc1/1874x2766/2XQIvS7vKER0x2Rh.mp4?tag=29',
  },
  music: {
    title: 'Keen',
    artist: 'Keen cover',
    cover: 'https://i.pinimg.com/1200x/eb/96/0a/eb960a4669a9902174f0f109c78f38a9.jpg',
    src: 'https://video.twimg.com/amplify_video/2079243667672354816/vid/avc1/888x1196/Jnx1TNnF4A2AOknC.mp4?tag=29',
  },
};

export const SEA_NOTES: NoteItem[] = [
  {
    id: 'sea-note-1',
    title: 'reminder for me 🙏',
    date: '20 Oktober 2026',
    content: `• Jangan pernah bikin Keen cemberut. Nggak tega lihatnya.
• Kalau Keen marah, jangan malah ikut marah. Peluk aja dulu kalau dia ngizinin.
• Beliin matcha kesukaannya. Dua cup juga nggak apa-apa, asal dia senyum lagi.
• Minta maaf yang bener, jangan cuma modal muka ganteng walaupun iya memang gue ganteng
• Jangan godain Keen berlebihan. (Tapi kalau dia salting, lucu sih)
• Kalau Keen bilang, “Gue nggak marah,” berarti harus waspada. Itu tandanya dia marah.
• Kasih waktu buat Keen menenangkan diri, tapi jangan sampai dia merasa sendirian.
• Bujuk pakai suara paling lembut. Kalau perlu, panggil, “Sayang.”
• Akui kesalahan sendiri. Jangan cari alasan cuma karena gengsi.
• Ingat baik-baik: menang debat sama Keen bukan tujuan. Bikin Keen bahagia itu tugas gueh 😎✨`,
  },
  {
    id: 'sea-note-2',
    title: 'Happy birthday to my favorite person in the whole world, Keen. 🩷🎂',
    date: '18 Agustus 2026',
    content: `Semoga di umur yang baru ini, Keen selalu dikelilingi hal-hal baik, selalu sehat, bahagia, dan nggak pernah merasa sendirian. Sea berharap semua hal yang Keen impikan bisa tercapai satu per satu. Kalau nanti ada hari-hari yang terasa berat, semoga Keen selalu ingat kalau ada Sea yang bakal tetap di sini, nemenin Keen melewati semuanya.

Thank you for being you, for coming into my life, and for making my days so much better just by being around. Sea mungkin nggak selalu pandai mengungkapkan perasaan, tapi satu hal yang Sea tahu pasti: Sea bersyukur banget bisa kenal Keen.

Oh, and one more thing. Jangan kebanyakan senyum ke orang lain, ya? Aku masih gampang cemburu, soalnya. 😤 But it's okay, today is your special day, so Sea will let you do whatever you want. Just for today!

I love you, Keen. More than yesterday, less than tomorrow. ❤️

Once again, happy birthday, my favorite little shrimp 🤏🦐. Please stay happy, stay healthy, and stay with Sea for a very, very long time. Because Sea still has so many birthdays to celebrate with you. 🫶🏻`,
  },
];

export const SEA_INSTAGRAM_PROFILE = {
  username: 'seatalay',
  name: 'Sea Dechchart',
  bio: 'artist',
  followers: '1,1JT',
  following: '590',
  avatar: 'https://i.pinimg.com/736x/70/a5/8a/70a58ac6ae0fd317ed22476da57d1fe7.jpg',
  postsCount: 9,
  photos: [
    'https://i.pinimg.com/736x/1e/b6/dd/1eb6ddd9416fe966cef5d156d35a77b8.jpg',
    'https://i.pinimg.com/736x/35/c8/d1/35c8d1e960ac5012246ba14438622717.jpg',
    'https://i.pinimg.com/1200x/42/93/2a/42932aa7873d5fdd049c01dbc1f2b763.jpg',
    'https://i.pinimg.com/1200x/28/fc/84/28fc84b26b045345edc3d9ba7d1157e1.jpg',
    'https://i.pinimg.com/736x/35/b7/a0/35b7a02f6b966c40455e74b68a66ef61.jpg',
    'https://i.pinimg.com/736x/81/eb/d6/81ebd679bb06db5e19f96b1c58115267.jpg',
    'https://i.pinimg.com/1200x/7f/b6/c4/7fb6c4c879fe46f006ec625e2c5a5c85.jpg',
    'https://i.pinimg.com/1200x/8f/26/d5/8f26d5721a3ac965405268feddbc6731.jpg',
    'https://i.pinimg.com/736x/2b/5f/0f/2b5f0f5bf978b4dc801722bd0521dd51.jpg',
  ],
};

export const SEA_INSTAGRAM_FEED: InstagramPost[] = [
  {
    id: 'ig-keen',
    author: 'keenkeno',
    authorAvatar: 'https://i.pinimg.com/1200x/a2/0c/2b/a20c2bea888f7d01f3509f83af34cd76.jpg',
    caption: 'iya makasih ya fans 😎',
    image: 'https://i.pinimg.com/736x/58/7b/d9/587bd937f56aa3b516177977612fcfbb.jpg',
    likes: '185,210 suka',
    time: '2 jam yang lalu',
  },
  {
    id: 'ig-barcode',
    author: 'im_barcode',
    authorAvatar: 'https://i.pinimg.com/736x/6f/7f/f0/6f7ff043580c0467febf35789cc9471d.jpg',
    caption: 'get ready for racing again 🏁',
    image: 'https://i.pinimg.com/736x/27/9b/0a/279b0ac1903a1ac4d284f505b0cb5c42.jpg',
    likes: '89,420 suka',
    time: '6 jam yang lalu',
  },
  {
    id: 'ig-aungpao',
    author: 'b_aungpao_d',
    authorAvatar: 'https://i.pinimg.com/1200x/90/6b/f7/906bf799b2edc6fc27d5cac16565f228.jpg',
    caption: 'late post ygy~ 😎',
    image: 'https://i.pinimg.com/736x/6a/b7/92/6ab792c0649bc1ca0708c9aa19e01a51.jpg',
    likes: '74,130 suka',
    time: '8 jam yang lalu',
  },
  {
    id: 'ig-ashi',
    author: 'hi_ashi',
    authorAvatar: 'https://i.pinimg.com/736x/17/57/cc/1757cc91c59b42d8cbc7440f06c9ab5e.jpg',
    caption: 'jalan bareng adik @astonlvr',
    image: 'https://i.pinimg.com/736x/35/08/3d/35083dce8c444fd8afa5831cbd370f2a.jpg',
    likes: '63,890 suka',
    time: '12 jam yang lalu',
  },
];

export const SEA_PHOTOS: string[] = [
  'https://pbs.twimg.com/media/HVEBwULb0AATd2i?format=jpg&name=large',
  'https://video.twimg.com/amplify_video/2060060876426670084/vid/avc1/1080x1920/w63qsoGbmEN-IH6Q.mp4?tag=27',
  'https://video.twimg.com/amplify_video/2003695868411887616/vid/avc1/2160x3840/EEydGtceHFILa4In.mp4?tag=21',
  'https://pbs.twimg.com/media/HHZJP7wbgAA7m6n?format=jpg&name=large',
  'https://video.twimg.com/amplify_video/2115412596635684865/vid/avc1/720x1114/ssFSbhpRH8ZtsYC_.mp4?tag=29',
  'https://video.twimg.com/amplify_video/1909934626656886785/vid/avc1/720x1280/h-QgcZq6kaeZ4nP7.mp4?tag=16',
  'https://pbs.twimg.com/media/HKsIS-DbgAA9iza?format=jpg&name=large',
  'https://pbs.twimg.com/media/HHPhmfAacAAjXOA?format=jpg&name=large',
  'https://pbs.twimg.com/media/HUMnNVnaMAAyHMN?format=jpg&name=large',
  'https://pbs.twimg.com/media/HMiy_hdbwAAGp2a?format=jpg&name=large',
  'https://pbs.twimg.com/media/HKN2gDTaoAAc2FJ?format=jpg&name=large',
  'https://i.pinimg.com/1200x/33/33/6f/33336f278c4d11ab909630c5455ba6a4.jpg',
  'https://i.pinimg.com/1200x/92/33/6b/92336b0e6d5d81c2e23bbecac02b1a83.jpg',
  'https://i.pinimg.com/736x/22/72/fd/2272fd76448c2b32517fb5c25902cdbc.jpg',
  'https://i.pinimg.com/736x/40/51/5e/40515e2be04dd79357c16b4606c498ae.jpg',
  'https://i.pinimg.com/736x/02/c2/87/02c287c4d60d816211a9f6cf6aabe773.jpg',
  'https://i.pinimg.com/1200x/53/97/f3/5397f3cc3c5f9a9f8203d728d4bdd7c2.jpg',
  'https://i.pinimg.com/736x/93/c6/f5/93c6f5ae7351eb41e93a141b919a675b.jpg',
  'https://i.pinimg.com/1200x/77/ee/d2/77eed285c6e62c9e48e624f4976790d0.jpg',
  'https://i.pinimg.com/736x/44/45/1c/44451cbd8b066466846b8d0f74d485c5.jpg',
  'https://pbs.twimg.com/media/HVR2Cd4bYAAJrYO?format=jpg&name=large',
  'https://i.pinimg.com/1200x/cb/6b/94/cb6b9480d0e343ac705b1fcc29e7c2bf.jpg',
  'https://i.pinimg.com/1200x/b2/20/06/b22006028748fa352a1a0bee87958f24.jpg',
  'https://i.pinimg.com/1200x/b6/91/04/b69104914852a5548dd1ff2c2b7d79ef.jpg',
];
