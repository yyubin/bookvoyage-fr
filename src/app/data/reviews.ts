import type { ReviewComment, ReviewItem } from "../types/content";

export const reviews: ReviewItem[] = [
  {
    id: "review-001",
    slug: "midnight-library",
    title: "미드나잇 라이브러리",
    author: "매트 헤이그",
    reviewer: "김하나",
    blurb:
      "선택하지 못했던 삶을 조용히 걷게 해주는 책. 마지막 장이 특히 오래 남았다.",
    rating: "4.6",
    reactions: [
      { emoji: "📚", count: 640 },
      { emoji: "💬", count: 280 },
      { emoji: "✨", count: 210 },
    ],
    comments: "184",
    likes: "6.8k",
    bookmarks: "1.9k",
    spoiler: false,
    review:
      "후회와 가능성이 겹치는 지점에서 이야기가 시작된다. 도서관의 문을 하나씩 열 때마다 내가 고른 삶의 무늬가 조금씩 달라지고, 그 변화가 큰 격차가 아니라는 사실이 오히려 위로가 되었다. 삶의 성패를 숫자로 말하지 않고, ‘살아가는 감각’에 집중하는 점이 좋았다.",
    highlights: [
      "삶의 갈림길은 크지 않다.",
      "후회는 길을 바꾸는 게 아니라 방향을 재정렬한다.",
    ],
    commentList: [
      {
        id: "comment-001",
        user: "서연",
        time: "35분 전",
        content: "마지막 문장에 울컥했어요. 다시 읽어야겠네요.",
      },
      {
        id: "comment-002",
        user: "민준",
        time: "2시간 전",
        content: "선택의 무게를 덜어주는 느낌이 좋았어요.",
      },
    ],
  },
  {
    id: "review-002",
    slug: "the-giver",
    title: "기억 전달자",
    author: "로이스 로리",
    reviewer: "정유진",
    blurb:
      "선택지가 없는 세상에서 선택을 배우는 성장 서사. 차가운 배경이 더욱 선명했다.",
    rating: "4.4",
    reactions: [
      { emoji: "🔥", count: 420 },
      { emoji: "📖", count: 220 },
      { emoji: "🥹", count: 100 },
    ],
    comments: "66",
    likes: "2.3k",
    bookmarks: "620",
    spoiler: false,
    review:
      "규칙과 통제로 정리된 세계가 얼마나 조용히 사람을 지우는지 보여준다. 이 세계에서 사랑과 기억이 얼마나 중요한지, 마지막 장면이 긴 여운으로 남았다.",
    highlights: ["기억의 힘", "질서와 자유의 대비"],
    commentList: [
      {
        id: "comment-003",
        user: "은서",
        time: "3시간 전",
        content: "사회가 얼마나 쉽게 순응하게 되는지 생각했어요.",
      },
      {
        id: "comment-004",
        user: "준호",
        time: "어제",
        content: "결말에서 울컥했습니다. 한 번 더 읽을래요.",
      },
    ],
  },
  {
    id: "review-003",
    slug: "almond",
    title: "아몬드",
    author: "손원평",
    reviewer: "이하늘",
    blurb:
      "감정을 느끼지 못하는 소년이 세계와 연결되는 방식이 조용히 따뜻하다.",
    rating: "4.3",
    reactions: [
      { emoji: "💛", count: 520 },
      { emoji: "🌿", count: 310 },
      { emoji: "🫶", count: 150 },
    ],
    comments: "121",
    likes: "3.9k",
    bookmarks: "1.1k",
    spoiler: false,
    review:
      "차분한 문체로 감정의 언어를 배우는 과정을 따라간다. 서로의 결핍이 어떻게 관계를 맺는지, 그 관계가 얼마나 큰 변화를 만드는지 섬세하게 묘사한다.",
    highlights: ["감정의 언어", "서로의 변화"],
    commentList: [
      {
        id: "comment-005",
        user: "나린",
        time: "6시간 전",
        content: "잔잔한데도 마음이 많이 흔들렸어요.",
      },
      {
        id: "comment-006",
        user: "석진",
        time: "2일 전",
        content: "주인공의 시선이 오래 기억에 남네요.",
      },
    ],
  },
  {
    id: "review-004",
    slug: "convenience-store-woman",
    title: "편의점 인간",
    author: "무라타 사야카",
    reviewer: "최은지",
    blurb:
      "정상성의 테두리 밖에서 자신만의 리듬을 지키는 이야기.",
    rating: "4.1",
    reactions: [
      { emoji: "🧠", count: 260 },
      { emoji: "📎", count: 210 },
      { emoji: "🌀", count: 190 },
    ],
    comments: "52",
    likes: "2.1k",
    bookmarks: "540",
    spoiler: false,
    review:
      "사회가 요구하는 기준과 개인의 리듬이 충돌하는 순간들을 짧고 강하게 보여준다. 읽는 동안 내 기준도 흔들리게 되는 책이었다.",
    highlights: ["정상성 질문", "개인의 리듬"],
    commentList: [
      {
        id: "comment-007",
        user: "지후",
        time: "5시간 전",
        content: "읽고 나서 내가 가진 고정관념을 돌아봤어요.",
      },
      {
        id: "comment-008",
        user: "소희",
        time: "어제",
        content: "짧지만 여운이 길어요.",
      },
    ],
  },
  {
    id: "review-005",
    slug: "pachinko",
    title: "파친코",
    author: "이민진",
    reviewer: "박지수",
    blurb:
      "세대를 건너 이어지는 사랑과 생존의 기록. 가족 앨범처럼 촘촘하다.",
    rating: "4.9",
    reactions: [
      { emoji: "🔥", count: 1200 },
      { emoji: "😭", count: 700 },
      { emoji: "📚", count: 500 },
    ],
    comments: "320",
    likes: "9.1k",
    bookmarks: "2.7k",
    spoiler: false,
    review:
      "거대한 시대 위에 놓인 개인의 선택이 얼마나 작고도 단단한지 보여준다. 각 인물이 감당한 현실은 차갑지만, 가족을 지키려는 마음은 뜨겁게 남는다. 장면마다 얼굴과 풍경이 또렷하게 떠올라서 천천히 읽게 됐다.",
    highlights: [
      "가족은 떠나지 못한 감정의 기록이다.",
      "사랑과 존엄은 쉽게 포기되지 않는다.",
    ],
    commentList: [
      {
        id: "comment-009",
        user: "지안",
        time: "1시간 전",
        content: "등장인물들이 너무 현실적이라 더 아팠어요.",
      },
      {
        id: "comment-010",
        user: "도윤",
        time: "5시간 전",
        content: "세대가 바뀌어도 이어지는 감정선이 최고였습니다.",
      },
    ],
  },
  {
    id: "review-006",
    slug: "paper-palace",
    title: "페이퍼 팰리스",
    author: "미란다 카울리 헬러",
    reviewer: "조아리",
    blurb:
      "햇살과 기억이 겹친 여름. 소나무 냄새가 나는 장면들이 오래 남았다.",
    rating: "4.2",
    reactions: [
      { emoji: "🌞", count: 340 },
      { emoji: "🌲", count: 290 },
      { emoji: "🕊️", count: 230 },
    ],
    comments: "97",
    likes: "3.1k",
    bookmarks: "840",
    spoiler: true,
    review:
      "현재의 선택이 과거의 기억과 계속 부딪히면서, 나도 오래된 여름에 머무는 기분이었다. 인물들이 내리는 결정을 전부 이해할 수는 없지만, 그 복잡함이 진짜 삶에 가까웠다. 감각적인 문장 덕분에 눈앞에 풍경이 선명했다.",
    highlights: ["감각적 풍경 묘사", "선택의 복잡함을 정직하게 담음"],
    commentList: [
      {
        id: "comment-011",
        user: "윤아",
        time: "어제",
        content: "스포일러 표기가 있어서 안심하고 읽었어요.",
      },
      {
        id: "comment-012",
        user: "현우",
        time: "3일 전",
        content: "여름 감성 가득해서 마음이 차분해졌습니다.",
      },
    ],
  },
];
