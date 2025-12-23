import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfileSummary } from "../../../services/profileService";
import { getReviews } from "../../../services/reviewService";

type ProfileReviewsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProfileReviewsPage({
  params,
}: ProfileReviewsPageProps) {
  const { id } = await params;
  const [profile, reviewsPage] = await Promise.all([
    getProfileSummary(id),
    getReviews({ cursor: null, limit: 100 }),
  ]);

  if (!profile) {
    notFound();
  }

  const reviews = reviewsPage.items.filter(
    (review) => review.reviewerId === id,
  );

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
                {profile.name}님의 리뷰
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <Link
              href={`/profile/${id}`}
              className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              프로필로 돌아가기
            </Link>
            <Link
              href="/"
              className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              피드로 이동
            </Link>
          </div>
        </header>

        <section className="mt-10 rounded-[32px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl font-semibold">전체 리뷰</h2>
            <span className="text-xs font-semibold text-[var(--muted)]">
              총 {reviews.length}개
            </span>
          </div>
          <div className="mt-5 space-y-5">
            {reviews.map((review, index) => (
              <Link
                key={review.slug}
                href={`/reviews/${review.slug}`}
                className={`flex flex-col gap-5 rounded-[28px] border border-[var(--border)] bg-white px-5 py-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row ${
                  index === 0 ? "ring-1 ring-[var(--accent)]" : ""
                }`}
              >
                <div className="h-28 w-20 flex-shrink-0 rounded-2xl bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c]" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-[var(--ink)]">
                        {review.title}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        {review.author}
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--paper-strong)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                      평점 {review.rating}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    {review.blurb}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)]">
                    <div className="flex items-center gap-2">
                      {review.reactions.slice(0, 2).map((reaction) => (
                        <span
                          key={reaction.emoji}
                          className="rounded-full border border-[var(--border)] px-3 py-1"
                        >
                          {reaction.emoji} {reaction.count}
                        </span>
                      ))}
                      <span className="rounded-full border border-[var(--border)] px-3 py-1">
                        좋아요 {review.likes}
                      </span>
                    </div>
                    <span>댓글 {review.comments}</span>
                  </div>
                </div>
              </Link>
            ))}
            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
                아직 작성한 리뷰가 없습니다.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
