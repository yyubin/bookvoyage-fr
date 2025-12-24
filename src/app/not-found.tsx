import Link from "next/link";
import LogoMark from "./components/LogoMark";

export default function NotFound() {
  return (
    <div className="paper-texture min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 pb-16 pt-8 text-center sm:px-8">
        <div className="rounded-[32px] border border-white/70 bg-white/80 px-8 py-10 shadow-[var(--shadow)]">
          <div className="flex justify-center">
            <LogoMark />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
            404 Not Found
          </p>
          <h1 className="mt-4 font-serif text-3xl font-semibold">
            페이지를 찾을 수 없어요.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
            주소가 잘못되었거나 이동된 페이지입니다.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <Link
              href="/"
              className="rounded-full bg-[var(--ink)] px-5 py-2 text-white"
            >
              홈으로 이동
            </Link>
            <Link
              href="/search"
              className="rounded-full border border-[var(--border)] bg-white px-5 py-2 text-[var(--ink)]"
            >
              검색하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
