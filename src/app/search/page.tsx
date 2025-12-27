import Link from "next/link";
import AuthButtons from "../components/AuthButtons";
import LogoMark from "../components/LogoMark";
import AddToLibraryButton from "../components/AddToLibraryButton";
import { searchContent } from "../services/searchService";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    bookStartIndex?: string;
    bookSize?: string;
    reviewCursor?: string;
    reviewSize?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const parseNumber = (value?: string) => {
    if (!value) {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };
  const bookStartIndex = parseNumber(params.bookStartIndex);
  const bookSize = parseNumber(params.bookSize) ?? 6;
  const reviewCursor = parseNumber(params.reviewCursor);
  const reviewSize = parseNumber(params.reviewSize) ?? 6;
  const isTagSearch = query.startsWith("#");
  const displayQuery = query || "검색어 없음";
  const results = query
    ? await searchContent(query, {
        bookStartIndex,
        bookSize,
        reviewCursor,
        reviewSize,
      })
    : {
        query,
        reviews: { items: [], nextCursor: null },
        books: { items: [], nextStartIndex: null, totalItems: 0 },
      };
  const baseParams = new URLSearchParams();
  if (query) {
    baseParams.set("q", query);
  }
  baseParams.set("bookSize", String(bookSize));
  baseParams.set("reviewSize", String(reviewSize));
  if (bookStartIndex !== undefined) {
    baseParams.set("bookStartIndex", String(bookStartIndex));
  }
  if (reviewCursor !== undefined) {
    baseParams.set("reviewCursor", String(reviewCursor));
  }

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
          <form
            action="/search"
            className="mt-4 flex flex-wrap items-center gap-3"
          >
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="검색어를 입력하세요. #태그 로 검색 가능합니다."
              className="flex-1 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <button
              type="submit"
              className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-md"
            >
              검색
            </button>
          </form>
          <div className="mt-4 text-sm text-[var(--muted)]">
            {isTagSearch ? "태그 검색" : "제목/내용 검색"} · {displayQuery}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl font-semibold">리뷰 결과</h2>
              <span className="text-xs font-semibold text-[var(--muted)]">
                {results.reviews.items.length}건
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {results.reviews.items.map((review) => (
                <Link
                  key={review.reviewId}
                  href={`/reviews/${review.reviewId}`}
                  className="block rounded-2xl border border-[var(--border)] bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">
                        {review.summary}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        키워드 {review.keywords.slice(0, 3).join(", ")}
                      </p>
                    </div>
                    <span className="text-xs text-[var(--muted)]">
                      {review.rating ? `평점 ${review.rating}` : "평점 없음"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    {review.highlights.slice(0, 2).join(" · ") ||
                      "요약 정보를 준비 중입니다."}
                  </p>
                </Link>
              ))}
              {results.reviews.items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
                  검색된 리뷰가 없습니다.
                </div>
              ) : null}
              {results.reviews.nextCursor !== null ? (
                <Link
                  href={`/search?${new URLSearchParams({
                    ...Object.fromEntries(baseParams),
                    reviewCursor: results.reviews.nextCursor.toString(),
                  }).toString()}`}
                  className="inline-flex rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-semibold text-[var(--muted)] transition hover:border-transparent hover:bg-[var(--paper-strong)]"
                >
                  리뷰 더 보기
                </Link>
              ) : null}
            </div>
          </div>

          <div className="rounded-[32px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl font-semibold">책 결과</h2>
              <span className="text-xs font-semibold text-[var(--muted)]">
                {results.books.items.length}건
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {results.books.items.map((book) => {
                const identifier =
                  book.googleVolumeId ?? book.isbn13 ?? book.isbn10 ?? "book";
                const detailParams = new URLSearchParams({
                  title: book.title,
                  authors: book.authors.join(", "),
                  coverUrl: book.coverUrl ?? "",
                  publisher: book.publisher ?? "",
                  description: book.description ?? "",
                });
                return (
                  <div
                    key={`${book.title}-${identifier}`}
                    className="rounded-2xl border border-[var(--border)] bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <Link
                      href={`/books/external/${identifier}?${detailParams.toString()}`}
                      className="block"
                    >
                      <p className="text-sm font-semibold text-[var(--ink)]">
                        {book.title}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        {book.authors.join(", ")}
                      </p>
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        {book.publisher ?? "출판사 정보 없음"}
                      </p>
                    </Link>
                    <div className="mt-4">
                      <AddToLibraryButton book={book} />
                    </div>
                  </div>
                );
              })}
              {results.books.items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
                  검색된 책이 없습니다.
                </div>
              ) : null}
              {results.books.nextStartIndex !== null ? (
                <Link
                  href={`/search?${new URLSearchParams({
                    ...Object.fromEntries(baseParams),
                    bookStartIndex: results.books.nextStartIndex.toString(),
                  }).toString()}`}
                  className="inline-flex rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-semibold text-[var(--muted)] transition hover:border-transparent hover:bg-[var(--paper-strong)]"
                >
                  책 더 보기
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
