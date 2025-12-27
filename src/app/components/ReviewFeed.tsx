"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getReviews } from "../services/reviewService";
import type { ReviewItem } from "../types/content";

type ReviewFeedProps = {
  initialItems: ReviewItem[];
  initialCursor: string | null;
};

export default function ReviewFeed({
  initialItems,
  initialCursor,
}: ReviewFeedProps) {
  const [items, setItems] = useState(initialItems);
  const [nextCursor, setNextCursor] = useState(initialCursor);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = async () => {
    if (!nextCursor || isLoading) {
      return;
    }
    setIsLoading(true);
    const page = await getReviews({ cursor: nextCursor, limit: 4 });
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
      <div className="space-y-6">
        {items.map((review) => (
          <div
            key={review.id}
            className="rounded-[28px] border border-[var(--border)] bg-white/90 p-6 shadow-[var(--shadow)] transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex flex-col gap-5 sm:flex-row">
              <Link
                href={`/reviews/${review.id}`}
                className="h-28 w-20 flex-shrink-0 rounded-2xl bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c]"
                aria-label={`${review.title} 리뷰 상세로 이동`}
              />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/reviews/${review.id}`}
                      className="text-lg font-semibold text-[var(--ink)] transition hover:text-[var(--accent)]"
                    >
                      {review.title}
                    </Link>
                    <p className="text-sm text-[var(--muted)]">
                      {review.author}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--paper-strong)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                    평점 {review.rating}
                  </span>
                </div>
                <Link
                  href={`/reviews/${review.id}`}
                  className="mt-3 block text-sm leading-relaxed text-[var(--muted)]"
                >
                  {review.blurb}
                </Link>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
                  {review.tags.slice(0, 3).map((tag) => (
                    <Link
                      key={`${review.id}-${tag}`}
                      href={`/search?q=${encodeURIComponent(`#${tag}`)}`}
                      className="rounded-full border border-[var(--border)] bg-white px-3 py-1 transition hover:border-transparent hover:bg-[var(--paper-strong)]"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                    {review.reactions.slice(0, 3).map((reaction) => (
                      <span
                        key={reaction.emoji}
                        className="rounded-full border border-[var(--border)] px-3 py-1"
                      >
                        {reaction.emoji} {reaction.count}
                      </span>
                    ))}
                    <span className="rounded-full border border-[var(--border)] px-3 py-1">
                      좋아요 {review.likes}
                    </span>
                    <span className="rounded-full border border-[var(--border)] px-3 py-1">
                      댓글 {review.comments}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
                    <Link
                      href={`/profile/${review.reviewerId}`}
                      className="transition hover:text-[var(--accent)]"
                    >
                      {review.reviewer}
                    </Link>
                    <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
                    <span>2시간 전</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading
          ? Array.from({ length: 2 }).map((_, index) => (
              <div
                key={`review-skeleton-${index}`}
                className="rounded-[28px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="h-28 w-20 animate-pulse rounded-2xl bg-[var(--paper-strong)]" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-1/3 animate-pulse rounded bg-[var(--paper-strong)]" />
                    <div className="h-3 w-1/4 animate-pulse rounded bg-[var(--paper-strong)]" />
                    <div className="h-3 w-full animate-pulse rounded bg-[var(--paper-strong)]" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-[var(--paper-strong)]" />
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
      {nextCursor ? (
        <div className="mt-6 flex justify-center">
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
