import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AuthButtons from "../../../components/AuthButtons";
import LogoMark from "../../../components/LogoMark";
import { getServerUser } from "../../../services/authServer";
import { getUserBookDetail } from "../../../services/libraryService";
import UserBookDetailClient from "./UserBookDetailClient";

type UserBookDetailPageProps = {
  params: Promise<{ bookId: string }>;
};

export default async function UserBookDetailPage({
  params,
}: UserBookDetailPageProps) {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth?redirect=/library");
  }

  const { bookId } = await params;
  let userBook;
  try {
    userBook = await getUserBookDetail(bookId);
  } catch {
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
                내 서재 상세
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <Link
              href="/library"
              className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              서재로 돌아가기
            </Link>
            <AuthButtons />
          </div>
        </header>

        <UserBookDetailClient initialBook={userBook} />
      </div>
    </div>
  );
}
