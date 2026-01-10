import Link from "next/link";
import BookRecommendationSection from "./components/BookRecommendationSection";
import AuthButtons from "./components/AuthButtons";
import AuthReviewButton from "./components/AuthReviewButton";
import ReviewFeed from "./components/ReviewFeed";
import SearchBar from "./components/SearchBar";
import LogoMark from "./components/LogoMark";
import CommunityTrendCard from "./components/CommunityTrendCard";
import DailyPickCard from "./components/DailyPickCard";
import UserLibraryCard from "./components/UserLibraryCard";
import { getReviewRecommendationsServer } from "./services/recommendationServerService";
import { getTrendingKeywordsServer } from "./services/searchKeywordTrendServerService";

export default async function Home() {
  const [{ response: reviewPage }, { response: keywordResponse }] =
    await Promise.all([
      getReviewRecommendationsServer({ limit: 4 }),
      getTrendingKeywordsServer(6, "daily"),
    ]);
  const trendingKeywords =
    keywordResponse?.keywords.map((item) => item.keyword) ?? [];

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
              <SearchBar trendingKeywords={trendingKeywords} />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button className="rounded-full bg-[var(--ink)] px-5 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5">
                오늘의 피드 보기
              </button>
              <button className="rounded-full border border-[var(--border)] bg-white/80 px-5 py-2 text-sm font-semibold text-[var(--ink)] transition hover:border-transparent hover:bg-white">
                내 서재 만들기
              </button>
              <Link
                href="/books/ai"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-[2px] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <div className="flex items-center gap-2 rounded-full bg-white px-5 py-2">
                  <svg
                    className="h-4 w-4 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-sm font-bold text-transparent">
                    AI 맞춤 추천 도서
                  </span>
                  <svg
                    className="h-4 w-4 animate-pulse text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="absolute inset-0 -z-10 animate-pulse bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-30 blur-lg" />
              </Link>
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
            <UserLibraryCard />

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
