import Link from "next/link";
import BookRecommendationSection from "./components/BookRecommendationSection";
import AuthButtons from "./components/AuthButtons";
import AuthReviewButton from "./components/AuthReviewButton";
import ReviewFeed from "./components/ReviewFeed";
import SearchBar from "./components/SearchBar";
import LogoMark from "./components/LogoMark";
import CommunityTrendCard from "./components/CommunityTrendCard";
import DailyPickCard from "./components/DailyPickCard";
import { getReviewRecommendationsServer } from "./services/recommendationServerService";

export default async function Home() {
  const { response: reviewPage } = await getReviewRecommendationsServer({
    limit: 4,
  });

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
                읽고, 반응하고, 흐르다.
              </h1>
            </div>
          </div>
          <nav className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <button className="rounded-full border border-transparent bg-white/70 px-4 py-2 text-[var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              피드
            </button>
            <Link
              href="/profile"
              className="rounded-full border border-[var(--border)] bg-transparent px-4 py-2 transition hover:border-transparent hover:bg-white/60"
            >
              프로필
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <AuthButtons />
            <AuthReviewButton href="/reviews/new" />
          </div>
        </header>

        <section className="fade-up mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-white/70 bg-white/70 p-8 shadow-[var(--shadow)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
              오늘의 추천
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight">
              당신의 취향을 따라가는 조용한 이야기들.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
              Bookvoyage는 당신이 머무는 문장과 분위기를 따라 리뷰와 추천을
              엮습니다. 피드를 넘기거나, 믿는 독자의 추천 트레일을 시작해 보세요.
            </p>
            <div className="mt-6">
              <SearchBar />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button className="rounded-full bg-[var(--ink)] px-5 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5">
                오늘의 피드 보기
              </button>
              <button className="rounded-full border border-[var(--border)] bg-white/80 px-5 py-2 text-sm font-semibold text-[var(--ink)] transition hover:border-transparent hover:bg-white">
                내 서재 만들기
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <DailyPickCard />

            <CommunityTrendCard />
          </div>
        </section>

        <BookRecommendationSection />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-semibold">커뮤니티 피드</h3>
              <div className="flex gap-2 text-xs font-semibold text-[var(--muted)]">
                <button className="rounded-full border border-[var(--border)] px-3 py-2">
                  팔로잉
                </button>
              </div>
            </div>
            <ReviewFeed
              initialItems={reviewPage.items}
              initialCursor={reviewPage.nextCursor}
              initialHasMore={reviewPage.hasMore}
            />
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
              <h4 className="font-serif text-xl font-semibold">내 서재</h4>
              <p className="mt-2 text-sm text-[var(--muted)]">
                지금 읽는 책과 반응을 한눈에 정리하세요.
              </p>
              <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                <div className="flex items-center justify-between">
                  <span>읽는 중</span>
                  <span className="font-semibold text-[var(--ink)]">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>저장한 리뷰</span>
                  <span className="font-semibold text-[var(--ink)]">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>북마크</span>
                  <span className="font-semibold text-[var(--ink)]">32</span>
                </div>
              </div>
              <Link
                href="/library"
                className="mt-6 block w-full rounded-full bg-[var(--ink)] px-4 py-2 text-center text-sm font-semibold text-white"
              >
                서재 열기
              </Link>
            </div>

            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
              <h4 className="font-serif text-xl font-semibold">리뷰 서클</h4>
              <p className="mt-2 text-sm text-[var(--muted)]">
                비슷한 취향의 독자들이 지금 이야기하는 주제들.
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                  <span className="font-semibold text-[var(--ink)]">
                    모던 클래식
                  </span>
                  <span className="text-xs text-[var(--muted)]">128개 글</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                  <span className="font-semibold text-[var(--ink)]">
                    소프트 SF
                  </span>
                  <span className="text-xs text-[var(--muted)]">92개 글</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                  <span className="font-semibold text-[var(--ink)]">
                    치유 에세이
                  </span>
                  <span className="text-xs text-[var(--muted)]">64개 글</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
}
