"use client";

import { useState } from "react";
import type { ReviewComment } from "../../types/content";

type CommentModalTriggerProps = {
  commentsCount: string;
  commentList: ReviewComment[];
};

export default function CommentModalTrigger({
  commentsCount,
  commentList,
}: CommentModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

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
              {commentList.map((comment) => (
                <div
                  key={`${comment.user}-${comment.time}`}
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
                >
                  <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                    <span className="font-semibold text-[var(--ink)]">
                      {comment.user}
                    </span>
                    <span>{comment.time}</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <textarea
                className="h-28 w-full resize-none rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                placeholder="댓글을 남겨보세요."
              />
              <div className="mt-3 flex justify-end">
                <button
                  className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white"
                  type="button"
                >
                  댓글 등록
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
