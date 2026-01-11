"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetchJson } from "../services/apiClient";
import { useAuth } from "./AuthProvider";

type LoginPayload = {
  email: string;
  password: string;
};

export default function AuthLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = searchParams?.get("redirect") || "/";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await apiFetchJson("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password } satisfies LoginPayload),
      });
      await refreshUser();
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("로그인에 실패했어요. 이메일과 비밀번호를 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]"
        >
          이메일
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--ink)] shadow-sm"
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]"
        >
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--ink)] shadow-sm"
          placeholder="비밀번호를 입력하세요"
        />
      </div>
      {error ? (
        <p className="text-xs font-semibold text-rose-500">{error}</p>
      ) : null}
      <button
        type="submit"
        className="w-full rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
        disabled={isSubmitting}
      >
        {isSubmitting ? "로그인 중..." : "이메일로 로그인"}
      </button>
    </form>
  );
}
