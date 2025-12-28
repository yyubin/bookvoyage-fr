"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { BookSearchItem, ReviewSearchItem } from "../types/content";
import { searchBooks, searchReviews } from "../services/searchService";
import AddToLibraryButton from "../components/AddToLibraryButton";

type SearchResultsClientProps = {
  initialBooks: BookSearchItem[];
  initialBookNext: number | null;
  initialReviews: ReviewSearchItem[];
  initialReviewNext: number | null;
  bookQuery: string;
  reviewQuery: string;
  bookOptions: {
    size: number;
    language?: string;
    orderBy?: string;
    printType?: string;
  };
  reviewOptions: {
    size: number;
    genre?: string;
    minRating?: number;
    maxRating?: number;
    startDate?: string;
    endDate?: string;
    highlight?: string;
    sortBy?: string;
  };
};

export default function SearchResultsClient({
  initialBooks,
  initialBookNext,
  initialReviews,
  initialReviewNext,
  bookQuery,
  reviewQuery,
  bookOptions,
  reviewOptions,
}: SearchResultsClientProps) {
  const [books, setBooks] = useState(initialBooks);
  const [bookNext, setBookNext] = useState(initialBookNext);
  const [reviews, setReviews] = useState(initialReviews);
  const [reviewNext, setReviewNext] = useState(initialReviewNext);
  const [isBookLoading, setIsBookLoading] = useState(false);
  const [isReviewLoading, setIsReviewLoading] = useState(false);

  const bookSentinel = useRef<HTMLDivElement | null>(null);
  const reviewSentinel = useRef<HTMLDivElement | null>(null);

  const loadMoreBooks = useCallback(async () => {
    if (isBookLoading || bookNext === null || !bookQuery) {
      return;
    }
    setIsBookLoading(true);
    const page = await searchBooks(bookQuery, {
      startIndex: bookNext,
      size: bookOptions.size,
      language: bookOptions.language,
      orderBy: bookOptions.orderBy,
      printType: bookOptions.printType,
    });
    setBooks((prev) => [...prev, ...page.items]);
    setBookNext(page.nextStartIndex);
    setIsBookLoading(false);
  }, [bookNext, bookOptions, bookQuery, isBookLoading]);

  const loadMoreReviews = useCallback(async () => {
    if (isReviewLoading || reviewNext === null || !reviewQuery) {
      return;
    }
    setIsReviewLoading(true);
    const page = await searchReviews(reviewQuery, {
      cursor: reviewNext,
      size: reviewOptions.size,
      genre: reviewOptions.genre,
      minRating: reviewOptions.minRating,
      maxRating: reviewOptions.maxRating,
      startDate: reviewOptions.startDate,
      endDate: reviewOptions.endDate,
      highlight: reviewOptions.highlight,
      sortBy: reviewOptions.sortBy,
    });
    setReviews((prev) => [...prev, ...page.items]);
    setReviewNext(page.nextCursor);
    setIsReviewLoading(false);
  }, [isReviewLoading, reviewNext, reviewOptions, reviewQuery]);

  useEffect(() => {
    const sentinel = bookSentinel.current;
    if (!sentinel || bookNext === null) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMoreBooks();
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [bookNext, loadMoreBooks]);

  useEffect(() => {
    const sentinel = reviewSentinel.current;
    if (!sentinel || reviewNext === null) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMoreReviews();
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [reviewNext, loadMoreReviews]);

  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[32px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-serif text-2xl font-semibold">리뷰 결과</h3>
          <span className="text-xs font-semibold text-[var(--muted)]">
            {reviews.length}건
          </span>
        </div>
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
                    {review.bookTitle ?? "책 제목"}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {review.authorNickname ??
                      (review.userId ? `user-${review.userId}` : "리뷰어")}
                    {review.createdAt ? ` · ${review.createdAt}` : ""}
                  </p>
                </div>
                <span className="text-xs text-[var(--muted)]">
                  {review.rating ? `평점 ${review.rating}` : "평점 없음"}
                </span>
              </div>
              <p className="mt-3 text-sm text-[var(--muted)]">
                {review.summary}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                {review.keywords.slice(0, 3).map((keyword) => (
                  <span
                    key={`${review.reviewId}-${keyword}`}
                    className="rounded-full border border-[var(--border)] bg-white px-3 py-1"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </Link>
          ))}
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
              검색된 리뷰가 없습니다.
            </div>
          ) : null}
        </div>
        {reviewNext !== null ? (
          <div className="mt-4 flex justify-center">
            <div
              ref={reviewSentinel}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--muted)]"
            >
              {isReviewLoading ? "불러오는 중..." : "다음 리뷰 불러오기"}
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-[32px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-serif text-2xl font-semibold">책 결과</h3>
          <span className="text-xs font-semibold text-[var(--muted)]">
            {books.length}건
          </span>
        </div>
        <div className="mt-5 space-y-4">
          {books.map((book) => {
            const identifier =
              book.googleVolumeId ?? book.isbn13 ?? book.isbn10 ?? "book";
            const detailParams = new URLSearchParams({
              title: book.title,
              authors: book.authors.join(", "),
              coverUrl: book.coverUrl ?? "",
              publisher: book.publisher ?? "",
              description: book.description ?? "",
            });
            return (
              <div
                key={`${book.title}-${identifier}`}
                className="rounded-2xl border border-[var(--border)] bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link
                  href={`/books/external/${identifier}?${detailParams.toString()}`}
                  className="block"
                >
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {book.title}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {book.authors.join(", ")}
                  </p>
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    {book.publisher ?? "출판사 정보 없음"}
                  </p>
                </Link>
                <div className="mt-3">
                  <AddToLibraryButton book={book} />
                </div>
              </div>
            );
          })}
          {books.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
              검색된 책이 없습니다.
            </div>
          ) : null}
        </div>
        {bookNext !== null ? (
          <div className="mt-4 flex justify-center">
            <div
              ref={bookSentinel}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--muted)]"
            >
              {isBookLoading ? "불러오는 중..." : "다음 책 불러오기"}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
