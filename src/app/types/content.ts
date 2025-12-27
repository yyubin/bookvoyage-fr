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

export type BookSearchItem = {
  title: string;
  authors: string[];
  isbn10: string | null;
  isbn13: string | null;
  coverUrl: string | null;
  publisher: string | null;
  publishedDate: string | null;
  description: string | null;
  language: string | null;
  pageCount: number | null;
  googleVolumeId: string | null;
};

export type BookSearchPage = {
  items: BookSearchItem[];
  nextStartIndex: number | null;
  totalItems: number;
};

export type ReviewSearchItem = {
  reviewId: number;
  bookId: number;
  userId: number;
  summary: string;
  highlights: string[];
  keywords: string[];
  rating: number | null;
  createdAt: string;
};

export type ReviewSearchPage = {
  items: ReviewSearchItem[];
  nextCursor: number | null;
};

export type SearchResults = {
  query: string;
  books: BookSearchPage;
  reviews: ReviewSearchPage;
};

export type UserBookResponse = {
  userBookId: number;
  bookId: number;
  title: string;
  authors: string[];
  isbn10: string | null;
  isbn13: string | null;
  coverUrl: string | null;
  publisher: string | null;
  publishedDate: string | null;
  description: string | null;
  language: string | null;
  pageCount: number | null;
  googleVolumeId: string | null;
  status: string;
  progressPercentage: number;
  rating: number | null;
  memo: string | null;
  readingCount: number;
  startDate: string | null;
  completionDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserBookListResponse = {
  items: UserBookResponse[];
};

export type UserReviewResponse = {
  reviewId: number;
  bookId?: number;
  title: string;
  authors: string[];
  coverUrl: string | null;
  rating: number;
  summary: string;
  createdAt: string;
  reviewerNickname?: string;
};

export type UserReviewPageResponse = {
  reviews: UserReviewResponse[];
  nextCursor: number | null;
};

export type BookmarkPageResponse = {
  reviews?: UserReviewResponse[];
  items?: UserReviewResponse[];
  nextCursor?: number | null;
};

export type ReviewResponse = {
  reviewId: number;
  userId?: number;
  reviewerId?: number;
  authorNickname?: string;
  authorTasteTag?: string;
  bookId: number;
  title: string;
  authors: string[];
  isbn10: string | null;
  isbn13: string | null;
  coverUrl: string | null;
  publisher: string | null;
  publishedDate: string | null;
  description: string | null;
  language: string | null;
  pageCount: number | null;
  googleVolumeId: string | null;
  rating: number;
  summary: string;
  content: string;
  createdAt: string;
  visibility: string;
  deleted: boolean;
  viewCount: string;
  genre: string | null;
  keywords: string[];
  highlights: string[];
  mentions?: unknown[];
};

export type CommentResponse = {
  commentId: number;
  reviewId: number;
  userId: number;
  content: string;
  parentCommentId: number | null;
  createdAt: string;
  editedAt: string | null;
  mentions: unknown[];
};

export type CommentPageResponse = {
  comments: CommentResponse[];
  nextCursor: number | null;
};

export type ProfileSummary = {
  id: number;
  name: string;
  bio: string;
  profileImageUrl: string;
  tasteTag: string;
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
