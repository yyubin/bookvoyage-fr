import Link from "next/link";
import AuthButtons from "../../../components/AuthButtons";
import LogoMark from "../../../components/LogoMark";
import { notFound } from "next/navigation";
import { getProfileSummary } from "../../../services/profileService";

const readingList = [
  {
    title: "밤의 도서관",
    author: "매트 헤이그",
    slug: "midnight-library",
  },
  {
    title: "작별인사",
    author: "김영하",
    slug: "farewell",
  },
  {
    title: "불편한 편의점",
    author: "김호연",
    slug: "comfort-store",
  },
  {
    title: "내일, 또 내일, 그리고 내일",
    author: "가브리엘 제빈",
    slug: "tomorrow-and-tomorrow",
  },
];

type ProfileReadingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProfileReadingPage({
  params,
}: ProfileReadingPageProps) {
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
                {profile.name}님의 읽고 있는 책
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
                key={item.slug}
                href={`/books/${item.slug}`}
                className="block rounded-2xl border border-[var(--border)] bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-[var(--ink)]">
                  {item.title}
                </p>
                <p className="text-xs text-[var(--muted)]">{item.author}</p>
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
