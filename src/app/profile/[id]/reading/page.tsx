import Link from "next/link";
import AuthButtons from "../../../components/AuthButtons";
import LogoMark from "../../../components/LogoMark";
import { redirect } from "next/navigation";
import { getServerUser } from "../../../services/authServer";
import { getUserBooksByStatus } from "../../../services/libraryService";
import { getProfileSummary } from "../../../services/profileService";

type ProfileReadingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProfileReadingPage({
  params,
}: ProfileReadingPageProps) {
  const { id } = await params;
  const user = await getServerUser();
  if (!user) {
    redirect(`/auth?redirect=/profile/${id}/reading`);
  }
  const userId = user.userId ?? user.id;
  if (!userId) {
    redirect(`/auth?redirect=/profile/${id}/reading`);
  }
  if (String(userId) !== id) {
    redirect(`/profile/${userId}/reading`);
  }

  const [profile, readingResponse] = await Promise.all([
    getProfileSummary(id),
    getUserBooksByStatus("READING"),
  ]);
  const profileName = user.nickname ?? profile?.name ?? "프로필";
  const readingList = readingResponse.items;

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
                {profileName}님의 읽고 있는 책
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
            <h2 className="font-serif text-2xl font-semibold">읽는 중</h2>
            <span className="text-xs font-semibold text-[var(--muted)]">
              총 {readingList.length}권
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {readingList.map((item) => (
              <Link
                key={item.userBookId}
                href={`/library/books/${item.bookId}`}
                className="block rounded-2xl border border-[var(--border)] bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-[var(--ink)]">
                  {item.title}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  {item.authors.join(", ")}
                </p>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  진행률 {item.progressPercentage}%
                </p>
              </Link>
            ))}
            {readingList.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
                아직 읽고 있는 책이 없습니다.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
