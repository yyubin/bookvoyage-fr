"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createComment,
  deleteComment,
  getCommentsByReview,
  getRepliesByComment,
  updateComment,
} from "../../services/commentService";
import type { CommentResponse } from "../../types/content";

type CommentModalTriggerProps = {
  reviewId: number;
  commentsCount: number;
  initialComments: CommentResponse[];
  initialCursor: number | null;
  viewerId?: number | null;
};

export default function CommentModalTrigger({
  reviewId,
  commentsCount,
  initialComments,
  initialCursor,
  viewerId,
}: CommentModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [nextCursor, setNextCursor] = useState(initialCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [totalCount, setTotalCount] = useState(commentsCount);
  const [repliesByParent, setRepliesByParent] = useState<
    Record<
      number,
      { items: CommentResponse[]; nextCursor: number | null; totalCount: number }
    >
  >({});
  const [loadingReplies, setLoadingReplies] = useState<Set<number>>(
    () => new Set(),
  );
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(
    () => new Set(),
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { rootComments } = useMemo(() => {
    const roots: CommentResponse[] = [];
    comments.forEach((comment) => {
      if (!comment.parentCommentId) {
        roots.push(comment);
      }
    });
    return { rootComments: roots };
  }, [comments]);

  const refreshComments = async () => {
    const page = await getCommentsByReview(reviewId, {
      cursor: null,
      limit: 8,
    });
    setComments(page.comments);
    setNextCursor(page.nextCursor);
    setTotalCount(page.totalCount);
  };

  const loadReplies = async (commentId: number, cursor: number | null) => {
    if (loadingReplies.has(commentId)) {
      return;
    }
    setLoadingReplies((prev) => new Set(prev).add(commentId));
    try {
      const page = await getRepliesByComment(commentId, {
        cursor,
        limit: 8,
      });
      setRepliesByParent((prev) => {
        const existing = prev[commentId];
        const items = existing ? [...existing.items, ...page.comments] : page.comments;
        return {
          ...prev,
          [commentId]: {
            items,
            nextCursor: page.nextCursor,
            totalCount: page.totalCount,
          },
        };
      });
    } finally {
      setLoadingReplies((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

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
      await refreshComments();
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

  const renderComment = (comment: CommentResponse, depth = 0) => {
    const isOwner =
      viewerId !== undefined && viewerId !== null && comment.userId === viewerId;
    const isExpanded = expandedReplies.has(comment.commentId);
    const replyState = repliesByParent[comment.commentId];
    const loadedReplies = replyState?.items ?? [];
    const repliesNextCursor = replyState?.nextCursor ?? null;
    const repliesTotal = replyState?.totalCount ?? comment.replyCount;
    const hasReplies = repliesTotal > 0;
    const isReplyLoading = loadingReplies.has(comment.commentId);

    return (
      <div
        key={comment.commentId}
        className={`rounded-2xl border border-[var(--border)] bg-white px-4 py-3 ${depth > 0 ? "ml-6 border-dashed" : ""}`}
      >
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <Link
            href={`/profile/${comment.userId}`}
            className="font-semibold text-[var(--ink)] transition hover:text-[var(--accent)]"
          >
            {comment.authorNickname ?? `user-${comment.userId}`}
          </Link>
          <div className="flex items-center gap-2">
            <span>{comment.createdAt}</span>
            {isOwner ? (
              <div className="flex items-center gap-1 text-[10px] text-[var(--muted)]">
                <button
                  type="button"
                  className="rounded-full border border-[var(--border)] px-2 py-0.5 transition hover:border-transparent hover:bg-[var(--paper-strong)]"
                  onClick={() => {
                    setEditingCommentId(comment.commentId);
                    setEditContent(comment.content);
                  }}
                >
                  수정
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[var(--border)] px-2 py-0.5 transition hover:border-transparent hover:bg-[var(--paper-strong)]"
                  onClick={async () => {
                    if (isSubmitting) {
                      return;
                    }
                    if (!window.confirm("댓글을 삭제할까요?")) {
                      return;
                    }
                    const parentId = comment.parentCommentId;
                    setIsSubmitting(true);
                    setSubmitError(null);
                    try {
                      await deleteComment(comment.commentId);
                      await refreshComments();
                      if (parentId && expandedReplies.has(parentId)) {
                        setRepliesByParent((prev) => {
                          const next = { ...prev };
                          delete next[parentId];
                          return next;
                        });
                        void loadReplies(parentId, null);
                      }
                    } catch {
                      setSubmitError("댓글 삭제에 실패했어요.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  삭제
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {editingCommentId === comment.commentId ? (
          <div className="mt-3">
            <textarea
              value={editContent}
              onChange={(event) => setEditContent(event.target.value)}
              className="h-24 w-full resize-none rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
            />
            <div className="mt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                className="rounded-full border border-[var(--border)] px-3 py-1"
                onClick={() => {
                  setEditingCommentId(null);
                  setEditContent("");
                }}
              >
                취소
              </button>
              <button
                type="button"
                className="rounded-full bg-[var(--ink)] px-3 py-1 font-semibold text-white"
                onClick={async () => {
                  if (!editContent.trim() || isSubmitting) {
                    return;
                  }
                  setIsSubmitting(true);
                  setSubmitError(null);
                  try {
                    await updateComment(comment.commentId, editContent.trim());
                    setEditingCommentId(null);
                    setEditContent("");
                    await refreshComments();
                  } catch {
                    setSubmitError("댓글 수정에 실패했어요.");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-[var(--muted)]">{comment.content}</p>
        )}

        <div className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)]">
          <button
            type="button"
            className="rounded-full border border-[var(--border)] px-3 py-1 transition hover:border-transparent hover:bg-[var(--paper-strong)]"
            onClick={() => {
              setActiveReplyId((prev) =>
                prev === comment.commentId ? null : comment.commentId,
              );
              setReplyContent("");
            }}
          >
            답글
          </button>
          {hasReplies ? (
            <button
              type="button"
              className="text-[11px] text-[var(--muted)] underline-offset-4 transition hover:text-[var(--ink)] hover:underline"
              onClick={() => {
                setExpandedReplies((prev) => {
                  const next = new Set(prev);
                  if (next.has(comment.commentId)) {
                    next.delete(comment.commentId);
                  } else {
                    next.add(comment.commentId);
                  }
                  return next;
                });
                if (!replyState) {
                  void loadReplies(comment.commentId, null);
                }
              }}
            >
              {isExpanded ? "답글 숨기기" : `답글 ${repliesTotal}개`}
            </button>
          ) : null}
        </div>

        {activeReplyId === comment.commentId ? (
          <div className="mt-3 rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3">
            <textarea
              value={replyContent}
              onChange={(event) => setReplyContent(event.target.value)}
              className="h-20 w-full resize-none bg-transparent text-sm text-[var(--ink)] outline-none"
              placeholder="답글을 남겨보세요."
            />
            <div className="mt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                className="rounded-full border border-[var(--border)] px-3 py-1"
                onClick={() => {
                  setActiveReplyId(null);
                  setReplyContent("");
                }}
              >
                취소
              </button>
              <button
                type="button"
                className="rounded-full bg-[var(--ink)] px-3 py-1 font-semibold text-white"
                onClick={async () => {
                  if (!replyContent.trim() || isSubmitting) {
                    return;
                  }
                  setIsSubmitting(true);
                  setSubmitError(null);
                  try {
                    await createComment(
                      reviewId,
                      replyContent.trim(),
                      comment.commentId,
                    );
                    setActiveReplyId(null);
                    setReplyContent("");
                    await refreshComments();
                    setRepliesByParent((prev) => {
                      const next = { ...prev };
                      delete next[comment.commentId];
                      return next;
                    });
                    void loadReplies(comment.commentId, null);
                  } catch {
                    setSubmitError("답글 등록에 실패했어요.");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                답글 등록
              </button>
            </div>
          </div>
        ) : null}

        {isExpanded ? (
          <div className="mt-3 space-y-3 border-l border-[var(--border)] pl-4">
            {loadedReplies.map((reply) => renderComment(reply, depth + 1))}
            {isReplyLoading && loadedReplies.length === 0 ? (
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-xs text-[var(--muted)]">
                답글을 불러오는 중...
              </div>
            ) : null}
            {repliesNextCursor ? (
              <button
                type="button"
                className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)] transition hover:border-transparent hover:bg-[var(--paper-strong)]"
                onClick={() => void loadReplies(comment.commentId, repliesNextCursor)}
                disabled={isReplyLoading}
              >
                {isReplyLoading ? "불러오는 중..." : "답글 더보기"}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <button
        className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)] transition hover:border-transparent hover:bg-[var(--paper-strong)]"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        댓글 {totalCount}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]"
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
            <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1 text-sm">
              {rootComments.map((comment) => renderComment(comment))}
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
                    if (!newComment.trim() || isSubmitting) {
                      return;
                    }
                    setIsSubmitting(true);
                    setSubmitError(null);
                    try {
                      await createComment(reviewId, newComment.trim());
                      setNewComment("");
                      await refreshComments();
                    } catch {
                      setSubmitError("댓글 등록에 실패했어요.");
                    } finally {
                      setIsSubmitting(false);
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
