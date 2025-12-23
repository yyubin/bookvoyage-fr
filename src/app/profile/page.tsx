"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getFollowers,
  getFollowing,
  getProfileSummary,
} from "../services/profileService";
import type {
  CursorPage,
  FollowUser,
  ProfileSummary,
} from "../types/content";

const recentReviews = [
  {
    title: "미드나잇 라이브러리",
    author: "매트 헤이그",
    rating: "4.6",
    reactions: "1.2k",
    excerpt:
      "후회와 가능성이 겹치는 지점에서 시작되는 이야기. 다시 읽고 싶은 문장들.",
    time: "2일 전",
  },
  {
    title: "편의점 인간",
    author: "무라타 사야카",
    rating: "4.1",
    reactions: "690",
    excerpt:
      "정상성에 대한 질문이 날카롭게 남는다. 짧지만 여운이 길다.",
    time: "1주 전",
  },
  {
    title: "아몬드",
    author: "손원평",
    rating: "4.3",
    reactions: "980",
    excerpt:
      "감정의 언어를 배우는 과정이 잔잔하고 따뜻하다. 추천하고 싶은 책.",
    time: "2주 전",
  },
];

const bookmarks = [
  { title: "파친코", author: "이민진", by: "박지수" },
  { title: "페이퍼 팰리스", author: "미란다 카울리 헬러", by: "조아리" },
  { title: "기억 전달자", author: "로이스 로리", by: "정유진" },
];

const profileStats = [
  { label: "리뷰", key: "reviews" },
  { label: "팔로워", key: "followers" },
  { label: "팔로잉", key: "following" },
] as const;

const shelves = [
  { label: "읽는 중", key: "reading" },
  { label: "완독", key: "finished" },
  { label: "저장한 리뷰", key: "savedReviews" },
  { label: "북마크", key: "bookmarks" },
] as const;

export default function ProfilePage() {
  const userId = "user-001";
  const [isFollowing, setIsFollowing] = useState(false);
  const isOwner = false;
  const [modalOpen, setModalOpen] = useState<"followers" | "following" | null>(
    null,
  );
  const [profileSummary, setProfileSummary] = useState<ProfileSummary | null>(
    null,
  );
  const [followersPage, setFollowersPage] =
    useState<CursorPage<FollowUser> | null>(null);
  const [followingPage, setFollowingPage] =
    useState<CursorPage<FollowUser> | null>(null);
  const [isFollowersLoading, setIsFollowersLoading] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const summary = await getProfileSummary(userId);
      setProfileSummary(summary);
    };

    void loadProfile();
  }, [userId]);

  const formatCount = (value?: number) =>
    value === undefined ? "-" : value.toLocaleString("ko-KR");

  const followList = useMemo(() => {
    if (modalOpen === "followers") {
      return followersPage?.items ?? [];
    }
    if (modalOpen === "following") {
      return followingPage?.items ?? [];
    }
    return [];
  }, [followersPage, followingPage, modalOpen]);

  const loadFollowers = async (cursor?: string | null) => {
    if (isFollowersLoading) {
      return;
    }
    setIsFollowersLoading(true);
    const page = await getFollowers(userId, { cursor, limit: 5 });
    setFollowersPage((prev) =>
      cursor && prev
        ? { items: [...prev.items, ...page.items], nextCursor: page.nextCursor }
        : page,
    );
    setIsFollowersLoading(false);
  };

  const loadFollowing = async (cursor?: string | null) => {
    if (isFollowingLoading) {
      return;
    }
    setIsFollowingLoading(true);
    const page = await getFollowing(userId, { cursor, limit: 5 });
    setFollowingPage((prev) =>
      cursor && prev
        ? { items: [...prev.items, ...page.items], nextCursor: page.nextCursor }
        : page,
    );
    setIsFollowingLoading(false);
  };

  useEffect(() => {
    if (modalOpen === "followers") {
      void loadFollowers(null);
    }
    if (modalOpen === "following") {
      void loadFollowing(null);
    }
    if (!modalOpen) {
      setFollowersPage(null);
      setFollowingPage(null);
    }
  }, [modalOpen]);

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
                프로필
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <Link
              href="/"
              className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              피드로 돌아가기
            </Link>
            {isOwner ? (
              <button className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]">
                프로필 편집
              </button>
            ) : (
              <button
                className={`rounded-full px-5 py-2 text-sm font-semibold shadow-md transition hover:-translate-y-0.5 ${
                  isFollowing
                    ? "border border-[var(--border)] bg-white text-[var(--ink)]"
                    : "bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]"
                }`}
                onClick={() => setIsFollowing((prev) => !prev)}
              >
                {isFollowing ? "팔로잉" : "팔로우"}
              </button>
            )}
          </div>
        </header>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[var(--shadow)]">
            <div className="flex flex-wrap items-center gap-6">
              <div className="h-24 w-24 rounded-[28px] bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c]" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-serif text-3xl font-semibold text-[var(--ink)]">
                    {profileSummary?.name ?? "프로필 로딩 중"}
                  </h2>
                  <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                    취향 태그 · {profileSummary?.tags?.[0] ?? "기록 중"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  {profileSummary?.bio ??
                    "리뷰어 소개를 불러오는 중입니다."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
                  {profileStats.map((item) => {
                    const isFollower = item.label === "팔로워";
                    const isFollowingLabel = item.label === "팔로잉";
                    const isClickable = isFollower || isFollowingLabel;
                    const count =
                      profileSummary?.stats?.[item.key] ?? undefined;
                    return (
                      <button
                        key={item.label}
                        className={`rounded-full border border-[var(--border)] bg-white px-3 py-1 transition ${
                          isClickable
                            ? "hover:border-transparent hover:bg-[var(--paper-strong)]"
                            : ""
                        }`}
                        onClick={() => {
                          if (isFollower) {
                            setModalOpen("followers");
                          } else if (isFollowingLabel) {
                            setModalOpen("following");
                          }
                        }}
                        type="button"
                      >
                        {item.label} {formatCount(count)}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-semibold">
                {isOwner ? (
                  <button className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[var(--ink)]">
                    내 프로필
                  </button>
                ) : (
                  <>
                    <button
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isFollowing
                          ? "border border-[var(--border)] bg-white text-[var(--ink)]"
                          : "bg-[var(--ink)] text-white"
                      }`}
                      onClick={() => setIsFollowing((prev) => !prev)}
                    >
                      {isFollowing ? "팔로잉" : "팔로우"}
                    </button>
                    <button className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[var(--ink)]">
                      메시지
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {shelves.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-4 text-sm"
                >
                  <p className="text-xs text-[var(--muted)]">{item.label}</p>
                  <p className="mt-2 font-serif text-xl font-semibold text-[var(--ink)]">
                    {formatCount(profileSummary?.shelves?.[item.key])}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)]">
            <h3 className="font-serif text-xl font-semibold">읽고 있는 책</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              이번 주에 집중하고 있는 책들.
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                <p className="font-semibold text-[var(--ink)]">
                  밤의 도서관
                </p>
                <p className="text-xs text-[var(--muted)]">매트 헤이그</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                <p className="font-semibold text-[var(--ink)]">작별인사</p>
                <p className="text-xs text-[var(--muted)]">김영하</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                <p className="font-semibold text-[var(--ink)]">불편한 편의점</p>
                <p className="text-xs text-[var(--muted)]">김호연</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[32px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-serif text-2xl font-semibold">작성한 리뷰</h3>
              <button className="text-sm font-semibold text-[var(--accent)]">
                전체 리뷰 보기
              </button>
            </div>
            <div className="mt-5 space-y-5">
              {recentReviews.map((review, index) => {
                const slugMap: Record<string, string> = {
                  "미드나잇 라이브러리": "midnight-library",
                  "편의점 인간": "convenience-store-woman",
                  아몬드: "almond",
                };
                const slug = slugMap[review.title];
                return (
                  <Link
                    key={review.title}
                    href={slug ? `/reviews/${slug}` : "/"}
                    className={`flex flex-col gap-5 rounded-[28px] border border-[var(--border)] bg-white px-5 py-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row ${
                      index === 0 ? "ring-1 ring-[var(--accent)]" : ""
                    }`}
                  >
                    <div className="h-28 w-20 flex-shrink-0 rounded-2xl bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c]" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-base font-semibold text-[var(--ink)]">
                            {review.title}
                          </p>
                          <p className="text-xs text-[var(--muted)]">
                            {review.author}
                          </p>
                        </div>
                        <span className="rounded-full bg-[var(--paper-strong)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                          평점 {review.rating}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-[var(--muted)]">
                        {review.excerpt}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)]">
                        <span>리액션 {review.reactions}</span>
                        <span>{review.time}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-[32px] border border-[var(--border)] bg-white/80 p-6 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-serif text-2xl font-semibold">북마크</h3>
              <button className="text-sm font-semibold text-[var(--accent)]">
                모두 보기
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              {bookmarks.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
                >
                  <p className="font-semibold text-[var(--ink)]">{item.title}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {item.author} · {item.by}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {modalOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-md rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-serif text-xl font-semibold">
                  {modalOpen === "followers" ? "팔로워" : "팔로잉"}
                </h3>
                <button
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)]"
                  onClick={() => setModalOpen(null)}
                  type="button"
                >
                  닫기
                </button>
              </div>
            <div className="mt-4 space-y-2 text-sm">
              {followList.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-[var(--ink)]">
                      {user.name}
                    </p>
                    <p className="text-xs text-[var(--muted)]">{user.bio}</p>
                  </div>
                  <button
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)]"
                    type="button"
                  >
                    프로필 보기
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-center">
              {modalOpen === "followers" && followersPage?.nextCursor ? (
                <button
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--muted)]"
                  onClick={() => loadFollowers(followersPage.nextCursor)}
                  type="button"
                >
                  {isFollowersLoading ? "불러오는 중..." : "더 보기"}
                </button>
              ) : null}
              {modalOpen === "following" && followingPage?.nextCursor ? (
                <button
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--muted)]"
                  onClick={() => loadFollowing(followingPage.nextCursor)}
                  type="button"
                >
                  {isFollowingLoading ? "불러오는 중..." : "더 보기"}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
      </div>
    </div>
  );
}
