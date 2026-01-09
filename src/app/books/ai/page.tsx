import Link from "next/link";
import AuthButtons from "../../components/AuthButtons";
import LogoMark from "../../components/LogoMark";
import { getUserAnalysisServer } from "../../services/aiServerService";

export default async function AiRecommendationsPage() {
  const { response, status } = await getUserAnalysisServer();
  const isSignedIn = status !== 401;
  const analyzedAt = response ? new Date(response.analyzedAt) : null;

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
            <AuthButtons />
          </div>
        </header>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[var(--shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
              내 독서 취향 분석
            </p>
            {!isSignedIn ? (
              <>
                <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight">
                  로그인하면 AI가 취향을 분석해 추천 리스트를 구성해요.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                  최근 읽은 책과 반응을 기반으로 페르소나, 키워드, 추천 이유를
                  정리합니다.
                </p>
                <div className="mt-6">
                  <Link
                    href="/auth"
                    className="inline-flex rounded-full bg-[var(--ink)] px-5 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5"
                  >
                    로그인하고 분석 받기
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight">
                  {response?.summary ?? "오늘의 취향 분석을 준비 중입니다."}
                </h2>
                <p className="mt-4 text-sm text-[var(--muted)]">
                  {response?.personaType
                    ? `페르소나: ${response.personaType}`
                    : "페르소나 정보를 불러오는 중이에요."}
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-[var(--ink)]">
                  {(response?.keywords ?? ["취향 분석", "AI 추천"]).map(
                    (keyword) => (
                      <span
                        key={`keyword-${keyword}`}
                        className="rounded-full border border-[var(--border)] bg-white px-3 py-2"
                      >
                        {keyword}
                      </span>
                    ),
                  )}
                </div>
                <p className="mt-4 text-xs text-[var(--muted)]">
                  {analyzedAt
                    ? `마지막 분석 ${analyzedAt.toLocaleDateString("ko-KR", {
                        month: "long",
                        day: "numeric",
                      })}`
                    : "분석 기록을 확인 중입니다."}
                </p>
              </>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
                AI 추천 도서
              </p>
              <h3 className="mt-3 font-serif text-2xl font-semibold">
                지금 당신의 흐름에 맞는 책
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                이야기의 분위기와 선호 키워드를 분석해 골랐어요.
              </p>
            </div>

            {(response?.recommendations ?? []).length > 0 ? (
              response!.recommendations.map((book, index) => (
                <div
                  key={`ai-rec-${book.bookTitle}-${index}`}
                  className="rounded-[24px] border border-[var(--border)] bg-white/90 p-5 shadow-[var(--shadow)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-serif text-xl font-semibold">
                        {book.bookTitle}
                      </h4>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {book.author}
                      </p>
                    </div>
                    <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[11px] font-semibold text-[var(--muted)]">
                      추천 {index + 1}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                    {book.reason}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-[var(--border)] bg-white/90 p-5 text-sm text-[var(--muted)] shadow-[var(--shadow)]">
                추천 도서를 준비 중입니다. 잠시 후 다시 확인해 주세요.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
