"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { UserBookResponse } from "../../../types/content";
import {
  updateUserBookMemo,
  updateUserBookProgress,
  updateUserBookRating,
  updateUserBookStatus,
} from "../../../services/userBookService";
import { getReviewExistence } from "../../../services/reviewWriteService";

type UserBookDetailClientProps = {
  initialBook: UserBookResponse;
};

const STATUS_OPTIONS = [
  { value: "WANT_TO_READ", label: "찜" },
  { value: "READING", label: "읽는 중" },
  { value: "COMPLETED", label: "완독" },
] as const;

const formatStatus = (status: string) => {
  switch (status) {
    case "READING":
      return "읽는 중";
    case "COMPLETED":
      return "완독";
    case "WANT_TO_READ":
      return "찜";
    default:
      return status;
  }
};

export default function UserBookDetailClient({
  initialBook,
}: UserBookDetailClientProps) {
  const [book, setBook] = useState<UserBookResponse>(initialBook);
  const [status, setStatus] = useState(initialBook.status);
  const [progress, setProgress] = useState(initialBook.progressPercentage);
  const [memo, setMemo] = useState(initialBook.memo ?? "");
  const [rating, setRating] = useState<number | "">(
    initialBook.rating ?? "",
  );
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [isSavingMemo, setIsSavingMemo] = useState(false);
  const [isSavingRating, setIsSavingRating] = useState(false);
  const [isCheckingReview, setIsCheckingReview] = useState(false);
  const [reviewExists, setReviewExists] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const showReviewCallout = book.status === "COMPLETED";
  const showReadingPrompt =
    book.status === "READING" || book.status === "WANT_TO_READ";
  const readingPrompt =
    book.status === "READING"
      ? "읽는 중인 책이에요. 남은 페이지를 이어서 읽어보세요."
      : "찜한 책이에요. 이번 주에 첫 장을 열어보는 건 어때요?";

  const handleStatusSave = async () => {
    if (isSavingStatus) {
      return;
    }
    setIsSavingStatus(true);
    setMessage(null);
    setError(null);
    try {
      const updated = await updateUserBookStatus(book.bookId, status);
      setBook(updated);
      setMessage("상태가 저장되었습니다.");
    } catch {
      setError("상태 저장에 실패했어요.");
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleProgressSave = async () => {
    if (isSavingProgress) {
      return;
    }
    setIsSavingProgress(true);
    setMessage(null);
    setError(null);
    try {
      const updated = await updateUserBookProgress(book.bookId, progress);
      setBook(updated);
      setMessage("진행률이 저장되었습니다.");
    } catch {
      setError("진행률 저장에 실패했어요.");
    } finally {
      setIsSavingProgress(false);
    }
  };

  const handleMemoSave = async () => {
    if (isSavingMemo) {
      return;
    }
    setIsSavingMemo(true);
    setMessage(null);
    setError(null);
    try {
      const updated = await updateUserBookMemo(book.bookId, memo.trim());
      setBook(updated);
      setMessage("메모가 저장되었습니다.");
    } catch {
      setError("메모 저장에 실패했어요.");
    } finally {
      setIsSavingMemo(false);
    }
  };

  const handleRatingSave = async () => {
    if (isSavingRating || rating === "") {
      return;
    }
    setIsSavingRating(true);
    setMessage(null);
    setError(null);
    try {
      const updated = await updateUserBookRating(book.bookId, rating);
      setBook(updated);
      setMessage("평점이 저장되었습니다.");
    } catch {
      setError("평점 저장에 실패했어요.");
    } finally {
      setIsSavingRating(false);
    }
  };

  useEffect(() => {
    if (book.status !== "COMPLETED") {
      setReviewExists(null);
      setIsCheckingReview(false);
      return;
    }
    let isActive = true;
    setIsCheckingReview(true);
    getReviewExistence(book.bookId)
      .then((response) => {
        if (isActive) {
          setReviewExists(response.hasReview);
        }
      })
      .catch(() => {
        if (isActive) {
          setReviewExists(null);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsCheckingReview(false);
        }
      });
    return () => {
      isActive = false;
    };
  }, [book.bookId, book.status]);

  return (
    <main className="mt-10 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[var(--shadow)]">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="h-44 w-32 flex-shrink-0 overflow-hidden rounded-3xl bg-[var(--paper-strong)] shadow-md">
          {book.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.coverUrl}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[var(--muted)]">
            {book.authors.join(", ")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--ink)]">
            {book.title}
          </h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            {book.publisher ?? "출판사 정보 없음"}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
            {book.description ?? "책 소개 정보를 준비 중입니다."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
            <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1">
              상태 {formatStatus(book.status)}
            </span>
            <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1">
              진행률 {book.progressPercentage}%
            </span>
            {book.rating ? (
              <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1">
                평점 {book.rating}
              </span>
            ) : null}
            {book.publishedDate ? (
              <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1">
                출간 {book.publishedDate}
              </span>
            ) : null}
          </div>
          {showReviewCallout ? (
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--paper-strong)] px-4 py-3">
              {isCheckingReview ? (
                <div className="text-sm font-semibold text-[var(--muted)]">
                  리뷰 작성 여부를 확인 중이에요.
                </div>
              ) : reviewExists ? (
                <div className="text-sm font-semibold text-[var(--ink)]">
                  이미 작성한 리뷰가 있는 책입니다.
                </div>
              ) : (
                <>
                  <div className="text-sm font-semibold text-[var(--ink)]">
                    완독한 책, 지금 리뷰로 남겨보세요.
                  </div>
                  <Link
                    href={`/reviews/new?q=${encodeURIComponent(book.title)}`}
                    className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    리뷰 쓰기
                  </Link>
                </>
              )}
            </div>
          ) : null}
          {showReadingPrompt ? (
            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--muted)]">
              {readingPrompt}
            </div>
          ) : null}
        </div>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] border border-[var(--border)] bg-white/80 p-6">
          <h3 className="text-sm font-semibold text-[var(--muted)]">
            독서 상태
          </h3>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)]"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleStatusSave}
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
              disabled={isSavingStatus}
            >
              {isSavingStatus ? "저장 중" : "상태 저장"}
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--border)] bg-white/80 p-6">
          <h3 className="text-sm font-semibold text-[var(--muted)]">
            진행률
          </h3>
          <div className="mt-4 space-y-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--card)]">
              <div
                className="h-full rounded-full bg-[var(--ink)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(event) => setProgress(Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--paper-strong)] accent-[var(--ink)] disabled:cursor-not-allowed"
                disabled={book.status === "COMPLETED"}
              />
              <div className="text-sm font-semibold text-[var(--muted)]">
                {progress}%
              </div>
            </div>
            <button
              type="button"
              onClick={handleProgressSave}
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
              disabled={isSavingProgress || book.status === "COMPLETED"}
            >
              {isSavingProgress ? "저장 중" : "진행률 저장"}
            </button>
            {book.status === "COMPLETED" ? (
              <p className="text-xs text-[var(--muted)]">
                완독 상태에서는 진행률을 변경할 수 없습니다.
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--border)] bg-white/80 p-6">
          <h3 className="text-sm font-semibold text-[var(--muted)]">
            평점
          </h3>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <select
              value={rating}
              onChange={(event) =>
                setRating(
                  event.target.value === ""
                    ? ""
                    : Number(event.target.value),
                )
              }
              className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)]"
            >
              <option value="">평점 선택</option>
              {Array.from({ length: 5 }).map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}점
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleRatingSave}
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
              disabled={isSavingRating || rating === ""}
            >
              {isSavingRating ? "저장 중" : "평점 저장"}
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--border)] bg-white/80 p-6">
          <h3 className="text-sm font-semibold text-[var(--muted)]">메모</h3>
          <div className="mt-4 space-y-3">
            <textarea
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              placeholder="책에 대한 감상이나 메모를 기록하세요."
              className="h-32 w-full resize-none rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
            />
            <button
              type="button"
              onClick={handleMemoSave}
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
              disabled={isSavingMemo}
            >
              {isSavingMemo ? "저장 중" : "메모 저장"}
            </button>
          </div>
        </div>
      </section>

      {message ? (
        <p className="mt-6 text-sm font-semibold text-[var(--accent)]">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-6 text-sm font-semibold text-rose-500">{error}</p>
      ) : null}
    </main>
  );
}
