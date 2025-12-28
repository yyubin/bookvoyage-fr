"use client";

import Link from "next/link";
import type { BookRecommendationItem } from "../types/content";

type BookRecommendationCarouselProps = {
  items: BookRecommendationItem[];
  isSignedIn: boolean;
};

export default function BookRecommendationCarousel({
  items,
  isSignedIn,
}: BookRecommendationCarouselProps) {
  if (!isSignedIn) {
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-[var(--border)] bg-white/70 px-4 py-4 text-sm text-[var(--muted)]">
        로그인하면 취향 기반 추천을 받을 수 있어요.
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-[var(--border)] bg-white/70 px-4 py-4 text-sm text-[var(--muted)]">
        지금은 추천할 책이 없어요. 조금 뒤에 다시 확인해주세요.
      </div>
    );
  }

  return (
    <div className="group relative mt-5">
      <div className="scrollbar-hidden flex gap-4 overflow-x-auto pb-2">
        {items.map((book) => (
          <Link
            key={book.bookId}
            href={`/books/internal/${book.bookId}`}
            className="min-w-[220px] rounded-[24px] border border-[var(--border)] bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="h-28 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c]">
              {book.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <p className="mt-4 text-sm font-semibold">{book.title}</p>
            <p className="text-xs text-[var(--muted)]">
              {book.authors.join(", ")}
            </p>
            {book.reason ? (
              <p className="mt-3 text-xs text-[var(--muted)]">
                {book.reason}
              </p>
            ) : null}
            <span className="mt-4 inline-flex text-xs font-semibold text-[var(--accent)]">
              책 상세 보기
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
