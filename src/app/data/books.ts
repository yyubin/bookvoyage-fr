import type { BookItem } from "../types/content";

export const books: BookItem[] = [
  {
    id: "book-001",
    slug: "tomorrow-and-tomorrow",
    title: "내일, 또 내일, 그리고 내일",
    author: "가브리엘 제빈",
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
    description:
      "기억 속의 계절과 감정이 천천히 번지는 청춘의 기록.",
    highlights: ["고독한 청춘", "기억의 계절", "잔잔한 여운"],
    coverTone: "forest",
  },
];
