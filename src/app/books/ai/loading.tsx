import Link from "next/link";
import LogoMark from "../../components/LogoMark";

export default function AiRecommendationsLoading() {
  return (
    <div className="paper-texture min-h-screen">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-8 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Bookvoyage
              </p>
              <h1 className="font-serif text-2xl font-semibold">
                AI 추천 도서
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <Link
              href="/books/recommendations"
              className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              추천 모음 보기
            </Link>
            <Link
              href="/"
              className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              홈으로
            </Link>
          </div>
        </header>
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="mx-6 w-full max-w-md rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[var(--shadow)]">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
            AI 분석 진행 중
          </p>
          <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug">
            당신의 독서 취향을 읽어내는 중이에요.
          </h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            최근 기록과 반응을 바탕으로 추천 리스트를 준비하고 있어요.
          </p>
          <div className="mt-6 space-y-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--paper-strong)]">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-[var(--accent)]" />
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>분석 진행 중</span>
              <span>잠시만 기다려 주세요</span>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {["페르소나", "분위기", "키워드"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--muted)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
