import type { FollowUser, ProfileSummary } from "../types/content";

export const profilesById: Record<string, ProfileSummary> = {
  "user-001": {
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
  },
  "user-002": {
    id: "user-002",
    name: "박지수",
    bio: "거대한 서사와 가족의 기록을 좋아합니다.",
    tags: ["대하소설", "세대 이야기"],
    stats: {
      reviews: 18,
      followers: 940,
      following: 143,
    },
    shelves: {
      reading: 3,
      finished: 31,
      savedReviews: 12,
      bookmarks: 21,
    },
  },
  "user-003": {
    id: "user-003",
    name: "조아리",
    bio: "감각적인 문장과 여름의 이야기들을 수집합니다.",
    tags: ["감각적 문장", "여름"],
    stats: {
      reviews: 12,
      followers: 620,
      following: 98,
    },
    shelves: {
      reading: 2,
      finished: 20,
      savedReviews: 9,
      bookmarks: 14,
    },
  },
  "user-004": {
    id: "user-004",
    name: "정유진",
    bio: "차가운 세계관과 성장 서사를 사랑합니다.",
    tags: ["디스토피아", "성장 서사"],
    stats: {
      reviews: 15,
      followers: 520,
      following: 88,
    },
    shelves: {
      reading: 4,
      finished: 26,
      savedReviews: 11,
      bookmarks: 17,
    },
  },
  "user-005": {
    id: "user-005",
    name: "이하늘",
    bio: "감정의 언어를 탐구하는 리뷰어.",
    tags: ["감정 서사", "따뜻함"],
    stats: {
      reviews: 20,
      followers: 780,
      following: 132,
    },
    shelves: {
      reading: 6,
      finished: 34,
      savedReviews: 13,
      bookmarks: 24,
    },
  },
  "user-006": {
    id: "user-006",
    name: "최은지",
    bio: "사회와 개인의 경계에 관심이 많아요.",
    tags: ["사회성", "개인의 리듬"],
    stats: {
      reviews: 9,
      followers: 410,
      following: 76,
    },
    shelves: {
      reading: 2,
      finished: 18,
      savedReviews: 7,
      bookmarks: 10,
    },
  },
};

export const followersByUserId: Record<string, FollowUser[]> = {
  "user-001": [
    { id: "user-201", name: "박소연", bio: "장면이 예쁜 책을 좋아해요." },
    { id: "user-202", name: "김도윤", bio: "문장 필사 기록 중입니다." },
    { id: "user-203", name: "이서아", bio: "느린 독서, 깊은 리뷰." },
    { id: "user-204", name: "정민수", bio: "소설과 에세이를 번갈아 읽어요." },
    { id: "user-205", name: "한지우", bio: "읽는 맛이 있는 책 추천합니다." },
    { id: "user-206", name: "오세라", bio: "책과 여행을 기록해요." },
    { id: "user-207", name: "윤가영", bio: "요즘 SF에 빠졌어요." },
  ],
  "user-002": [
    { id: "user-208", name: "이민재", bio: "세대 이야기에 끌립니다." },
    { id: "user-209", name: "강수아", bio: "가족 서사를 좋아해요." },
  ],
  "user-003": [
    { id: "user-210", name: "정현", bio: "여름 소설 수집 중." },
    { id: "user-211", name: "한별", bio: "감각적인 문장 좋아요." },
  ],
};

export const followingByUserId: Record<string, FollowUser[]> = {
  "user-001": [
    { id: "user-301", name: "김하람", bio: "짧고 깊은 리뷰를 씁니다." },
    { id: "user-302", name: "최민지", bio: "책장 정리중이에요." },
    { id: "user-303", name: "박도영", bio: "역사소설 애호가." },
    { id: "user-304", name: "이지훈", bio: "비소설 추천을 좋아합니다." },
    { id: "user-305", name: "신유나", bio: "감성 에세이 수집가." },
    { id: "user-306", name: "강태윤", bio: "고전 읽기 챌린지 중." },
  ],
  "user-002": [
    { id: "user-312", name: "김서연", bio: "가족 이야기 추천합니다." },
    { id: "user-313", name: "정세아", bio: "문장 수집가." },
  ],
  "user-003": [
    { id: "user-314", name: "김태현", bio: "산문 좋아해요." },
    { id: "user-315", name: "박하린", bio: "계절 소설 수집 중." },
  ],
};
