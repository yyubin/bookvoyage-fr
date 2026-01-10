"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const trendingKeywords = [
  "무라카미 하루키",
  "추리소설",
  "자기계발",
  "힐링",
  "SF",
  "에세이",
];

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = (searchQuery?: string) => {
    const value = (searchQuery || query).trim();
    if (!value) {
      return;
    }
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword);
    submit(keyword);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1">
          <input
            className="w-full rounded-full border border-[var(--border)] bg-white/90 px-5 py-3 pr-12 text-sm text-[var(--ink)] shadow-sm outline-none transition focus:border-[var(--accent)] focus:shadow-md"
            placeholder="책 제목, 리뷰 내용, #태그 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submit();
              }
            }}
          />
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          onClick={() => submit()}
          type="button"
        >
          검색
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-[var(--muted)]">
          인기 키워드
        </span>
        <div className="flex flex-wrap gap-2">
          {trendingKeywords.map((keyword) => (
            <button
              key={keyword}
              onClick={() => handleKeywordClick(keyword)}
              className="rounded-full border border-[var(--border)] bg-white/80 px-3 py-1.5 text-xs font-medium text-[var(--ink)] transition hover:border-[var(--accent)] hover:bg-white hover:text-[var(--accent)]"
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
