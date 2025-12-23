import type { FollowUser, ProfileSummary } from "../types/content";

export const profile: ProfileSummary = {
  id: "user-001",
  name: "김하나",
  bio: "천천히 읽고, 오래 기억하는 리뷰어. 따뜻한 문장과 여운이 있는 책을 좋아합니다.",
  tags: ["잔잔한 성장", "따뜻한 문장"],
  stats: {
    reviews: 24,
    followers: 1800,
    following: 214,
  },
  shelves: {
    reading: 5,
    finished: 42,
    savedReviews: 18,
    bookmarks: 32,
  },
};

export const followers: FollowUser[] = [
  { id: "user-201", name: "박소연", bio: "장면이 예쁜 책을 좋아해요." },
  { id: "user-202", name: "김도윤", bio: "문장 필사 기록 중입니다." },
  { id: "user-203", name: "이서아", bio: "느린 독서, 깊은 리뷰." },
  { id: "user-204", name: "정민수", bio: "소설과 에세이를 번갈아 읽어요." },
  { id: "user-205", name: "한지우", bio: "읽는 맛이 있는 책 추천합니다." },
  { id: "user-206", name: "오세라", bio: "책과 여행을 기록해요." },
  { id: "user-207", name: "윤가영", bio: "요즘 SF에 빠졌어요." },
];

export const following: FollowUser[] = [
  { id: "user-301", name: "김하람", bio: "짧고 깊은 리뷰를 씁니다." },
  { id: "user-302", name: "최민지", bio: "책장 정리중이에요." },
  { id: "user-303", name: "박도영", bio: "역사소설 애호가." },
  { id: "user-304", name: "이지훈", bio: "비소설 추천을 좋아합니다." },
  { id: "user-305", name: "신유나", bio: "감성 에세이 수집가." },
  { id: "user-306", name: "강태윤", bio: "고전 읽기 챌린지 중." },
];
