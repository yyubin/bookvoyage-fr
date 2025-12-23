import Link from "next/link";
import { books } from "./data/books";
import { reviews } from "./data/reviews";

const carouselPicks = [
  "잔잔한 몰입",
  "도시의 빛이 있는 이야기",
  "짧고 깊은 책",
  "따뜻한 결말",
  "가족을 닮은 관계",
];

export default function Home() {
  return (
    <div className="paper-texture min-h-screen">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-8 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-lg font-semibold text-white shadow-md">
              BV
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Bookvoyage
              </p>
              <h1 className="font-serif text-2xl font-semibold">
                읽고, 반응하고, 흐르다.
              </h1>
            </div>
          </div>
          <nav className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <button className="rounded-full border border-transparent bg-white/70 px-4 py-2 text-[var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              피드
            </button>
            <button className="rounded-full border border-[var(--border)] bg-transparent px-4 py-2 transition hover:border-transparent hover:bg-white/60">
              책
            </button>
            <button className="rounded-full border border-[var(--border)] bg-transparent px-4 py-2 transition hover:border-transparent hover:bg-white/60">
              모임
            </button>
            <Link
              href="/profile"
              className="rounded-full border border-[var(--border)] bg-transparent px-4 py-2 transition hover:border-transparent hover:bg-white/60"
            >
              프로필
            </Link>
          </nav>
          <button className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]">
            리뷰 쓰기
          </button>
        </header>

        <section className="fade-up mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-white/70 bg-white/70 p-8 shadow-[var(--shadow)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
              오늘의 추천
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight">
              당신의 취향을 따라가는 조용한 이야기들.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
              Bookvoyage는 당신이 머무는 문장과 분위기를 따라 리뷰와 추천을
              엮습니다. 피드를 넘기거나, 믿는 독자의 추천 트레일을 시작해 보세요.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button className="rounded-full bg-[var(--ink)] px-5 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5">
                오늘의 피드 보기
              </button>
              <button className="rounded-full border border-[var(--border)] bg-white/80 px-5 py-2 text-sm font-semibold text-[var(--ink)] transition hover:border-transparent hover:bg-white">
                내 서재 만들기
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
                데일리 픽
              </p>
              <h3 className="mt-3 font-serif text-2xl font-semibold">
                오늘 가장 많이 읽히는 책
              </h3>
              <div className="mt-5 flex items-center gap-4">
                <div className="h-20 w-14 rounded-2xl bg-gradient-to-br from-[#f4c7a1] via-[#f09c6b] to-[#d6633b] shadow-md" />
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    레슨 인 케미스트리
                  </p>
                  <p className="text-xs text-[var(--muted)]">보니 가머스</p>
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    현재 3.4k 리액션
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[var(--border)] bg-white/80 p-6 shadow-[var(--shadow)]">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
                지금의 독서 분위기
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--ink)]">
                {carouselPicks.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[var(--border)] bg-white px-3 py-2"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="fade-up-delay mt-12">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-serif text-2xl font-semibold">책 추천</h3>
            <button className="text-sm font-semibold text-[var(--accent)]">
              추천 전체 보기
            </button>
          </div>
          <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.slug}`}
                className="min-w-[220px] rounded-[24px] border border-[var(--border)] bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="h-28 w-full rounded-2xl bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c]" />
                <p className="mt-4 text-sm font-semibold">{book.title}</p>
                <p className="text-xs text-[var(--muted)]">{book.author}</p>
                <span className="mt-4 inline-flex text-xs font-semibold text-[var(--accent)]">
                  책 상세 보기
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-semibold">커뮤니티 피드</h3>
              <div className="flex gap-2 text-xs font-semibold text-[var(--muted)]">
                <button className="rounded-full bg-white px-3 py-2 shadow-sm">
                  최신순
                </button>
                <button className="rounded-full border border-[var(--border)] px-3 py-2">
                  인기순
                </button>
                <button className="rounded-full border border-[var(--border)] px-3 py-2">
                  팔로잉
                </button>
              </div>
            </div>
            {reviews.map((review) => (
              <Link
                key={review.slug}
                href={`/reviews/${review.slug}`}
                className="block rounded-[28px] border border-[var(--border)] bg-white/90 p-6 shadow-[var(--shadow)] transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="h-28 w-20 flex-shrink-0 rounded-2xl bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c]" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-[var(--ink)]">
                          {review.title}
                        </p>
                        <p className="text-sm text-[var(--muted)]">
                          {review.author}
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--paper-strong)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                        평점 {review.rating}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                      {review.blurb}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                      <div className="flex items-center gap-2">
                        {review.reactions.slice(0, 3).map((reaction) => (
                          <span
                            key={reaction.emoji}
                            className="rounded-full border border-[var(--border)] px-3 py-1"
                          >
                            {reaction.emoji} {reaction.count}
                          </span>
                        ))}
                        <span className="rounded-full border border-[var(--border)] px-3 py-1">
                          좋아요 {review.likes}
                        </span>
                      </div>
                        <span className="rounded-full border border-[var(--border)] px-3 py-1">
                          댓글 {review.comments}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
                        <span>{review.reviewer}</span>
                        <span className="h-1 w-1 rounded-full bg-[var(--muted)]" />
                        <span>2시간 전</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
              <h4 className="font-serif text-xl font-semibold">내 서재</h4>
              <p className="mt-2 text-sm text-[var(--muted)]">
                지금 읽는 책과 반응을 한눈에 정리하세요.
              </p>
              <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                <div className="flex items-center justify-between">
                  <span>읽는 중</span>
                  <span className="font-semibold text-[var(--ink)]">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>저장한 리뷰</span>
                  <span className="font-semibold text-[var(--ink)]">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>북마크</span>
                  <span className="font-semibold text-[var(--ink)]">32</span>
                </div>
              </div>
              <button className="mt-5 w-full rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">
                서재 열기
              </button>
            </div>

            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
              <h4 className="font-serif text-xl font-semibold">리뷰 서클</h4>
              <p className="mt-2 text-sm text-[var(--muted)]">
                비슷한 취향의 독자들이 지금 이야기하는 주제들.
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                  <span className="font-semibold text-[var(--ink)]">
                    모던 클래식
                  </span>
                  <span className="text-xs text-[var(--muted)]">128개 글</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                  <span className="font-semibold text-[var(--ink)]">
                    소프트 SF
                  </span>
                  <span className="text-xs text-[var(--muted)]">92개 글</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                  <span className="font-semibold text-[var(--ink)]">
                    치유 에세이
                  </span>
                  <span className="text-xs text-[var(--muted)]">64개 글</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
}
