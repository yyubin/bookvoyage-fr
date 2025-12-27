"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createComment, getCommentsByReview } from "../../services/commentService";
import type { CommentResponse } from "../../types/content";

type CommentModalTriggerProps = {
  reviewId: number;
  commentsCount: number;
  initialComments: CommentResponse[];
  initialCursor: number | null;
};

export default function CommentModalTrigger({
  reviewId,
  commentsCount,
  initialComments,
  initialCursor,
}: CommentModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [nextCursor, setNextCursor] = useState(initialCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = async () => {
    if (!nextCursor || isLoading) {
      return;
    }
    setIsLoading(true);
    const page = await getCommentsByReview(reviewId, {
      cursor: nextCursor,
      limit: 8,
    });
    setComments((prev) => [...prev, ...page.comments]);
    setNextCursor(page.nextCursor);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const refresh = async () => {
      setIsLoading(true);
      const page = await getCommentsByReview(reviewId, {
        cursor: null,
        limit: 8,
      });
      setComments(page.comments);
      setNextCursor(page.nextCursor);
      setIsLoading(false);
    };

    void refresh();
  }, [isOpen, reviewId]);

  useEffect(() => {
    if (!isOpen || !nextCursor) {
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
  }, [isOpen, nextCursor]);

  return (
    <>
      <button
        className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)] transition hover:border-transparent hover:bg-[var(--paper-strong)]"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        댓글 {commentsCount}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-serif text-xl font-semibold">댓글</h3>
              <button
                className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)]"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                닫기
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              {comments.map((comment) => (
                <div
                  key={comment.commentId}
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
                >
                  <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                    <Link
                      href={`/profile/${comment.userId}`}
                      className="font-semibold text-[var(--ink)] transition hover:text-[var(--accent)]"
                    >
                      user-{comment.userId}
                    </Link>
                    <span>{comment.createdAt}</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {comment.content}
                  </p>
                </div>
              ))}
              {isLoading && comments.length === 0
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`comment-skeleton-${index}`}
                      className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="h-3 w-16 animate-pulse rounded bg-[var(--paper-strong)]" />
                        <div className="h-3 w-10 animate-pulse rounded bg-[var(--paper-strong)]" />
                      </div>
                      <div className="mt-3 h-3 w-full animate-pulse rounded bg-[var(--paper-strong)]" />
                      <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-[var(--paper-strong)]" />
                    </div>
                  ))
                : null}
            </div>
            {nextCursor ? (
              <div className="mt-4 flex justify-center">
                <div
                  ref={sentinelRef}
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--muted)]"
                >
                  {isLoading ? "불러오는 중..." : "다음 댓글 불러오기"}
                </div>
              </div>
            ) : null}
            <div className="mt-5">
              <textarea
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                className="h-28 w-full resize-none rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                placeholder="댓글을 남겨보세요."
              />
              <div className="mt-3 flex justify-end">
                <button
                  className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white"
                  onClick={async () => {
                    if (!newComment.trim() || isLoading) {
                      return;
                    }
                    setIsLoading(true);
                    setSubmitError(null);
                    try {
                      await createComment(reviewId, newComment.trim());
                      setNewComment("");
                      const page = await getCommentsByReview(reviewId, {
                        cursor: null,
                        limit: 8,
                      });
                      setComments(page.comments);
                      setNextCursor(page.nextCursor);
                    } catch {
                      setSubmitError("댓글 등록에 실패했어요.");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  type="button"
                >
                  댓글 등록
                </button>
              </div>
              {submitError ? (
                <p className="mt-3 text-xs text-rose-500">{submitError}</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
