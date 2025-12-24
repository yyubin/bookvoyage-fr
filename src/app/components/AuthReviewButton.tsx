"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

type AuthReviewButtonProps = {
  href: string;
  label?: string;
  className?: string;
};

export default function AuthReviewButton({
  href,
  label = "리뷰 쓰기",
  className,
}: AuthReviewButtonProps) {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return null;
  }

  return (
    <Link
      href={href}
      className={
        className ??
        "rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
      }
    >
      {label}
    </Link>
  );
}
