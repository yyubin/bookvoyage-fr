import Link from "next/link";
import AuthButtons from "../../../components/AuthButtons";
import AuthReviewButton from "../../../components/AuthReviewButton";
import AddToLibraryButton from "../../../components/AddToLibraryButton";
import LogoMark from "../../../components/LogoMark";
import { notFound } from "next/navigation";
import {
  getInternalBookDetail,
  getInternalBookReviewsServer,
} from "../../../services/internalBookService";
import BookReviewList from "./BookReviewList";

type InternalBookPageProps = {
  params: Promise<{ bookId: string }>;
};

export default async function InternalBookPage({
  params,
}: InternalBookPageProps) {
  const { bookId } = await params;
  const detailResult = await getInternalBookDetail(bookId);

  if (!detailResult.book) {
    notFound();
  }

  const book = detailResult.book;
  const reviewPage = await getInternalBookReviewsServer(book.bookId, {
    cursor: null,
    size: 20,
    sort: "recommended",
  });
  const libraryBook = {
    title: book.title,
    authors: book.authors,
    isbn10: book.isbn10 ?? null,
    isbn13: book.isbn13 ?? null,
    coverUrl: book.coverUrl ?? null,
    publisher: book.publisher ?? null,
    publishedDate: book.publishedDate ?? null,
    description: book.description ?? null,
    language: book.language ?? null,
    pageCount: book.pageCount ?? null,
    googleVolumeId: book.googleVolumeId ?? null,
  };

  return (
    <div className="paper-texture min-h-screen">
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-8 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Bookvoyage
              </p>
              <h1 className="font-serif text-2xl font-semibold">책 상세</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <Link
              href="/"
              className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              피드로 돌아가기
            </Link>
            <AuthButtons />
            <AuthReviewButton
              href="/reviews/new"
              className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
            />
          </div>
        </header>

        <main className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[var(--shadow)]">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="h-44 w-32 flex-shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c] shadow-md">
                {book.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--muted)]">
                  {book.authors.join(", ")}
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--ink)]">
                  {book.title}
                </h2>
                {book.publisher ? (
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {book.publisher}
                  </p>
                ) : null}
                {book.description ? (
                  <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                    {book.description}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
                  <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1">
                    리뷰 {book.stats.reviewCount}개
                  </span>
                  <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1">
                    평균 {book.stats.avgRating ?? "-"}
                  </span>
                  {book.publishedDate ? (
                    <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1">
                      출간 {book.publishedDate}
                    </span>
                  ) : null}
                </div>
                <div className="mt-4">
                  <AddToLibraryButton book={libraryBook} />
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
              <h3 className="font-serif text-xl font-semibold">도서 정보</h3>
              <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                {book.isbn13 ? <p>ISBN {book.isbn13}</p> : null}
                {book.language ? <p>언어 {book.language}</p> : null}
                {book.pageCount ? <p>{book.pageCount}쪽</p> : null}
              </div>
            </div>
          </aside>
        </main>

        <BookReviewList
          bookId={book.bookId}
          initialReviews={reviewPage.reviews}
          initialCursor={reviewPage.nextCursor}
          totalCount={reviewPage.totalCount}
        />
      </div>
    </div>
  );
}
