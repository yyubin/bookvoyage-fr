import Link from "next/link";
import { notFound } from "next/navigation";
import { getCommentsByReview } from "../../services/commentService";
import { getReviewBySlug, getReviews } from "../../services/reviewService";
import CommentModalTrigger from "./CommentModalTrigger";
import SpoilerToggle from "./SpoilerToggle";

type ReviewPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const reviewPage = await getReviews({ cursor: null, limit: 200 });
  return reviewPage.items.map((review) => ({ slug: review.slug }));
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;
  const review = await getReviewBySlug(slug);

  if (!review) {
    notFound();
  }

  const [commentsPage, allReviewsPage] = await Promise.all([
    getCommentsByReview(review.id, { cursor: null, limit: 10 }),
    getReviews({ cursor: null, limit: 200 }),
  ]);

  const comments = commentsPage.items;
  const allReviews = allReviewsPage.items;

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
              <h1 className="font-serif text-2xl font-semibold">
                리뷰 상세
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
              href="/reviews/new"
              className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
            >
              리뷰 쓰기
            </Link>
          </div>
        </header>

        <main className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[var(--shadow)]">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="h-40 w-28 flex-shrink-0 rounded-3xl bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c] shadow-md" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--muted)]">
                  {review.author}
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--ink)]">
                  {review.title}
                </h2>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--muted)]">
                  <span className="rounded-full bg-[var(--paper-strong)] px-3 py-1">
                    평점 {review.rating}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {review.reactions.slice(0, 3).map((reaction) => (
                      <span
                        key={reaction.emoji}
                        className="rounded-full border border-[var(--border)] px-3 py-1"
                      >
                        {reaction.emoji} {reaction.count}
                      </span>
                    ))}
                  </div>
                  <CommentModalTrigger
                    reviewId={review.id}
                    commentsCount={review.comments}
                    initialComments={comments}
                    initialCursor={commentsPage.nextCursor}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-[var(--muted)]">
                  <Link
                    href={`/profile/${review.reviewerId}`}
                    className="font-semibold text-[var(--ink)] transition hover:text-[var(--accent)]"
                  >
                    {review.reviewer}
                  </Link>
                  <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
                  <span>리뷰어</span>
                  <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
                  <span>오늘</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
                한줄 요약
              </p>
              <p className="mt-3 text-base leading-relaxed text-[var(--ink)]">
                {review.blurb}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
              {review.tags.map((tag) => (
                <Link
                  key={`${review.slug}-${tag}`}
                  href={`/search?q=${encodeURIComponent(`#${tag}`)}`}
                  className="rounded-full border border-[var(--border)] bg-white px-3 py-1 transition hover:border-transparent hover:bg-[var(--paper-strong)]"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            <div className="mt-6">
              <SpoilerToggle isSpoiler={review.spoiler} content={review.review} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              {review.highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-[var(--muted)]"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">
                좋아요 {review.likes}
              </button>
              <button className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)]">
                북마크 {review.bookmarks}
              </button>
              <button className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)]">
                공유
              </button>
            </div>

            <div className="mt-10 rounded-[24px] border border-[var(--border)] bg-white/70 p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-serif text-xl font-semibold">
                  다른 더미 리뷰 보기
                </h3>
                <span className="text-xs font-semibold text-[var(--muted)]">
                  클릭해서 상세 이동
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {allReviews
                  .filter((item) => item.slug !== review.slug)
                  .slice(0, 4)
                  .map((item) => (
                    <Link
                      key={item.slug}
                      href={`/reviews/${item.slug}`}
                      className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <p className="font-semibold text-[var(--ink)]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        {item.author} · {item.reviewer}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
              <h3 className="font-serif text-xl font-semibold">리액션</h3>
              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                  <span>좋아요</span>
                  <span className="font-semibold text-[var(--ink)]">
                    {review.likes}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                  <span>북마크</span>
                  <span className="font-semibold text-[var(--ink)]">
                    {review.bookmarks}
                  </span>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                    {review.reactions.map((reaction) => (
                      <span
                        key={reaction.emoji}
                        className="rounded-full border border-[var(--border)] px-3 py-1"
                      >
                        {reaction.emoji} {reaction.count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-serif text-xl font-semibold">댓글</h3>
                <CommentModalTrigger
                  reviewId={review.id}
                  commentsCount={review.comments}
                  initialComments={comments}
                  initialCursor={commentsPage.nextCursor}
                />
              </div>
              <div className="mt-4 space-y-4 text-sm">
                {comments.map((comment) => (
                  <div
                    key={`${comment.user}-${comment.time}`}
                    className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
                  >
                    <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                      <Link
                        href={`/profile/${comment.userId}`}
                        className="font-semibold text-[var(--ink)] transition hover:text-[var(--accent)]"
                      >
                        {comment.user}
                      </Link>
                      <span>{comment.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-3 text-xs text-[var(--muted)]">
                댓글을 남기려면 상단 댓글 버튼을 눌러주세요.
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
