"use client";

import { useState } from "react";

type SpoilerToggleProps = {
  isSpoiler: boolean;
  content: string;
};

export default function SpoilerToggle({
  isSpoiler,
  content,
}: SpoilerToggleProps) {
  const [revealed, setRevealed] = useState(!isSpoiler);

  return (
    <div className="space-y-3">
      {isSpoiler ? (
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[var(--muted)]">
          <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1">
            스포일러 포함
          </span>
          <button
            className="rounded-full border border-[var(--border)] px-3 py-1 transition hover:border-transparent hover:bg-[var(--paper-strong)]"
            onClick={() => setRevealed((prev) => !prev)}
            type="button"
          >
            {revealed ? "숨기기" : "본문 보기"}
          </button>
        </div>
      ) : null}

      <div className="relative">
        <p
          className={`text-base leading-relaxed text-[var(--muted)] transition ${
            revealed ? "" : "blur-sm select-none"
          }`}
        >
          {content}
        </p>
        {!revealed ? (
          <div className="pointer-events-none absolute inset-0 rounded-[18px] bg-white/60" />
        ) : null}
      </div>
    </div>
  );
}
