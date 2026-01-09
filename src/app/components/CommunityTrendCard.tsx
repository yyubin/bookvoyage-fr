import { getCommunityTrendServer } from "../services/aiServerService";
import type { CommunityTrendResponse } from "../types/content";

const fallbackTrend: CommunityTrendResponse = {
  keywords: ["잔잔한 몰입", "도시의 빛이 있는 이야기", "짧고 깊은 책"],
  summary: "오늘은 조용히 곁에 머무는 이야기들이 함께 읽히고 있어요.",
  genres: [
    { genre: "에세이", percentage: 0.32, mood: "상승세" },
    { genre: "힐링 소설", percentage: 0.28, mood: "안정" },
    { genre: "성장 서사", percentage: 0.2, mood: "상승세" },
  ],
  analyzedAt: new Date().toISOString(),
};

const moodStyles: Record<string, string> = {
  상승세: "border-[#f0c39f] bg-[#fff1e6] text-[#a0472c]",
  하락세: "border-[#f0b3a1] bg-[#fff0ed] text-[#9b3a2b]",
  안정: "border-[var(--border)] bg-white/80 text-[var(--muted)]",
};

function formatPercent(value: number) {
  const normalized = value > 1 ? value : value * 100;
  const rounded = Math.round(normalized * 10) / 10;
  return `${rounded}%`;
}

export default async function CommunityTrendCard() {
  const { response } = await getCommunityTrendServer();
  const trend = response ?? fallbackTrend;
  const isFallback = response === null;
  if (isFallback) {
    console.warn("[ai] CommunityTrendCard using fallback data");
  }
  const analyzedAt = new Date(trend.analyzedAt);

  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-white/80 p-6 shadow-[var(--shadow)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
            지금의 독서 분위기
          </p>
          <h3 className="mt-3 font-serif text-2xl font-semibold leading-snug">
            {trend.summary}
          </h3>
        </div>
        <div className="rounded-full border border-[var(--border)] bg-white/80 px-3 py-1 text-[11px] font-semibold text-[var(--muted)]">
          {isFallback ? "업데이트 대기" : "오늘의 분석"}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--ink)]">
        {trend.keywords.map((item) => (
          <span
            key={item}
            className="rounded-full border border-[var(--border)] bg-white px-3 py-2"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {trend.genres.map((genre) => {
          const styleClass = moodStyles[genre.mood] ?? moodStyles.안정;
          return (
            <div
              key={`${genre.genre}-${genre.mood}`}
              className="rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-[var(--ink)]">
                  {genre.genre}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${styleClass}`}
                >
                  {genre.mood}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f2e8dc]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{ width: formatPercent(genre.percentage) }}
                  />
                </div>
                <span className="text-xs font-semibold text-[var(--muted)]">
                  {formatPercent(genre.percentage)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-[var(--muted)]">
        {isFallback
          ? "커뮤니티 트렌드 분석이 준비되는 중이에요."
          : `마지막 분석 ${analyzedAt.toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
            })}`}
      </p>
    </div>
  );
}
