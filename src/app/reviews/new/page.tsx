"use client";

import Link from "next/link";
import { useState } from "react";

export default function ReviewCreatePage() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [rating, setRating] = useState(0);
  const [spoiler, setSpoiler] = useState(false);

  const addTag = () => {
    const value = tagInput.trim();
    if (!value || tags.includes(value)) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, value]);
    setTagInput("");
  };

  const addHighlight = () => {
    const value = highlightInput.trim();
    if (!value || highlights.includes(value)) {
      setHighlightInput("");
      return;
    }
    setHighlights((prev) => [...prev, value]);
    setHighlightInput("");
  };

  return (
    <div className="paper-texture min-h-screen">
      <div className="mx-auto max-w-4xl px-6 pb-16 pt-8 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-lg font-semibold text-white shadow-md">
              BV
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Bookvoyage
              </p>
              <h1 className="font-serif text-2xl font-semibold">
                리뷰 작성
              </h1>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:-translate-y-0.5 hover:shadow-md"
          >
            피드로 돌아가기
          </Link>
        </header>

        <main className="mt-10 space-y-6">
          <section className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[var(--shadow)]">
            <h2 className="font-serif text-2xl font-semibold">
              어떤 책에 대한 리뷰인가요?
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              책 제목이나 작가로 검색해 선택하세요. 현재는 UI만 제공됩니다.
            </p>
            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--muted)]">
              책 검색 입력 필드
            </div>
          </section>

          <section className="rounded-[32px] border border-[var(--border)] bg-white/85 p-8 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold">리뷰 내용</h2>
              <span className="text-xs font-semibold text-[var(--muted)]">
                최대 2,000자
              </span>
            </div>
            <div className="mt-4 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--muted)]">
              한줄 요약 입력 필드
            </div>
            <div className="mt-4">
              <textarea
                className="h-56 w-full resize-none rounded-[24px] border border-[var(--border)] bg-white/90 px-5 py-4 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                placeholder="책을 읽으며 느낀 감정과 생각을 적어보세요."
              />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                <p className="text-xs font-semibold text-[var(--muted)]">
                  별점 입력
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const value = index + 1;
                    return (
                      <button
                        key={`star-${value}`}
                        className={`text-xl transition ${
                          rating >= value ? "text-[var(--accent)]" : "text-[#d7c7b3]"
                        }`}
                        onClick={() => setRating(value)}
                        type="button"
                        aria-label={`${value}점`}
                      >
                        ★
                      </button>
                    );
                  })}
                  <span className="text-xs font-semibold text-[var(--muted)]">
                    {rating > 0 ? `${rating}.0` : "선택 없음"}
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                <p className="text-xs font-semibold text-[var(--muted)]">
                  스포일러 토글
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    className={`relative h-7 w-12 rounded-full transition ${
                      spoiler ? "bg-[var(--accent)]" : "bg-[#d7c7b3]"
                    }`}
                    onClick={() => setSpoiler((prev) => !prev)}
                    type="button"
                    aria-pressed={spoiler}
                    aria-label="스포일러 포함"
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                        spoiler ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-semibold text-[var(--muted)]">
                    {spoiler ? "스포일러 포함" : "스포일러 없음"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-sm font-semibold text-[var(--muted)]">
                하이라이트
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  className="w-full rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                  placeholder="강조할 문장이나 핵심 포인트를 입력하고 Enter를 누르세요."
                  value={highlightInput}
                  onChange={(event) => setHighlightInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addHighlight();
                    }
                  }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
                {highlights.map((item) => (
                  <button
                    key={item}
                    className="rounded-full border border-[var(--border)] bg-white px-3 py-1 transition hover:border-transparent hover:bg-[var(--paper-strong)]"
                    onClick={() =>
                      setHighlights((prev) => prev.filter((tag) => tag !== item))
                    }
                    type="button"
                  >
                    {item} ×
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow)]">
            <h2 className="font-serif text-2xl font-semibold">태그</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              리뷰를 대표하는 태그를 직접 입력하세요.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <input
                className="w-full rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                placeholder="태그를 입력하고 Enter를 누르세요."
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                }}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
              {tags.map((tag) => (
                <button
                  key={tag}
                  className="rounded-full border border-[var(--border)] bg-white px-3 py-1 transition hover:border-transparent hover:bg-[var(--paper-strong)]"
                  onClick={() =>
                    setTags((prev) => prev.filter((item) => item !== tag))
                  }
                  type="button"
                >
                  #{tag} ×
                </button>
              ))}
            </div>
          </section>

          <section className="flex flex-wrap items-center justify-between gap-4">
            <button className="rounded-full border border-[var(--border)] bg-white px-5 py-2 text-sm font-semibold text-[var(--muted)]">
              임시 저장
            </button>
            <button className="rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white shadow-md">
              리뷰 게시하기
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
