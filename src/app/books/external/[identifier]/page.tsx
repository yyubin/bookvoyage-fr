import Link from "next/link";
import LogoMark from "../../../components/LogoMark";
import AuthButtons from "../../../components/AuthButtons";

type ExternalBookPageProps = {
  params: Promise<{ identifier: string }>;
  searchParams?: Promise<{
    title?: string;
    authors?: string;
    coverUrl?: string;
    publisher?: string;
    description?: string;
  }>;
};

export default async function ExternalBookPage({
  params,
  searchParams,
}: ExternalBookPageProps) {
  const { identifier } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const title = resolvedSearchParams.title ?? "제목 정보 없음";
  const authors = resolvedSearchParams.authors ?? "저자 정보 없음";
  const coverUrl = resolvedSearchParams.coverUrl ?? "";
  const publisher = resolvedSearchParams.publisher ?? "출판사 정보 없음";
  const description =
    resolvedSearchParams.description ?? "책 소개 정보를 준비 중입니다.";

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
                외부 도서 상세
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <Link
              href="/search"
              className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              검색으로 돌아가기
            </Link>
            <AuthButtons />
          </div>
        </header>

        <main className="mt-10 rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[var(--shadow)]">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="h-44 w-32 flex-shrink-0 rounded-3xl bg-[var(--paper-strong)] shadow-md">
              {coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverUrl}
                  alt={title}
                  className="h-full w-full rounded-3xl object-cover"
                />
              ) : null}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--muted)]">
                {authors}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--ink)]">
                {title}
              </h2>
              <p className="mt-4 text-sm text-[var(--muted)]">{publisher}</p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                {description}
              </p>
              <div className="mt-4 text-xs text-[var(--muted)]">
                식별자: {identifier}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
