"use client";

import Link from "next/link";
import { useState } from "react";
import type { BookRecommendationItem } from "../../types/content";
import { getBookRecommendations } from "../../services/recommendationService";

const PAGE_SIZE = 20;

type RecommendationListProps = {
  initialItems: BookRecommendationItem[];
  isSignedIn: boolean;
};

export default function RecommendationList({
  initialItems,
  isSignedIn,
}: RecommendationListProps) {
  const [items, setItems] = useState(initialItems);
  const [currentLimit, setCurrentLimit] = useState(
    Math.max(initialItems.length, PAGE_SIZE),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  if (!isSignedIn) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-white/70 px-4 py-4 text-sm text-[var(--muted)]">
        로그인하면 개인화된 추천 리스트를 볼 수 있어요.
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-white/70 px-4 py-4 text-sm text-[var(--muted)]">
        지금은 추천할 책이 없어요. 조금 뒤에 다시 확인해주세요.
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((book) => (
          <Link
            key={book.bookId}
            href={`/books/internal/${book.bookId}`}
            className="group rounded-[28px] border border-[var(--border)] bg-white/85 p-5 shadow-[var(--shadow)] transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="h-36 w-full overflow-hidden rounded-[24px] bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c] shadow-inner">
              {book.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="mt-5">
              <p className="text-sm font-semibold text-[var(--ink)]">
                {book.title}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {book.authors.join(", ")}
              </p>
              {book.reason ? (
                <p className="mt-3 text-xs text-[var(--muted)]">
                  {book.reason}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-[var(--muted)]">
                {book.source ? (
                  <span className="rounded-full border border-[var(--border)] bg-white px-2 py-1">
                    {book.source}
                  </span>
                ) : null}
                {book.rank ? (
                  <span className="rounded-full border border-[var(--border)] bg-white px-2 py-1">
                    #{book.rank}
                  </span>
                ) : null}
              </div>
            </div>
            <span className="mt-4 inline-flex text-xs font-semibold text-[var(--accent)]">
              책 상세 보기
            </span>
          </Link>
        ))}
      </div>
      {hasMore ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="rounded-full border border-[var(--border)] bg-white px-5 py-2 text-xs font-semibold text-[var(--muted)] transition hover:border-transparent hover:bg-[var(--paper-strong)]"
            onClick={async () => {
              if (isLoading) {
                return;
              }
              setIsLoading(true);
              const nextLimit = currentLimit + PAGE_SIZE;
              try {
                const result = await getBookRecommendations(nextLimit);
                if (result.items.length <= items.length) {
                  setHasMore(false);
                } else {
                  setItems(result.items);
                  setCurrentLimit(nextLimit);
                }
              } finally {
                setIsLoading(false);
              }
            }}
          >
            {isLoading ? "불러오는 중..." : "추천 더 보기"}
          </button>
        </div>
      ) : null}
    </>
  );
}
