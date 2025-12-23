import Link from "next/link";
import { notFound } from "next/navigation";
import { books } from "../../data/books";
import { reviews } from "../../data/reviews";

type BookPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = books.find((item) => item.slug === slug);

  if (!book) {
    notFound();
  }

  const relatedReviews = reviews.filter(
    (review) => review.title === book.title,
  );

  const fallbackReviews = reviews
    .filter((review) => review.title !== book.title)
    .slice(0, 3);

  return (
    <div className="paper-texture min-h-screen">
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-8 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-lg font-semibold text-white shadow-md">
              BV
            </div>
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
            <button className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]">
              리뷰 쓰기
            </button>
          </div>
        </header>

        <main className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[var(--shadow)]">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="h-44 w-32 flex-shrink-0 rounded-3xl bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c] shadow-md" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--muted)]">
                  {book.author}
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--ink)]">
                  {book.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                  {book.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
                  {book.highlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--border)] bg-white px-3 py-1"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">
                이 책 리뷰 쓰기
              </button>
              <button className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)]">
                책 저장
              </button>
              <button className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)]">
                공유
              </button>
            </div>
          </section>

          <aside className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
            <h3 className="font-serif text-xl font-semibold">이 책의 분위기</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              리뷰어들이 기억한 감정과 키워드를 모았습니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--ink)]">
              {book.highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[var(--border)] bg-white px-3 py-2"
                >
                  {item}
                </span>
              ))}
            </div>
          </aside>
        </main>

        <section className="mt-12 rounded-[32px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-serif text-2xl font-semibold">리뷰 모아보기</h3>
            <button className="text-sm font-semibold text-[var(--accent)]">
              리뷰 전체 보기
            </button>
          </div>
          {relatedReviews.length > 0 ? (
            <div className="mt-5 space-y-4">
              {relatedReviews.map((review) => (
                <Link
                  key={review.slug}
                  href={`/reviews/${review.slug}`}
                  className="block rounded-2xl border border-[var(--border)] bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">
                        {review.reviewer}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        평점 {review.rating}
                      </p>
                    </div>
                    <span className="text-xs text-[var(--muted)]">
                      댓글 {review.comments}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    {review.blurb}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
              아직 등록된 리뷰가 없어요. 첫 리뷰를 작성해보세요.
            </div>
          )}

          {relatedReviews.length === 0 ? (
            <div className="mt-6">
              <h4 className="font-serif text-xl font-semibold">
                이런 리뷰도 참고해보세요
              </h4>
              <div className="mt-4 space-y-3">
                {fallbackReviews.map((review) => (
                  <Link
                    key={review.slug}
                    href={`/reviews/${review.slug}`}
                    className="block rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
                  >
                    <p className="font-semibold text-[var(--ink)]">
                      {review.title}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {review.reviewer}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
