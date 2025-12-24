import Link from "next/link";
import AuthButtons from "../../../components/AuthButtons";
import LogoMark from "../../../components/LogoMark";
import { notFound } from "next/navigation";
import { getProfileSummary } from "../../../services/profileService";

const bookmarks = [
  { reviewId: 1, title: "파친코", author: "이민진", by: "박지수" },
  {
    reviewId: 2,
    title: "페이퍼 팰리스",
    author: "미란다 카울리 헬러",
    by: "조아리",
  },
  {
    reviewId: 3,
    title: "기억 전달자",
    author: "로이스 로리",
    by: "정유진",
  },
];

type ProfileBookmarksPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProfileBookmarksPage({
  params,
}: ProfileBookmarksPageProps) {
  const { id } = await params;
  const profile = await getProfileSummary(id);

  if (!profile) {
    notFound();
  }

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
                {profile.name}님의 북마크
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
            <h2 className="font-serif text-2xl font-semibold">북마크한 리뷰</h2>
            <span className="text-xs font-semibold text-[var(--muted)]">
              총 {bookmarks.length}개
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {bookmarks.map((item) => (
              <Link
                key={item.reviewId}
                href={`/reviews/${item.reviewId}`}
                className="block rounded-2xl border border-[var(--border)] bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      {item.title}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {item.author}
                    </p>
                  </div>
                  <span className="text-xs text-[var(--muted)]">
                    by {item.by}
                  </span>
                </div>
              </Link>
            ))}
            {bookmarks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
                아직 저장한 리뷰가 없습니다.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
