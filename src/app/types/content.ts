export type CursorQuery = {
  cursor?: string | number | null;
  limit?: number;
};

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

export type ReviewComment = {
  id: string;
  user: string;
  userId: string;
  time: string;
  content: string;
};

export type ReviewItem = {
  id: number;
  slug: string;
  title: string;
  author: string;
  reviewer: string;
  reviewerId: string;
  tags: string[];
  blurb: string;
  rating: string;
  comments: string;
  likes: string;
  reactions: {
    emoji: string;
    count: number;
  }[];
  bookmarks: string;
  spoiler: boolean;
  review: string;
  highlights: string[];
  commentList: ReviewComment[];
};

export type BookItem = {
  id: string;
  slug: string;
  title: string;
  author: string;
  tags: string[];
  description: string;
  highlights: string[];
  coverTone: "warm" | "sunset" | "forest";
};

export type SearchResults = {
  reviews: ReviewItem[];
  books: BookItem[];
};

export type ProfileSummary = {
  id: number;
  name: string;
  bio: string;
  tags: string[];
  stats: ProfileStats;
  shelves: ShelfStats;
};

export type ProfileStats = {
  reviews: number;
  followers: number;
  following: number;
};

export type ShelfStats = {
  reading: number;
  finished: number;
  savedReviews: number;
  bookmarks: number;
};

export type FollowUser = {
  id: number;
  name: string;
  bio: string;
};

export type ProfileReviewItem = {
  id: number;
  bookId: number;
  title: string;
  authors: string[];
  coverUrl: string;
  rating: number;
  summary: string;
  createdAt: string;
  viewCount: string;
};

export type ReadingBookItem = {
  bookId: number;
  title: string;
  authors: string[];
  coverUrl: string;
  progressPercentage: number;
  updatedAt: string;
};

export type BookmarkedReviewItem = {
  reviewId: number;
  bookId: number;
  title: string;
  authors: string[];
  coverUrl: string;
  rating: number;
  content: string;
  bookmarkedAt: string;
  reviewerNickname: string;
};
