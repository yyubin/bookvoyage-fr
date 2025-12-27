import Link from "next/link";
import AuthButtons from "../components/AuthButtons";
import AddToLibraryButton from "../components/AddToLibraryButton";
import LogoMark from "../components/LogoMark";
import SearchResultsClient from "./SearchResultsClient";
import { searchBooks, searchReviews } from "../services/searchService";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    bookQ?: string;
    reviewQ?: string;
    bookStartIndex?: string;
    bookSize?: string;
    reviewCursor?: string;
    reviewSize?: string;
  }>;
};

const toNumber = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const unifiedQuery = (params.q ?? "").trim();
  const bookQuery = (params.bookQ ?? "").trim() || unifiedQuery;
  const reviewQuery = (params.reviewQ ?? "").trim() || unifiedQuery;

  const bookStartIndex = toNumber(params.bookStartIndex);
  const bookSize = toNumber(params.bookSize) ?? 6;
  const reviewCursor = toNumber(params.reviewCursor);
  const reviewSize = toNumber(params.reviewSize) ?? 6;

  const [bookResults, reviewResults] = await Promise.all([
    bookQuery
      ? searchBooks(bookQuery, {
          startIndex: bookStartIndex,
          size: bookSize,
        })
      : Promise.resolve({ items: [], nextStartIndex: null, totalItems: 0 }),
    reviewQuery
      ? searchReviews(reviewQuery, {
          cursor: reviewCursor,
          size: reviewSize,
        })
      : Promise.resolve({ items: [], nextCursor: null }),
  ]);

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
              <h1 className="font-serif text-2xl font-semibold">검색</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <Link
              href="/"
              className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:-translate-y-0.5 hover:shadow-md"
            >
              홈으로 돌아가기
            </Link>
            <AuthButtons />
          </div>
        </header>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[var(--shadow)] lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
              통합 검색
            </p>
            <h2 className="mt-3 font-serif text-2xl font-semibold">
              책과 리뷰를 한 번에
            </h2>
            <form action="/search" className="mt-5 flex flex-wrap gap-3">
              <input
                name="q"
                defaultValue={unifiedQuery}
                placeholder="책 제목, 작가, 리뷰 키워드, #태그"
                className="w-full flex-1 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
              />
              <button className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white shadow-md">
                통합 검색
              </button>
            </form>
          </div>

          <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[var(--shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
              리뷰 검색
            </p>
            <h2 className="mt-3 font-serif text-2xl font-semibold">
              독자의 기록을 찾아보세요
            </h2>
            <form action="/search" className="mt-5 space-y-4">
              <input
                name="reviewQ"
                defaultValue={reviewQuery}
                placeholder="리뷰 키워드, 문장, 해시태그"
                className="w-full rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
              />
              <div className="flex justify-end">
                <button className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-md">
                  리뷰 검색
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[var(--shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
              책 검색
            </p>
            <h2 className="mt-3 font-serif text-2xl font-semibold">
              다음 책을 찾아보세요
            </h2>
            <form action="/search" className="mt-5 space-y-4">
              <input
                name="bookQ"
                defaultValue={bookQuery}
                placeholder="책 제목, 작가, ISBN"
                className="w-full rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
              />
              <div className="flex justify-end">
                <button className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-md">
                  책 검색
                </button>
              </div>
            </form>
          </div>
        </section>

        <SearchResultsClient
          initialBooks={bookResults.items}
          initialBookNext={bookResults.nextStartIndex}
          initialReviews={reviewResults.items}
          initialReviewNext={reviewResults.nextCursor}
          bookQuery={bookQuery}
          reviewQuery={reviewQuery}
          bookOptions={{
            size: bookSize,
          }}
          reviewOptions={{
            size: reviewSize,
          }}
        />
      </div>
    </div>
  );
}
