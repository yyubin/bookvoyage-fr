import { getShelfAdditionTrendServer } from "../services/bookTrendServerService";

function formatCount(count: number) {
  if (count >= 1000) {
    const rounded = Math.round(count / 100) / 10;
    return `${rounded}k`;
  }
  return String(count);
}

export default async function DailyPickCard() {
  const { response } = await getShelfAdditionTrendServer(1);
  const pick = response?.items[0];

  if (!pick) {
    return (
      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
          데일리 픽
        </p>
        <h3 className="mt-3 font-serif text-2xl font-semibold">
          오늘 가장 많이 읽히는 책
        </h3>
        <p className="mt-4 text-sm text-[var(--muted)]">
          아직 읽히고 있는 책이 없어요. 가장 먼저 책을 읽어주세요.
        </p>
      </div>
    );
  }
  const coverStyle = pick.book.coverUrl
    ? { backgroundImage: `url(${pick.book.coverUrl})` }
    : undefined;

  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
        데일리 픽
      </p>
      <h3 className="mt-3 font-serif text-2xl font-semibold">
        오늘 가장 많이 읽히는 책
      </h3>
      <div className="mt-5 flex items-center gap-4">
        <div
          className="h-20 w-14 overflow-hidden rounded-2xl bg-gradient-to-br from-[#f4c7a1] via-[#f09c6b] to-[#d6633b] bg-cover bg-center shadow-md"
          style={coverStyle}
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold text-[var(--ink)]">
            {pick.book.title}
          </p>
          <p className="text-xs text-[var(--muted)]">
            {pick.book.authors?.[0] ?? "작가 정보 없음"}
          </p>
          <p className="mt-2 text-xs text-[var(--muted)]">
            현재 {formatCount(pick.addedCount)} 리액션
          </p>
        </div>
      </div>
    </div>
  );
}
