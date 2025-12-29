import Link from "next/link";
import AuthButtons from "../../components/AuthButtons";
import LogoMark from "../../components/LogoMark";
import RecommendationList from "./RecommendationList";
import { getBookRecommendationsServer } from "../../services/recommendationServerService";

const curatorNotes = [
  {
    title: "잔잔한 몰입",
    description: "무겁지 않지만 여운이 깊게 남는 이야기들.",
  },
  {
    title: "도시의 빛",
    description: "차가운 밤과 사람들 사이에 흐르는 따뜻함.",
  },
  {
    title: "짧고 깊은 책",
    description: "페이지 수는 얇지만 감정은 길게 남아요.",
  },
];

export default async function BookRecommendationsPage() {
  const { response, status } = await getBookRecommendationsServer({
    limit: 20,
  });
  const isSignedIn = status !== 401;
  const items = response.items;
  const tags = Array.from(
    new Set(
      items
        .flatMap((book) => [book.source, book.reason])
        .filter((value): value is string => Boolean(value)),
    ),
  ).slice(0, 10);

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
                책 추천 모음
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <Link
              href="/"
              className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              피드로 돌아가기
            </Link>
            <Link
              href="/search"
              className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              검색하기
            </Link>
            <AuthButtons />
          </div>
        </header>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[var(--shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
              큐레이터 노트
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight">
              오늘의 기분에 맞는 책을 한곳에 모았어요.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
              독서 취향을 따라가며 분위기, 감정, 태그로 묶은 추천 리스트입니다.
              마음이 끌리는 키워드를 선택해 책을 골라보세요.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-[var(--ink)]">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <span
                    key={`tag-${tag}`}
                    className="rounded-full border border-[var(--border)] bg-white px-3 py-2"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-[var(--border)] bg-white px-3 py-2">
                  취향 기반 추천
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {curatorNotes.map((note) => (
              <div
                key={note.title}
                className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow)]"
              >
                <h3 className="font-serif text-xl font-semibold">
                  {note.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {note.description}
                </p>
              </div>
            ))}
            <div className="rounded-[24px] border border-[var(--border)] bg-white/80 p-5 shadow-[var(--shadow)]">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
                추천 기준
              </p>
              <p className="mt-3 text-sm text-[var(--muted)]">
                최신 리뷰 반응, 저장 횟수, 태그 검색량을 반영해 구성했습니다.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-serif text-2xl font-semibold">
              전체 추천 리스트
            </h3>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
              <button className="rounded-full bg-white px-3 py-2 shadow-sm">
                최신순
              </button>
              <button className="rounded-full border border-[var(--border)] px-3 py-2">
                인기순
              </button>
              <button className="rounded-full border border-[var(--border)] px-3 py-2">
                분위기순
              </button>
            </div>
          </div>

          <RecommendationList
            initialItems={items}
            isSignedIn={isSignedIn}
          />
        </section>
      </div>
    </div>
  );
}
