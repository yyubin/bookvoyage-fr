import Link from "next/link";
import { getReviewCircleTopicsServer } from "../services/reviewCircleServerService";

export default async function ReviewCircleCard() {
  const { response, status } = await getReviewCircleTopicsServer({
    window: "7d",
    limit: 3,
  });
  const isSignedIn = status !== 401 && status !== 302;

  return (
      <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
      <h4 className="font-serif text-xl font-semibold">리뷰 서클</h4>
      {isSignedIn && (
        <p className="mt-2 text-sm text-[var(--muted)]">
          비슷한 취향의 독자들이 지금 이야기하는 주제들.
        </p>
      )}
      {!isSignedIn ? (
        <>
          <p className="mt-4 text-sm text-[var(--muted)]">
            로그인해서 비슷한 취향의 사람들을 찾아보세요.
          </p>
          <Link
            href="/auth"
            className="mt-4 block w-full rounded-full bg-[var(--ink)] px-4 py-2 text-center text-sm font-semibold text-white"
          >
            로그인하고 시작하기
          </Link>
        </>
      ) : response ? (
        <>
          <div className="mt-4 space-y-3 text-sm">
            {response.topics.length > 0 ? (
              response.topics.map((topic) => (
                <div
                  key={topic.keyword}
                  className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
                >
                  <span className="font-semibold text-[var(--ink)]">
                    {topic.keyword}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {topic.reviewCount}개 글
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">
                아직 이야기 중인 주제가 없어요.
              </p>
            )}
          </div>
          {response.isFallback && (
            <p className="mt-4 text-xs text-[var(--muted)]">
              커뮤니티 트렌드를 기반으로 보여드려요.
            </p>
          )}
        </>
      ) : (
        <p className="mt-4 text-sm text-[var(--muted)]">
          리뷰 서클 정보를 불러오는 중 문제가 발생했어요.
        </p>
      )}
    </div>
  );
}
