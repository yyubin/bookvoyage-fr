"use client";

import { useMemo, useState } from "react";

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

export default function ReviewReactions() {
  const [reactions, setReactions] = useState<ReactionItem[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) {
      return EMOJI_POOL;
    }
    return EMOJI_POOL.filter((emoji) => emoji.includes(search.trim()));
  }, [search]);

  const toggleReaction = (emoji: string) => {
    setReactions((prev) => {
      const existing = prev.find((item) => item.emoji === emoji);
      if (!existing) {
        return [...prev, { emoji, count: 1, selected: true }];
      }
      return prev.map((item) => {
        if (item.emoji !== emoji) {
          return item;
        }
        const nextSelected = !item.selected;
        return {
          ...item,
          selected: nextSelected,
          count: Math.max(0, item.count + (nextSelected ? 1 : -1)),
        };
      });
    });
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
        onClick={() => setBookmarked((prev) => !prev)}
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
            className={`inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-2 transition ${
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
                    className="rounded-full border border-transparent p-2 transition hover:bg-[var(--paper-strong)]"
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
