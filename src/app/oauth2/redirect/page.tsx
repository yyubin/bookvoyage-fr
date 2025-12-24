"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const errorMessage = useMemo(() => {
    if (!errorParam) {
      return null;
    }
    try {
      return decodeURIComponent(errorParam);
    } catch {
      return errorParam;
    }
  }, [errorParam]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push(errorMessage ? "/auth" : "/");
    }, 1200);

    return () => clearTimeout(timeout);
  }, [router, errorMessage]);

  return (
    <div className="paper-texture min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 pb-16 pt-8 text-center sm:px-8">
        <div className="rounded-[32px] border border-white/70 bg-white/80 px-8 py-10 shadow-[var(--shadow)]">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
            OAuth 2.0
          </p>
          <h1 className="mt-4 font-serif text-3xl font-semibold">
            {errorMessage ? "로그인에 실패했어요." : "로그인 완료 중"}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
            {errorMessage
              ? `에러 메시지: ${errorMessage}`
              : "구글 계정 인증이 완료되었습니다. 메인 화면으로 이동합니다."}
          </p>
          <p className="mt-6 text-xs text-[var(--muted)]">
            잠시만 기다려 주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
