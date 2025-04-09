
import { Community, Post, User } from '../types';

// モックユーザー
export const mockUsers: User[] = [
  {
    id: 'user1',
    username: 'tanaka_jun',
    email: 'tanaka@example.com',
    displayName: '田中 準',
    avatar: 'https://i.pravatar.cc/150?img=11',
    bio: 'ビジネス戦略とマーケティングのスペシャリスト。',
    joinedAt: new Date('2023-01-15'),
    communities: ['business', 'technology']
  },
  {
    id: 'user2',
    username: 'suzuki_art',
    email: 'suzuki@example.com',
    displayName: '鈴木 芸術',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'デジタルアーティスト、クリエイティブディレクター',
    joinedAt: new Date('2023-02-20'),
    communities: ['art', 'technology']
  },
  {
    id: 'user3',
    username: 'yamada_tech',
    email: 'yamada@example.com',
    displayName: '山田 テック',
    avatar: 'https://i.pravatar.cc/150?img=13',
    bio: 'フルスタックエンジニア、AI研究者',
    joinedAt: new Date('2023-03-10'),
    communities: ['technology', 'business']
  }
];

// モックコミュニティ
export const mockCommunities: Community[] = [
  {
    id: 'business',
    name: 'Business',
    description: 'ビジネス戦略、マーケティング、起業に関する議論の場',
    memberCount: 128,
    color: 'bg-blue-600',
    icon: '💼'
  },
  {
    id: 'art',
    name: 'Art',
    description: 'アート、デザイン、創造的表現についての場',
    memberCount: 95,
    color: 'bg-purple-600',
    icon: '🎨'
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'テクノロジー、プログラミング、イノベーションについて',
    memberCount: 156,
    color: 'bg-green-600',
    icon: '💻'
  }
];

// モック投稿
export const mockPosts: Post[] = [
  {
    id: 'post1',
    content: '最新の人工知能技術は、ビジネス戦略に革命をもたらしています。AIを活用した意思決定支援システムの開発に取り組んでいます。#AI #ビジネス戦略',
    authorId: 'user1',
    author: mockUsers[0],
    communityId: 'business',
    createdAt: new Date('2024-04-08T10:30:00'),
    likeCount: 15,
    replyCount: 3,
    isLiked: false
  },
  {
    id: 'post2',
    content: '新しいデジタルアート作品を制作中です。AIとヒューマンクリエイティビティの融合について探求しています。#デジタルアート #AI',
    authorId: 'user2',
    author: mockUsers[1],
    communityId: 'art',
    createdAt: new Date('2024-04-08T11:45:00'),
    likeCount: 23,
    replyCount: 7,
    isLiked: true
  },
  {
    id: 'post3',
    content: 'Reactの最新フックAPIについて勉強中。コンポーネント設計がより直感的になりました。共有したいTipsがあれば教えてください。#React #プログラミング',
    authorId: 'user3',
    author: mockUsers[2],
    communityId: 'technology',
    createdAt: new Date('2024-04-08T14:20:00'),
    likeCount: 19,
    replyCount: 5,
    isLiked: false
  },
  {
    id: 'post4',
    content: 'マーケティング戦略におけるデータ分析の重要性について議論したいと思います。皆さんはどのようなツールを使っていますか？ #マーケティング #データ分析',
    authorId: 'user1',
    author: mockUsers[0],
    communityId: 'business',
    createdAt: new Date('2024-04-08T16:05:00'),
    likeCount: 12,
    replyCount: 8,
    isLiked: false
  },
  {
    id: 'post5',
    content: '最新の量子コンピューティング技術についての記事を読みました。今後のテクノロジー発展に大きく影響しそうです。#量子コンピューティング #テクノロジー',
    authorId: 'user3',
    author: mockUsers[2],
    communityId: 'technology',
    createdAt: new Date('2024-04-08T17:30:00'),
    likeCount: 27,
    replyCount: 12,
    isLiked: true
  },
  {
    id: 'post6',
    content: '伝統的な絵画技法とデジタルツールを組み合わせた作品展を計画中です。アートとテクノロジーの融合は無限の可能性がありますね。#アート #テクノロジー',
    authorId: 'user2',
    author: mockUsers[1],
    communityId: 'art',
    createdAt: new Date('2024-04-08T18:45:00'),
    likeCount: 21,
    replyCount: 6,
    isLiked: false
  }
];

// モック通知
export const mockNotifications = [
  {
    id: 'notif1',
    type: 'like',
    content: '鈴木 芸術があなたの投稿にいいねしました',
    createdAt: new Date('2024-04-08T15:30:00'),
    isRead: false,
    relatedUserId: 'user2',
    relatedPostId: 'post1'
  },
  {
    id: 'notif2',
    type: 'reply',
    content: '山田 テックがあなたの投稿にコメントしました',
    createdAt: new Date('2024-04-08T14:45:00'),
    isRead: true,
    relatedUserId: 'user3',
    relatedPostId: 'post1'
  },
  {
    id: 'notif3',
    type: 'system',
    content: '新しいコミュニティ「Finance」が追加されました',
    createdAt: new Date('2024-04-08T09:15:00'),
    isRead: false
  }
];

// 現在のユーザー
export const currentUser = mockUsers[0];
