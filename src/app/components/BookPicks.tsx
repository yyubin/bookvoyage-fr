"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getBooks } from "../services/bookService";
import type { BookItem } from "../types/content";

type BookPicksProps = {
  initialItems: BookItem[];
  initialCursor: string | null;
};

export default function BookPicks({
  initialItems,
  initialCursor,
}: BookPicksProps) {
  const [items, setItems] = useState(initialItems);
  const [nextCursor, setNextCursor] = useState(initialCursor);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollByCards = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    const cardWidth = 236;
    const gap = 16;
    const step = (cardWidth + gap) * 2;
    container.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const loadMore = async () => {
    if (!nextCursor || isLoading) {
      return;
    }
    setIsLoading(true);
    const page = await getBooks({ cursor: nextCursor, limit: 3 });
    setItems((prev) => [...prev, ...page.items]);
    setNextCursor(page.nextCursor);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!nextCursor) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "120px" },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [nextCursor]);

  return (
    <>
      <div className="group relative mt-5">
        <button
          type="button"
          onClick={() => scrollByCards("left")}
          className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-white/90 text-lg text-[var(--ink)] shadow-md opacity-0 transition group-hover:flex group-hover:opacity-100"
          aria-label="이전 추천 보기"
        >
          &lt;
        </button>
        <div
          ref={scrollRef}
          className="scrollbar-hidden flex gap-4 overflow-x-auto pb-2"
        >
          {items.map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.slug}`}
              className="min-w-[220px] rounded-[24px] border border-[var(--border)] bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="h-28 w-full rounded-2xl bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c]" />
              <p className="mt-4 text-sm font-semibold">{book.title}</p>
              <p className="text-xs text-[var(--muted)]">{book.author}</p>
              <span className="mt-4 inline-flex text-xs font-semibold text-[var(--accent)]">
                책 상세 보기
              </span>
            </Link>
          ))}
          {isLoading
            ? Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`book-skeleton-${index}`}
                  className="min-w-[220px] rounded-[24px] border border-[var(--border)] bg-white/70 p-5 shadow-sm"
                >
                  <div className="h-28 w-full animate-pulse rounded-2xl bg-[var(--paper-strong)]" />
                  <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-[var(--paper-strong)]" />
                  <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-[var(--paper-strong)]" />
                  <div className="mt-4 h-3 w-1/3 animate-pulse rounded bg-[var(--paper-strong)]" />
                </div>
              ))
            : null}
        </div>
        <button
          type="button"
          onClick={() => scrollByCards("right")}
          className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-white/90 text-lg text-[var(--ink)] shadow-md opacity-0 transition group-hover:flex group-hover:opacity-100"
          aria-label="다음 추천 보기"
        >
          &gt;
        </button>
      </div>
      {nextCursor ? (
        <div className="mt-4 flex justify-center">
          <div
            ref={sentinelRef}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--muted)]"
          >
            {isLoading ? "불러오는 중..." : "더 가져오는 중"}
          </div>
        </div>
      ) : null}
    </>
  );
}
