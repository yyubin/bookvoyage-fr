import Link from "next/link";
import LogoMark from "../components/LogoMark";

export default function UnauthorizedPage() {
  return (
    <div className="paper-texture min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 pb-16 pt-8 text-center sm:px-8">
        <div className="rounded-[32px] border border-white/70 bg-white/80 px-8 py-10 shadow-[var(--shadow)]">
          <div className="flex justify-center">
            <LogoMark />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
            401 Unauthorized
          </p>
          <h1 className="mt-4 font-serif text-3xl font-semibold">
            로그인이 필요해요.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
            해당 페이지에 접근하려면 로그인해주세요.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <Link
              href="/auth"
              className="rounded-full bg-[var(--ink)] px-5 py-2 text-white"
            >
              로그인하기
            </Link>
            <Link
              href="/"
              className="rounded-full border border-[var(--border)] bg-white px-5 py-2 text-[var(--ink)]"
            >
              홈으로 이동
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
