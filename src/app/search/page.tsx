import Link from "next/link";
import AuthButtons from "../components/AuthButtons";
import LogoMark from "../components/LogoMark";
import { searchContent } from "../services/searchService";

type SearchPageProps = {
  searchParams?: { q?: string };
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams?.q ?? "").trim();
  const isTagSearch = query.startsWith("#");
  const displayQuery = query || "검색어 없음";
  const results = query ? await searchContent(query) : { reviews: [], books: [] };

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

        <section className="mt-10 rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[var(--shadow)]">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
            통합 검색
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex-1 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--muted)]">
              {query || "검색어를 입력하세요. #태그 로 검색 가능합니다."}
            </div>
            <button className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-md">
              검색
            </button>
          </div>
          <div className="mt-4 text-sm text-[var(--muted)]">
            {isTagSearch ? "태그 검색" : "제목/내용 검색"} · {displayQuery}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl font-semibold">리뷰 결과</h2>
              <span className="text-xs font-semibold text-[var(--muted)]">
                {results.reviews.length}건
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {results.reviews.map((review) => (
                <Link
                  key={review.id}
                  href={`/reviews/${review.id}`}
                  className="block rounded-2xl border border-[var(--border)] bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">
                        {review.title}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        {review.author}
                      </p>
                    </div>
                    <span className="text-xs text-[var(--muted)]">
                      평점 {review.rating}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    {review.blurb}
                  </p>
                </Link>
              ))}
              {results.reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
                  검색된 리뷰가 없습니다.
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[32px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl font-semibold">책 결과</h2>
              <span className="text-xs font-semibold text-[var(--muted)]">
                {results.books.length}건
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {results.books.map((book) => (
                <Link
                  key={book.slug}
                  href={`/books/${book.slug}`}
                  className="block rounded-2xl border border-[var(--border)] bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {book.title}
                  </p>
                  <p className="text-xs text-[var(--muted)]">{book.author}</p>
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    #{book.tags.join(" #")}
                  </p>
                </Link>
              ))}
              {results.books.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
                  검색된 책이 없습니다.
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
