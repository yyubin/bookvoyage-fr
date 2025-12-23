"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = () => {
    const value = query.trim();
    if (!value) {
      return;
    }
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        className="w-full min-w-[220px] flex-1 rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
        placeholder="책 제목, 리뷰 내용, #태그 검색"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            submit();
          }
        }}
      />
      <button
        className="rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold text-white"
        onClick={submit}
        type="button"
      >
        검색
      </button>
    </div>
  );
}
