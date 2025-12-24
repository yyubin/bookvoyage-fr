"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function AuthButtons() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <button
        type="button"
        className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--muted)]"
        disabled
      >
        로그인 확인 중
      </button>
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth"
        className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        로그인
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      로그아웃
    </button>
  );
}
