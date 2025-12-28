import Link from "next/link";
import AuthButtons from "../../components/AuthButtons";
import AuthReviewButton from "../../components/AuthReviewButton";
import LogoMark from "../../components/LogoMark";
import { notFound, redirect } from "next/navigation";
import { getServerUser } from "../../services/authServer";
import { getReviewDetail } from "../../services/reviewDetailService";
import { getReviewCommentsServer } from "../../services/commentServerService";
import type { CommentResponse } from "../../types/content";
import ReviewOwnerActions from "./ReviewOwnerActions";
import ReviewReactions from "./ReviewReactions";
import SpoilerToggle from "./SpoilerToggle";
import CommentModalTrigger from "./CommentModalTrigger";

type ReviewPageProps = {
  params: Promise<{ reviewId: string }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { reviewId } = await params;
  const result = await getReviewDetail(Number(reviewId));

  if (!result.review) {
    if (result.status === 403 || result.status === 401) {
      redirect(`/auth?redirect=/reviews/${reviewId}`);
    }
    notFound();
  }
  const review = result.review;
  const user = await getServerUser();
  const viewerId = user?.userId ?? user?.id;
  const reviewerId = review.userId ?? review.reviewerId;
  const isOwner =
    viewerId !== undefined &&
    reviewerId !== undefined &&
    String(viewerId) === String(reviewerId);
  const commentPage = await getReviewCommentsServer(review.reviewId, {
    cursor: null,
    size: 8,
  });
  const initialComments = commentPage.comments;
  const commentsCount = commentPage.totalCount;
  const rootComments: CommentResponse[] = [];
  const repliesByParent = new Map<number, CommentResponse[]>();
  initialComments.forEach((comment) => {
    if (comment.parentCommentId) {
      const existing = repliesByParent.get(comment.parentCommentId) ?? [];
      existing.push(comment);
      repliesByParent.set(comment.parentCommentId, existing);
    } else {
      rootComments.push(comment);
    }
  });

  const renderComment = (comment: CommentResponse, depth = 0) => {
    const replies = repliesByParent.get(comment.commentId) ?? [];

    return (
      <div
        key={comment.commentId}
        className={`rounded-2xl border border-[var(--border)] bg-white px-4 py-3 ${depth > 0 ? "ml-6 border-dashed" : ""}`}
      >
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <Link
            href={`/profile/${comment.userId}`}
            className="font-semibold text-[var(--ink)] transition hover:text-[var(--accent)]"
          >
            {comment.authorNickname ?? `user-${comment.userId}`}
          </Link>
          <span>{comment.createdAt}</span>
        </div>
        <p className="mt-2 text-sm text-[var(--muted)]">{comment.content}</p>
        {replies.length > 0 ? (
          <div className="mt-3 space-y-3 border-l border-[var(--border)] pl-4">
            {replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        ) : null}
      </div>
    );
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
            <AuthButtons />
            <AuthReviewButton href="/reviews/new" />
          </div>
        </header>

        <main className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[var(--shadow)]">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="h-40 w-28 flex-shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c] shadow-md">
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
                <p className="text-sm font-semibold text-[var(--muted)]">
                  {review.authors.join(", ")}
                </p>
                <Link
                  href={`/books/internal/${review.bookId}`}
                  className="mt-2 inline-flex font-serif text-3xl font-semibold text-[var(--ink)] transition hover:text-[var(--accent)]"
                >
                  {review.title}
                </Link>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--muted)]">
                  <span className="rounded-full bg-[var(--paper-strong)] px-3 py-1">
                    평점 {review.rating}
                  </span>
                  <span className="rounded-full border border-[var(--border)] px-3 py-1">
                    조회수 {review.viewCount}
                  </span>
                  <CommentModalTrigger
                    reviewId={review.reviewId}
                    commentsCount={commentsCount}
                    initialComments={initialComments}
                    initialCursor={commentPage.nextCursor}
                    viewerId={viewerId ?? null}
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                  <Link
                    href={
                      review.userId
                        ? `/profile/${review.userId}`
                        : "/profile"
                    }
                    className="font-semibold text-[var(--ink)] transition hover:text-[var(--accent)]"
                  >
                    {review.authorNickname ?? "리뷰어"}
                  </Link>
                  <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
                  <span>{review.authorTasteTag ?? "취향 태그"}</span>
                  <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
                  <span>{review.createdAt}</span>
                </div>
                {isOwner ? (
                  <ReviewOwnerActions review={review} ownerId={viewerId} />
                ) : null}
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
                한줄 요약
              </p>
              <p className="mt-3 text-base leading-relaxed text-[var(--ink)]">
                {review.summary}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
              {review.keywords.map((tag) => (
                <Link
                  key={`${review.reviewId}-${tag}`}
                  href={`/search?q=${encodeURIComponent(`#${tag}`)}`}
                  className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[var(--accent)] transition hover:border-transparent hover:bg-[var(--paper-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            <div className="mt-6">
              <SpoilerToggle isSpoiler={false} content={review.content} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              {review.highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-[var(--accent)]"
                >
                  {item}
                </span>
              ))}
            </div>

            <ReviewReactions
              reviewId={review.reviewId}
              initialBookmarked={review.bookmarked}
              initialReactions={review.reactions}
              initialUserReaction={review.userReaction}
            />

            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--muted)]">
              <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1">
                {review.genre ?? "장르 미지정"}
              </span>
              <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1">
                {review.visibility === "PRIVATE" ? "비공개" : "전체 공개"}
              </span>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
              <h3 className="font-serif text-xl font-semibold">출간 정보</h3>
              <div className="mt-4 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--muted)]">
                출간 {review.publishedDate ?? "정보 없음"}
              </div>
            </div>

            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
              <h3 className="font-serif text-xl font-semibold">댓글</h3>
              <div className="mt-4 space-y-3 text-sm">
                {rootComments.length > 0 ? (
                  rootComments.map((comment) => renderComment(comment))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-3 text-xs text-[var(--muted)]">
                    아직 댓글이 없어요. 첫 댓글을 남겨주세요.
                  </div>
                )}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
