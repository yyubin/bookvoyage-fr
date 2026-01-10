import Link from "next/link";
import { getUserBookStatisticsServer } from "../services/userBookStatisticsServerService";

export default async function UserLibraryCard() {
  const { response, status } = await getUserBookStatisticsServer();
  const isSignedIn = status !== 401 && status !== 302;
  const stats = response
    ? [
        { label: "읽고 싶은 책", value: response.wantToReadCount },
        { label: "읽는 중", value: response.readingCount },
        { label: "완독", value: response.completedCount },
      ]
    : [];

  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
      <h4 className="font-serif text-xl font-semibold">내 서재</h4>
      {response ? (
        <>
          <p className="mt-2 text-sm text-[var(--muted)]">
            지금 읽는 책과 진행 상황을 한눈에 정리하세요.
          </p>
          <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            {stats.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span>{item.label}</span>
                <span className="font-semibold text-[var(--ink)]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/library"
            className="mt-6 block w-full rounded-full bg-[var(--ink)] px-4 py-2 text-center text-sm font-semibold text-white"
          >
            서재 열기
          </Link>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {isSignedIn
              ? "서재 정보를 불러오는 중 문제가 발생했어요."
              : "로그인하고 나만의 서재를 만들어보세요."}
          </p>
          {!isSignedIn && (
            <Link
              href="/auth"
              className="mt-6 block w-full rounded-full bg-[var(--ink)] px-4 py-2 text-center text-sm font-semibold text-white"
            >
              로그인하고 시작하기
            </Link>
          )}
        </>
      )}
    </div>
  );
}
