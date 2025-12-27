import Link from "next/link";
import { redirect } from "next/navigation";
import LogoMark from "../components/LogoMark";
import AuthButtons from "../components/AuthButtons";
import { getServerUser } from "../services/authServer";
import { getBooks } from "../services/bookService";
import { getReviews } from "../services/reviewService";

export default async function LibraryPage() {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth?redirect=/library");
  }

  const [bookPage, reviewPage] = await Promise.all([
    getBooks({ cursor: null, limit: 12 }),
    getReviews({ cursor: null, limit: 200 }),
  ]);

  const readingBooks = bookPage.items.slice(0, 3);
  const finishedBooks = bookPage.items.slice(3, 6);
  const myReviews = reviewPage.items.filter(
    (review) => review.reviewerId === "user-001",
  );
  const bookmarkedReviews = reviewPage.items.slice(0, 3);

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
              <h1 className="font-serif text-2xl font-semibold">내 서재</h1>
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
          </div>
        </header>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <div className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[var(--shadow)]">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-serif text-2xl font-semibold">읽는 중</h2>
                <span className="text-xs font-semibold text-[var(--muted)]">
                  {readingBooks.length}권
                </span>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {readingBooks.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.slug}`}
                    className="rounded-[24px] border border-[var(--border)] bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      {book.title}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {book.author}
                    </p>
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      #{book.tags.join(" #")}
                    </p>
                  </Link>
                ))}
                {readingBooks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
                    읽는 중인 책이 없습니다.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[32px] border border-[var(--border)] bg-white/85 p-8 shadow-[var(--shadow)]">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-serif text-2xl font-semibold">완독한 책</h2>
                <span className="text-xs font-semibold text-[var(--muted)]">
                  {finishedBooks.length}권
                </span>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {finishedBooks.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.slug}`}
                    className="rounded-[24px] border border-[var(--border)] bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      {book.title}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {book.author}
                    </p>
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      #{book.tags.join(" #")}
                    </p>
                  </Link>
                ))}
                {finishedBooks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
                    완독한 책이 없습니다.
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-serif text-xl font-semibold">작성한 리뷰</h3>
                <span className="text-xs font-semibold text-[var(--muted)]">
                  {myReviews.length}개
                </span>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {myReviews.slice(0, 3).map((review) => (
                  <Link
                    key={review.id}
                    href={`/reviews/${review.id}`}
                    className="block rounded-2xl border border-[var(--border)] bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <p className="font-semibold text-[var(--ink)]">
                      {review.title}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      평점 {review.rating}
                    </p>
                  </Link>
                ))}
                {myReviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-3 text-xs text-[var(--muted)]">
                    아직 작성한 리뷰가 없습니다.
                  </div>
                ) : null}
              </div>
              <Link
                href="/profile"
                className="mt-4 inline-flex text-xs font-semibold text-[var(--accent)]"
              >
                리뷰 전체 보기
              </Link>
            </div>

            <div className="rounded-[28px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-serif text-xl font-semibold">
                  북마크한 리뷰
                </h3>
                <span className="text-xs font-semibold text-[var(--muted)]">
                  {bookmarkedReviews.length}개
                </span>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {bookmarkedReviews.map((review) => (
                  <Link
                    key={review.id}
                    href={`/reviews/${review.id}`}
                    className="block rounded-2xl border border-[var(--border)] bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <p className="font-semibold text-[var(--ink)]">
                      {review.title}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {review.reviewer}
                    </p>
                  </Link>
                ))}
                {bookmarkedReviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-3 text-xs text-[var(--muted)]">
                    북마크한 리뷰가 없습니다.
                  </div>
                ) : null}
              </div>
              <Link
                href="/profile/1/bookmarks"
                className="mt-4 inline-flex text-xs font-semibold text-[var(--accent)]"
              >
                북마크 전체 보기
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
