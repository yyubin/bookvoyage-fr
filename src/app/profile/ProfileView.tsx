"use client";

import Link from "next/link";
import AuthButtons from "../components/AuthButtons";
import LogoMark from "../components/LogoMark";
import { useEffect, useMemo, useState } from "react";
import { reviews } from "../data/reviews";
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

type ProfileViewProps = {
  userId: string;
};

export default function ProfileView({ userId }: ProfileViewProps) {
  const isOwner = userId === "1";
  const [isFollowing, setIsFollowing] = useState(false);
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

  const userReviews = useMemo(
    () => reviews.filter((review) => review.reviewerId === userId),
    [userId],
  );

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
            <LogoMark />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Bookvoyage
              </p>
              <h1 className="font-serif text-2xl font-semibold">프로필</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <Link
              href="/"
              className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              피드로 돌아가기
            </Link>
            <Link
              href="/library"
              className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              내 서재
            </Link>
            <AuthButtons />
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
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-xl font-semibold">
                읽고 있는 책
              </h3>
              <Link
                href={`/profile/${userId}/reading`}
                className="text-xs font-semibold text-[var(--accent)]"
              >
                모두 보기
              </Link>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              이번 주에 집중하고 있는 책들.
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <Link
                href="/books/midnight-library"
                className="block rounded-2xl border border-[var(--border)] bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="font-semibold text-[var(--ink)]">밤의 도서관</p>
                <p className="text-xs text-[var(--muted)]">매트 헤이그</p>
              </Link>
              <Link
                href="/books/farewell"
                className="block rounded-2xl border border-[var(--border)] bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="font-semibold text-[var(--ink)]">작별인사</p>
                <p className="text-xs text-[var(--muted)]">김영하</p>
              </Link>
              <Link
                href="/books/comfort-store"
                className="block rounded-2xl border border-[var(--border)] bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="font-semibold text-[var(--ink)]">불편한 편의점</p>
                <p className="text-xs text-[var(--muted)]">김호연</p>
              </Link>
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[32px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-serif text-2xl font-semibold">작성한 리뷰</h3>
              <Link
                href={`/profile/${userId}/reviews`}
                className="text-sm font-semibold text-[var(--accent)]"
              >
                전체 리뷰 보기
              </Link>
            </div>
            <div className="mt-5 space-y-5">
              {userReviews.map((review, index) => {
                const topReactions = review.reactions.slice(0, 2);
                return (
                  <Link
                    key={review.title}
                    href={`/reviews/${review.slug}`}
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
                        {review.blurb}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)]">
                        <div className="flex items-center gap-2">
                          {topReactions.map((reaction) => (
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
                        <span>댓글 {review.comments}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {userReviews.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
                아직 작성한 리뷰가 없어요.
              </div>
            ) : null}
          </div>

          <div className="rounded-[32px] border border-[var(--border)] bg-white/80 p-6 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-serif text-2xl font-semibold">북마크</h3>
              <Link
                href={`/profile/${userId}/bookmarks`}
                className="text-sm font-semibold text-[var(--accent)]"
              >
                모두 보기
              </Link>
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
                    <Link
                      href={`/profile/${user.id}`}
                      className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)]"
                    >
                      프로필 보기
                    </Link>
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
