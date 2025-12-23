import type { BookItem } from "../types/content";

export const books: BookItem[] = [
  {
    id: "book-001",
    slug: "tomorrow-and-tomorrow",
    title: "내일, 또 내일, 그리고 내일",
    author: "가브리엘 제빈",
    tags: ["게임", "우정", "성장"],
    description:
      "게임으로 이어진 우정과 시간의 이야기. 성장과 창작의 고통을 섬세하게 따라간다.",
    highlights: ["게임과 예술", "우정의 시간", "창작의 고통"],
    coverTone: "warm",
  },
  {
    id: "book-002",
    slug: "seven-husbands",
    title: "에블린 휴고의 일곱 남편",
    author: "테일러 젠킨스 리드",
    tags: ["할리우드", "여성서사", "비밀"],
    description:
      "할리우드의 빛과 그림자 속에서 삶을 지켜낸 한 배우의 고백.",
    highlights: ["영화 산업의 이면", "여성의 선택", "빛과 그림자"],
    coverTone: "sunset",
  },
  {
    id: "book-003",
    slug: "norwegian-wood",
    title: "노르웨이의 숲",
    author: "무라카미 하루키",
    tags: ["청춘", "고독", "기억"],
    description:
      "기억 속의 계절과 감정이 천천히 번지는 청춘의 기록.",
    highlights: ["고독한 청춘", "기억의 계절", "잔잔한 여운"],
    coverTone: "forest",
  },
  {
    id: "book-004",
    slug: "midnight-library",
    title: "밤의 도서관",
    author: "매트 헤이그",
    tags: ["후회", "선택", "힐링"],
    description:
      "다른 삶의 문을 열어보며 현재를 다시 바라보게 되는 이야기.",
    highlights: ["선택의 가능성", "후회와 위로", "조용한 성장"],
    coverTone: "warm",
  },
  {
    id: "book-005",
    slug: "farewell",
    title: "작별인사",
    author: "김영하",
    tags: ["기억", "인간성", "SF"],
    description:
      "기억과 감정의 경계에서 인간다움을 다시 묻는 소설.",
    highlights: ["기억의 경계", "인간다움", "감정의 회복"],
    coverTone: "sunset",
  },
  {
    id: "book-006",
    slug: "comfort-store",
    title: "불편한 편의점",
    author: "김호연",
    tags: ["일상", "연대", "회복"],
    description:
      "편의점이라는 작은 공간에서 피어나는 관계와 회복의 이야기.",
    highlights: ["작은 공동체", "회복과 연대", "따뜻한 유머"],
    coverTone: "forest",
  },
];
