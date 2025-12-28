"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import {
  deleteReaction,
  upsertReaction,
} from "../../services/reviewReactionService";
import {
  addBookmark,
  removeBookmark,
} from "../../services/bookmarkService";

type ReactionItem = {
  emoji: string;
  count: number;
  selected: boolean;
};

const EMOJI_POOL = [
  "✨",
  "📖",
  "💬",
  "🌿",
  "🔥",
  "❤️",
  "👏",
  "😮",
  "😂",
  "😭",
  "🤔",
  "😢",
  "😍",
  "🥺",
  "👍",
  "👀",
  "🫶",
  "💡",
  "☕",
  "🌙",
  "🎯",
  "📝",
  "🧠",
  "🌊",
  "🌸",
  "🌻",
  "🍀",
  "⚡",
  "🎧",
  "🎬",
] as const;

type ReviewReactionsProps = {
  reviewId: number | string;
  initialBookmarked?: boolean;
  initialReactions?: { emoji: string; count: number }[];
  initialUserReaction?: string | null;
};

export default function ReviewReactions({
  reviewId,
  initialBookmarked,
  initialReactions,
  initialUserReaction,
}: ReviewReactionsProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [reactions, setReactions] = useState<ReactionItem[]>(
    (initialReactions ?? []).map((item) => ({
      ...item,
      selected: item.emoji === initialUserReaction,
    })),
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(initialBookmarked ?? false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(
    initialUserReaction ?? null,
  );
  const [isReactionSaving, setIsReactionSaving] = useState(false);
  const [isBookmarkSaving, setIsBookmarkSaving] = useState(false);

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) {
      return EMOJI_POOL;
    }
    return EMOJI_POOL.filter((emoji) => emoji.includes(search.trim()));
  }, [search]);

  const updateReactionState = (emoji: string, nextSelected: boolean) => {
    setReactions((prev) => {
      const existing = prev.find((item) => item.emoji === emoji);
      if (!existing && nextSelected) {
        return [...prev, { emoji, count: 1, selected: true }];
      }
      return prev
        .map((item) => {
          if (item.emoji !== emoji) {
            return item;
          }
          const nextCount = Math.max(0, item.count + (nextSelected ? 1 : -1));
          return {
            ...item,
            selected: nextSelected,
            count: nextCount,
          };
        })
        .filter((item) => item.count > 0 || item.selected);
    });
  };

  const replaceSelectedReaction = (nextEmoji: string) => {
    setReactions((prev) => {
      const nextItems = prev.map((item) => {
        if (item.emoji === selectedEmoji) {
          return {
            ...item,
            selected: false,
            count: Math.max(0, item.count - 1),
          };
        }
        if (item.emoji === nextEmoji) {
          return {
            ...item,
            selected: true,
            count: item.count + 1,
          };
        }
        return item;
      });

      if (!nextItems.some((item) => item.emoji === nextEmoji)) {
        nextItems.push({ emoji: nextEmoji, count: 1, selected: true });
      }

      return nextItems.filter((item) => item.count > 0 || item.selected);
    });
  };

  const ensureSignedIn = () => {
    if (isLoading) {
      return false;
    }
    if (!user) {
      router.push(`/auth?redirect=/reviews/${reviewId}`);
      return false;
    }
    return true;
  };

  const toggleReaction = async (emoji: string) => {
    if (!ensureSignedIn() || isReactionSaving) {
      return;
    }

    setIsReactionSaving(true);
    try {
      if (selectedEmoji === emoji) {
        await deleteReaction(reviewId);
        updateReactionState(emoji, false);
        setSelectedEmoji(null);
      } else {
        await upsertReaction(reviewId, emoji);
        if (selectedEmoji) {
          replaceSelectedReaction(emoji);
        } else {
          updateReactionState(emoji, true);
        }
        setSelectedEmoji(emoji);
      }
    } finally {
      setIsReactionSaving(false);
    }
  };

  const toggleBookmark = async () => {
    if (!ensureSignedIn() || isBookmarkSaving) {
      return;
    }

    setIsBookmarkSaving(true);
    try {
      if (bookmarked) {
        await removeBookmark(reviewId);
        setBookmarked(false);
      } else {
        await addBookmark(reviewId);
        setBookmarked(true);
      }
    } finally {
      setIsBookmarkSaving(false);
    }
  };

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
      <button
        type="button"
        onClick={() => setLiked((prev) => !prev)}
        className={`inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-2 transition ${
          liked
            ? "bg-[var(--ink)] text-white"
            : "bg-white text-[var(--ink)] hover:border-transparent hover:bg-[var(--paper-strong)]"
        }`}
      >
        <span aria-hidden="true">{liked ? "♥" : "♡"}</span>
        좋아요
      </button>
      <button
        type="button"
        onClick={toggleBookmark}
        disabled={isBookmarkSaving}
        className={`inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-2 transition ${
          bookmarked
            ? "bg-[var(--accent)] text-white"
            : "bg-white text-[var(--ink)] hover:border-transparent hover:bg-[var(--paper-strong)]"
        }`}
      >
        <span aria-hidden="true">🔖</span>
        북마크
      </button>

      <div className="flex flex-wrap items-center gap-2">
        {reactions.map((reaction) => (
          <button
            key={reaction.emoji}
            type="button"
            onClick={() => toggleReaction(reaction.emoji)}
            disabled={isReactionSaving}
            className={`inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-60 ${
              reaction.selected
                ? "bg-[var(--paper-strong)] text-[var(--ink)]"
                : "bg-white text-[var(--muted)] hover:border-transparent hover:bg-[var(--paper-strong)]"
            }`}
          >
            <span aria-hidden="true">{reaction.emoji}</span>
            <span>{reaction.count}</span>
          </button>
        ))}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPickerOpen((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-[var(--ink)] transition hover:border-transparent hover:bg-[var(--paper-strong)]"
          >
            <span aria-hidden="true">＋</span>
            리액션 추가
          </button>
          {isPickerOpen ? (
            <div className="absolute left-0 top-12 z-20 w-64 rounded-[20px] border border-[var(--border)] bg-white p-3 shadow-[var(--shadow)]">
              <div className="flex items-center gap-2">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="이모지 검색"
                  className="w-full rounded-full border border-[var(--border)] px-3 py-2 text-xs text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                />
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(false)}
                  className="shrink-0 rounded-full border border-[var(--border)] px-2 py-1 text-[10px] font-semibold text-[var(--muted)]"
                >
                  닫기
                </button>
              </div>
              <div className="mt-3 grid max-h-48 grid-cols-6 gap-2 overflow-auto text-lg">
                {filteredEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => toggleReaction(emoji)}
                    disabled={isReactionSaving}
                    className="rounded-full border border-transparent p-2 transition hover:bg-[var(--paper-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label={`${emoji} 리액션`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {filteredEmojis.length === 0 ? (
                <p className="mt-3 text-xs text-[var(--muted)]">
                  표시할 이모지가 없어요.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
