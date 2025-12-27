"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { BookSearchItem } from "../types/content";
import { addUserBook } from "../services/userBookService";
import { useAuth } from "./AuthProvider";

type AddToLibraryButtonProps = {
  book: BookSearchItem;
};

const STATUS_OPTIONS = [
  { value: "READING", label: "읽는 중" },
  { value: "COMPLETED", label: "완독" },
  { value: "WANT_TO_READ", label: "찜" },
] as const;

export default function AddToLibraryButton({ book }: AddToLibraryButtonProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(STATUS_OPTIONS[0].value);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const redirectUrl = useMemo(() => {
    const query = searchParams?.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  const handleAdd = async () => {
    if (isSaving || isLoading) {
      return;
    }
    if (!user) {
      router.push(`/auth?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }
    setIsSaving(true);
    setMessage(null);
    setError(null);
    try {
      await addUserBook(book, status);
      setMessage("서재에 추가됨");
    } catch {
      setError("추가에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)]"
        aria-label="서재 상태 선택"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleAdd}
        className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-white shadow-sm"
        disabled={isSaving || isLoading}
      >
        {isSaving ? "추가 중" : "서재에 추가"}
      </button>
      {message ? (
        <span className="text-xs font-semibold text-[var(--accent)]">
          {message}
        </span>
      ) : null}
      {error ? (
        <span className="text-xs font-semibold text-rose-500">{error}</span>
      ) : null}
    </div>
  );
}
