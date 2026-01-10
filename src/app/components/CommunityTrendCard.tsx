import { getCommunityTrendServer } from "../services/aiServerService";
import type { CommunityTrendResponse } from "../types/content";

const fallbackTrend: CommunityTrendResponse = {
  keywords: ["잔잔한 몰입", "도시의 빛", "짧고 깊은 책"],
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
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-[2px] shadow-lg">
      <div className="rounded-[26px] bg-white/95 p-6 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-pulse text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <p className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-xs font-bold uppercase tracking-[0.4em] text-transparent">
                AI 독서 분위기 분석
              </p>
            </div>
            <h3 className="mt-3 font-serif text-2xl font-semibold leading-snug">
              {trend.summary}
            </h3>
          </div>
          <div className="whitespace-nowrap rounded-full border-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 px-3.5 py-1.5 text-[11px] font-bold text-purple-700">
            {isFallback ? "업데이트 대기" : "AI 분석"}
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
      <div className="absolute -bottom-10 -right-10 h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-purple-300/20 via-pink-300/20 to-blue-300/20 blur-2xl" />
    </div>
  );
}
