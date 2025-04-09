
// モックデータを定義

// コミュニティ
export const mockCommunities = [
  {
    id: 'technology',
    name: 'テクノロジー',
    description: 'テクノロジーについての最新情報と議論',
    memberCount: 345,
    color: 'bg-blue-500',
    icon: '💻',
    supabaseId: '123e4567-e89b-12d3-a456-426614174001', // UUIDを設定
  },
  {
    id: 'art',
    name: 'アート',
    description: 'アートとクリエイティブな作品について',
    memberCount: 253,
    color: 'bg-purple-500',
    icon: '🎨',
    supabaseId: '123e4567-e89b-12d3-a456-426614174002',
  },
  {
    id: 'business',
    name: 'ビジネス',
    description: 'ビジネスと起業家精神について',
    memberCount: 421,
    color: 'bg-green-500',
    icon: '💼',
    supabaseId: '123e4567-e89b-12d3-a456-426614174003',
  },
  {
    id: 'education',
    name: '教育',
    description: '教育と学習に関するトピック',
    memberCount: 198,
    color: 'bg-yellow-500',
    icon: '📚',
    supabaseId: '123e4567-e89b-12d3-a456-426614174004',
  },
  {
    id: 'health',
    name: '健康',
    description: '健康とウェルネスについて',
    memberCount: 302,
    color: 'bg-red-500',
    icon: '🏥',
    supabaseId: '123e4567-e89b-12d3-a456-426614174005',
  },
];

// 投稿者（ユーザー）
export const mockUsers = [
  {
    id: '1',
    username: 'tech_lover',
    displayName: 'テックラバー',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    username: 'art_enthusiast',
    displayName: 'アート愛好家',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    username: 'business_guru',
    displayName: 'ビジネスの達人',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

// 現在のユーザー
export const currentUser = {
  id: '1',
  username: 'tech_lover',
  displayName: 'テックラバー',
  avatar: 'https://i.pravatar.cc/150?img=1',
  communities: ['technology', 'business', 'education'], // 所属するコミュニティID
};

// モック投稿
export const mockPosts = [
  {
    id: '101',
    content: '新しいプログラミング言語について勉強中です。おすすめの学習リソースがあれば教えてください！',
    authorId: '1',
    communityId: 'technology',
    createdAt: new Date(Date.now() - 3600000 * 2),
    likeCount: 15,
    replyCount: 3,
    isLiked: false,
  },
  {
    id: '102',
    content: '先日訪れた美術館での展示が素晴らしかったです。現代アートの解釈について皆さんはどう思いますか？',
    authorId: '2',
    communityId: 'art',
    createdAt: new Date(Date.now() - 3600000 * 5),
    likeCount: 23,
    replyCount: 7,
    isLiked: true,
  },
  {
    id: '103',
    content: 'スタートアップの資金調達について記事を書きました。フィードバックをいただけると嬉しいです！',
    authorId: '3',
    communityId: 'business',
    createdAt: new Date(Date.now() - 3600000 * 8),
    likeCount: 42,
    replyCount: 12,
    isLiked: false,
  },
  {
    id: '104',
    content: '新しいWebフレームワークを試してみました。思ったより使いやすくて驚きました！',
    authorId: '1',
    communityId: 'technology',
    createdAt: new Date(Date.now() - 3600000 * 24),
    likeCount: 31,
    replyCount: 6,
    isLiked: true,
  },
];
