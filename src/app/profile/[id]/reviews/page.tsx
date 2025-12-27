import Link from "next/link";
import AuthButtons from "../../../components/AuthButtons";
import LogoMark from "../../../components/LogoMark";
import { getProfileSummary } from "../../../services/profileService";
import { getUserReviewsByUser } from "../../../services/libraryService";

type ProfileReviewsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProfileReviewsPage({
  params,
}: ProfileReviewsPageProps) {
  const { id } = await params;
  const [profile, reviewsPage] = await Promise.all([
    getProfileSummary(id),
    getUserReviewsByUser(id, 50),
  ]);
  const profileName = profile?.name ?? "프로필";

  const reviews = reviewsPage.reviews ?? [];

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
              <h1 className="font-serif text-2xl font-semibold">
                {profileName}님의 리뷰
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
            <AuthButtons />
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
                key={review.reviewId}
                href={`/reviews/${review.reviewId}`}
                className={`flex flex-col gap-5 rounded-[28px] border border-[var(--border)] bg-white px-5 py-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row ${
                  index === 0 ? "ring-1 ring-[var(--accent)]" : ""
                }`}
              >
                <div className="h-28 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c]">
                  {review.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.coverUrl}
                      alt={review.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-[var(--ink)]">
                        {review.title}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        {review.authors.join(", ")}
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--paper-strong)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                      평점 {review.rating}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    {review.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)]">
                    <span>{review.createdAt}</span>
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
