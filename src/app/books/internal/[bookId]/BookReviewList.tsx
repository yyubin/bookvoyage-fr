"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getBookReviews } from "../../../services/bookReviewService";
import type { BookReviewItem } from "../../../types/content";

type BookReviewListProps = {
  bookId: number;
  initialReviews: BookReviewItem[];
  initialCursor: number | null;
  totalCount: number;
};

export default function BookReviewList({
  bookId,
  initialReviews,
  initialCursor,
  totalCount,
}: BookReviewListProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [nextCursor, setNextCursor] = useState<number | null>(initialCursor);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = async () => {
    if (!nextCursor || isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const page = await getBookReviews(bookId, {
        cursor: nextCursor,
        size: 20,
        sort: "recommended",
      });
      setReviews((prev) => [...prev, ...page.reviews]);
      setNextCursor(page.nextCursor);
    } finally {
      setIsLoading(false);
    }
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
      { rootMargin: "160px" },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [nextCursor]);

  return (
    <section className="mt-12 rounded-[32px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-semibold">리뷰 모아보기</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            총 {totalCount}개의 리뷰가 있어요.
          </p>
        </div>
      </div>
      {reviews.length > 0 ? (
        <div className="mt-5 space-y-4">
          {reviews.map((review) => (
            <Link
              key={review.reviewId}
              href={`/reviews/${review.reviewId}`}
              className="block rounded-2xl border border-[var(--border)] bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {review.authorNickname ??
                      (review.userId ? `user-${review.userId}` : "리뷰어")}
                  </p>
                  {typeof review.rating === "number" ? (
                    <p className="text-xs text-[var(--muted)]">
                      평점 {review.rating}
                    </p>
                  ) : null}
                </div>
                <span className="text-xs text-[var(--muted)]">
                  {review.createdAt ?? ""}
                </span>
              </div>
              {review.content ? (
                <p
                  className="mt-3 text-sm text-[var(--muted)]"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {review.content}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                {review.likeCount ? (
                  <span className="rounded-full border border-[var(--border)] bg-white px-2 py-1">
                    좋아요 {review.likeCount}
                  </span>
                ) : null}
                {review.commentCount ? (
                  <span className="rounded-full border border-[var(--border)] bg-white px-2 py-1">
                    댓글 {review.commentCount}
                  </span>
                ) : null}
                {review.viewCount ? (
                  <span className="rounded-full border border-[var(--border)] bg-white px-2 py-1">
                    조회수 {review.viewCount}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
          아직 등록된 리뷰가 없어요. 첫 리뷰를 작성해보세요.
        </div>
      )}

      {nextCursor ? (
        <div className="mt-5 flex justify-center">
          <div
            ref={sentinelRef}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--muted)]"
          >
            {isLoading ? "불러오는 중..." : "다음 리뷰 불러오기"}
          </div>
        </div>
      ) : null}
    </section>
  );
}
