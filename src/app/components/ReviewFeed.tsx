"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getReviewRecommendations } from "../services/recommendationService";
import type { ReviewRecommendationItem } from "../types/content";

type ReviewFeedProps = {
  initialItems: ReviewRecommendationItem[];
  initialCursor: number | null;
  initialHasMore: boolean;
};

export default function ReviewFeed({
  initialItems,
  initialCursor,
  initialHasMore,
}: ReviewFeedProps) {
  const [items, setItems] = useState(initialItems);
  const [nextCursor, setNextCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = async () => {
    if (!nextCursor || isLoading || !hasMore) {
      return;
    }
    setIsLoading(true);
    try {
      const page = await getReviewRecommendations({
        cursor: nextCursor,
        limit: 4,
      });
      setItems((prev) => [...prev, ...page.items]);
      setNextCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!nextCursor || !hasMore) {
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
  }, [nextCursor, hasMore]);

  return (
    <>
      {items.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[var(--border)] bg-white/70 px-4 py-4 text-sm text-[var(--muted)]">
          지금은 추천 리뷰가 없어요. 조금 뒤에 다시 확인해주세요.
        </div>
      ) : null}
      <div className="space-y-6">
        {items.map((review) => {
          const title = review.summary?.trim() || "추천 리뷰";
          const authorName =
            review.authorNickname?.trim() ||
            (review.userId ? `user-${review.userId}` : "리뷰어");
          const bookTitle = review.bookTitle?.trim() || "책 정보 없음";
          const snippet =
            review.content?.trim() ||
            review.summary?.trim() ||
            "추천된 리뷰를 확인해 보세요.";
          const tags = [review.source, review.reason].filter(
            (value): value is string => Boolean(value),
          );
          const topReaction = review.topReactions[0];
          const likeCount = review.likeCount ?? 0;
          const commentCount = review.commentCount ?? 0;
          const viewCount = review.viewCount ?? 0;

          return (
            <div
              key={review.reviewId}
              className="rounded-[28px] border border-[var(--border)] bg-white/90 p-6 shadow-[var(--shadow)] transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex flex-col gap-5 sm:flex-row">
                <Link
                  href={`/reviews/${review.reviewId}`}
                  className="h-28 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c]"
                  aria-label={`${title} 리뷰 상세로 이동`}
                >
                  {review.bookCoverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.bookCoverUrl}
                      alt={bookTitle}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </Link>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/reviews/${review.reviewId}`}
                        className="text-lg font-semibold text-[var(--ink)] transition hover:text-[var(--accent)]"
                      >
                        {title}
                      </Link>
                      <p className="mt-1 text-sm font-semibold text-[var(--ink)]">
                        {bookTitle}
                      </p>
                      <p className="text-sm text-[var(--muted)]">
                        {authorName}
                      </p>
                    </div>
                    {typeof review.rating === "number" ? (
                      <span className="rounded-full bg-[var(--paper-strong)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                        평점 {review.rating}
                      </span>
                    ) : null}
                  </div>
                  <Link
                    href={`/reviews/${review.reviewId}`}
                    className="line-clamp-3 mt-3 block text-sm leading-relaxed text-[var(--muted)]"
                  >
                    {snippet}
                  </Link>
                  {tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
                      {tags.slice(0, 3).map((tag) => (
                        <span
                          key={`${review.reviewId}-${tag}`}
                          className="rounded-full border border-[var(--border)] bg-white px-3 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                      {topReaction ? (
                        <span className="rounded-full border border-[var(--border)] px-3 py-1">
                          {topReaction.emoji} {topReaction.count}
                        </span>
                      ) : null}
                      <span className="rounded-full border border-[var(--border)] px-3 py-1">
                        좋아요 {likeCount}
                      </span>
                      <span className="rounded-full border border-[var(--border)] px-3 py-1">
                        댓글 {commentCount}
                      </span>
                      <span className="rounded-full border border-[var(--border)] px-3 py-1">
                        조회수 {viewCount}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
                      {review.rank ? (
                        <>
                          <span>#{review.rank}</span>
                          <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
                        </>
                      ) : null}
                      <span>{review.createdAt}</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          );
        })}
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
      {nextCursor && hasMore ? (
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
