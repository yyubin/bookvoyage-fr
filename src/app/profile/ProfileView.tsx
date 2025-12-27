"use client";

import Link from "next/link";
import AuthButtons from "../components/AuthButtons";
import LogoMark from "../components/LogoMark";
import { useEffect, useMemo, useState } from "react";
import {
  fetchLatestReadingBooks,
  fetchMyBookmarkedReviews,
  fetchUserReviews,
  getFollowers,
  getFollowing,
  getProfileSummary,
} from "../services/profileService";
import {
  updateMyBio,
  updateMyNickname,
  updateMyProfileImage,
  requestProfileImageUploadUrl,
  uploadProfileImageToS3,
  updateMyTasteTag,
} from "../services/userService";
import type {
  BookmarkedReviewItem,
  CursorPage,
  FollowUser,
  ReadingBookItem,
  ProfileSummary,
  ProfileReviewItem,
} from "../types/content";

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
  const [readingBooks, setReadingBooks] = useState<ReadingBookItem[]>([]);
  const [bookmarkedReviews, setBookmarkedReviews] = useState<
    BookmarkedReviewItem[]
  >([]);
  const [profileReviews, setProfileReviews] = useState<ProfileReviewItem[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [followersPage, setFollowersPage] =
    useState<CursorPage<FollowUser> | null>(null);
  const [followingPage, setFollowingPage] =
    useState<CursorPage<FollowUser> | null>(null);
  const [isFollowersLoading, setIsFollowersLoading] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSavingTag, setIsSavingTag] = useState(false);
  const [isSavingBio, setIsSavingBio] = useState(false);
  const [isSavingNickname, setIsSavingNickname] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(
    null,
  );
  const [tagError, setTagError] = useState<string | null>(null);
  const [bioError, setBioError] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const summary = await getProfileSummary(userId);
      setProfileSummary(summary);
    };

    void loadProfile();
  }, [userId]);

  useEffect(() => {
    const loadReadingBooks = async () => {
      try {
        const items = await fetchLatestReadingBooks(userId, 3);
        setReadingBooks(items);
      } catch {
        setReadingBooks([]);
      }
    };

    void loadReadingBooks();
  }, [userId]);

  useEffect(() => {
    if (!isOwner) {
      setBookmarkedReviews([]);
      return;
    }

    const loadBookmarks = async () => {
      try {
        const items = await fetchMyBookmarkedReviews(3);
        setBookmarkedReviews(items);
      } catch {
        setBookmarkedReviews([]);
      }
    };

    void loadBookmarks();
  }, [isOwner]);

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

  useEffect(() => {
    const loadReviews = async () => {
      setIsReviewsLoading(true);
      try {
        const page = await fetchUserReviews(userId, { cursor: null, limit: 3 });
        setProfileReviews(page.items ?? []);
      } catch {
        setProfileReviews([]);
      } finally {
        setIsReviewsLoading(false);
      }
    };

    void loadReviews();
  }, [userId]);

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

  const openTagModal = () => {
    setTagInput(profileSummary?.tasteTag ?? "");
    setTagError(null);
    setIsTagModalOpen(true);
  };

  const openBioModal = () => {
    setBioInput(profileSummary?.bio ?? "");
    setBioError(null);
    setIsBioModalOpen(true);
  };

  const openNicknameModal = () => {
    setNicknameInput(profileSummary?.name ?? "");
    setNicknameError(null);
    setIsNicknameModalOpen(true);
  };

  const openImageModal = () => {
    setImageFile(null);
    setImageError(null);
    setImageUploadProgress(null);
    setIsImageModalOpen(true);
  };

  const saveTag = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSavingTag) {
      return;
    }
    const nextTag = tagInput.trim();
    if (!nextTag) {
      setTagError("태그를 입력해주세요.");
      return;
    }
    if (nextTag.length > 100) {
      setTagError("태그는 100자 이내로 입력해주세요.");
      return;
    }

    setIsSavingTag(true);
    setTagError(null);
    try {
      await updateMyTasteTag(nextTag);
      setProfileSummary((prev) =>
        prev ? { ...prev, tasteTag: nextTag } : prev,
      );
      setIsTagModalOpen(false);
    } catch {
      setTagError("태그 저장에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsSavingTag(false);
    }
  };

  const saveBio = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSavingBio) {
      return;
    }
    const nextBio = bioInput.trim();
    if (!nextBio) {
      setBioError("소개를 입력해주세요.");
      return;
    }
    if (nextBio.length > 500) {
      setBioError("소개는 500자 이내로 입력해주세요.");
      return;
    }

    setIsSavingBio(true);
    setBioError(null);
    try {
      await updateMyBio(nextBio);
      setProfileSummary((prev) => (prev ? { ...prev, bio: nextBio } : prev));
      setIsBioModalOpen(false);
    } catch {
      setBioError("소개 저장에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsSavingBio(false);
    }
  };

  const saveNickname = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSavingNickname) {
      return;
    }
    const nextNickname = nicknameInput.trim();
    if (!nextNickname) {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }
    if (nextNickname.length > 30) {
      setNicknameError("닉네임은 30자 이내로 입력해주세요.");
      return;
    }

    setIsSavingNickname(true);
    setNicknameError(null);
    try {
      await updateMyNickname(nextNickname);
      setProfileSummary((prev) =>
        prev ? { ...prev, name: nextNickname } : prev,
      );
      setIsNicknameModalOpen(false);
    } catch {
      setNicknameError("닉네임 저장에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsSavingNickname(false);
    }
  };

  const saveImage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSavingImage) {
      return;
    }
    const maxBytes = Number(
      process.env.NEXT_PUBLIC_PROFILE_IMAGE_MAX_BYTES ?? "5242880",
    );
    if (!imageFile) {
      setImageError("이미지 파일을 선택해주세요.");
      return;
    }
    if (imageFile.size > maxBytes) {
      setImageError(
        `이미지 크기는 ${Math.round(maxBytes / 1024 / 1024)}MB 이하만 가능합니다.`,
      );
      return;
    }
    if (imageFile.type && !imageFile.type.startsWith("image/")) {
      setImageError("이미지 파일만 업로드할 수 있어요.");
      return;
    }

    setIsSavingImage(true);
    setImageError(null);
    setImageUploadProgress(0);
    try {
      const uploadInfo = await requestProfileImageUploadUrl(imageFile.name);
      await uploadProfileImageToS3(
        uploadInfo.presignedUrl,
        imageFile,
        setImageUploadProgress,
      );
      await updateMyProfileImage(uploadInfo.fileUrl);
      setProfileSummary((prev) =>
        prev ? { ...prev, profileImageUrl: uploadInfo.fileUrl } : prev,
      );
      setIsImageModalOpen(false);
    } catch {
      setImageError("이미지 업로드에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsSavingImage(false);
    }
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
              <div className="h-24 w-24 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c]">
                {profileSummary?.profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profileSummary.profileImageUrl}
                    alt={profileSummary?.name ?? "프로필 이미지"}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-serif text-3xl font-semibold text-[var(--ink)]">
                    {profileSummary?.name ?? "프로필 로딩 중"}
                  </h2>
                  <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                    취향 태그 · {profileSummary?.tasteTag ?? "기록 중"}
                  </span>
                </div>
                <div className="mt-3 text-sm text-[var(--muted)]">
                  <p>
                    {profileSummary?.bio ??
                      "리뷰어 소개를 불러오는 중입니다."}
                  </p>
                  {isOwner ? (
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                      <button
                        type="button"
                        className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[var(--muted)] transition hover:border-transparent hover:bg-[var(--paper-strong)]"
                        onClick={openTagModal}
                      >
                        태그 수정
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[var(--muted)] transition hover:border-transparent hover:bg-[var(--paper-strong)]"
                        onClick={openBioModal}
                      >
                        소개 수정
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[var(--muted)] transition hover:border-transparent hover:bg-[var(--paper-strong)]"
                        onClick={openNicknameModal}
                      >
                        닉네임 수정
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[var(--muted)] transition hover:border-transparent hover:bg-[var(--paper-strong)]"
                        onClick={openImageModal}
                      >
                        이미지 수정
                      </button>
                    </div>
                  ) : null}
                </div>
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
              {readingBooks.map((book) => (
                <div
                  key={book.bookId}
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
                >
                  <p className="font-semibold text-[var(--ink)]">
                    {book.title}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {book.authors.join(", ")}
                  </p>
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    진행률 {book.progressPercentage}%
                  </p>
                </div>
              ))}
              {readingBooks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-3 text-xs text-[var(--muted)]">
                  읽고 있는 책이 없습니다.
                </div>
              ) : null}
            </div>
          </aside>
        </section>

        {isOwner && isTagModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
            <div className="w-full max-w-lg rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-[var(--shadow)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
                    취향 태그 수정
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold">
                    내 취향 태그 바꾸기
                  </h3>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)]"
                  onClick={() => setIsTagModalOpen(false)}
                >
                  닫기
                </button>
              </div>
              <form className="mt-6 space-y-4" onSubmit={saveTag}>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted)]">
                    취향 태그 (100자 이내)
                  </label>
                  <input
                    value={tagInput}
                    onChange={(event) => setTagInput(event.target.value)}
                    placeholder="예: 기록과 사유, 마음이 따뜻해지는 이야기"
                    className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                {tagError ? (
                  <p className="text-xs font-semibold text-rose-500">
                    {tagError}
                  </p>
                ) : null}
                <div className="flex flex-wrap justify-end gap-2 text-sm font-semibold">
                  <button
                    type="button"
                    className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[var(--ink)]"
                    onClick={() => setIsTagModalOpen(false)}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[var(--accent)] px-4 py-2 text-white"
                    disabled={isSavingTag}
                  >
                    {isSavingTag ? "저장 중" : "저장"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {isOwner && isBioModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
            <div className="w-full max-w-lg rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-[var(--shadow)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
                    소개 수정
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold">
                    나를 소개하는 글
                  </h3>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)]"
                  onClick={() => setIsBioModalOpen(false)}
                >
                  닫기
                </button>
              </div>
              <form className="mt-6 space-y-4" onSubmit={saveBio}>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted)]">
                    소개 (500자 이내)
                  </label>
                  <textarea
                    value={bioInput}
                    onChange={(event) => setBioInput(event.target.value)}
                    placeholder="좋아하는 책과 분위기를 짧게 소개해보세요."
                    className="mt-2 h-36 w-full resize-none rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                {bioError ? (
                  <p className="text-xs font-semibold text-rose-500">
                    {bioError}
                  </p>
                ) : null}
                <div className="flex flex-wrap justify-end gap-2 text-sm font-semibold">
                  <button
                    type="button"
                    className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[var(--ink)]"
                    onClick={() => setIsBioModalOpen(false)}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[var(--accent)] px-4 py-2 text-white"
                    disabled={isSavingBio}
                  >
                    {isSavingBio ? "저장 중" : "저장"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {isOwner && isNicknameModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
            <div className="w-full max-w-lg rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-[var(--shadow)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
                    닉네임 수정
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold">
                    프로필 이름 바꾸기
                  </h3>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)]"
                  onClick={() => setIsNicknameModalOpen(false)}
                >
                  닫기
                </button>
              </div>
              <form className="mt-6 space-y-4" onSubmit={saveNickname}>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted)]">
                    닉네임 (30자 이내)
                  </label>
                  <input
                    value={nicknameInput}
                    onChange={(event) => setNicknameInput(event.target.value)}
                    placeholder="새 닉네임을 입력해주세요."
                    className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                {nicknameError ? (
                  <p className="text-xs font-semibold text-rose-500">
                    {nicknameError}
                  </p>
                ) : null}
                <div className="flex flex-wrap justify-end gap-2 text-sm font-semibold">
                  <button
                    type="button"
                    className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[var(--ink)]"
                    onClick={() => setIsNicknameModalOpen(false)}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[var(--accent)] px-4 py-2 text-white"
                    disabled={isSavingNickname}
                  >
                    {isSavingNickname ? "저장 중" : "저장"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {isOwner && isImageModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
            <div className="w-full max-w-lg rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-[var(--shadow)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
                    이미지 수정
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold">
                    프로필 이미지 바꾸기
                  </h3>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)]"
                  onClick={() => setIsImageModalOpen(false)}
                >
                  닫기
                </button>
              </div>
              <form className="mt-6 space-y-4" onSubmit={saveImage}>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted)]">
                    이미지 파일
                  </label>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        setImageFile(event.target.files?.[0] ?? null)
                      }
                      className="w-full text-sm text-[var(--muted)] file:mr-3 file:rounded-full file:border file:border-[var(--border)] file:bg-white file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[var(--ink)]"
                    />
                    <span className="text-xs text-[var(--muted)]">
                      {imageFile?.name ?? "선택된 파일 없음"}
                    </span>
                  </div>
                </div>
                {imageUploadProgress !== null ? (
                  <div className="space-y-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--paper-strong)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)] transition-all"
                        style={{ width: `${imageUploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-[var(--muted)]">
                      업로드 진행률 {imageUploadProgress}%
                    </p>
                  </div>
                ) : null}
                {imageError ? (
                  <p className="text-xs font-semibold text-rose-500">
                    {imageError}
                  </p>
                ) : null}
                <div className="flex flex-wrap justify-end gap-2 text-sm font-semibold">
                  <button
                    type="button"
                    className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[var(--ink)]"
                    onClick={() => setIsImageModalOpen(false)}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[var(--accent)] px-4 py-2 text-white"
                    disabled={isSavingImage}
                  >
                    {isSavingImage ? "저장 중" : "저장"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[32px] border border-[var(--border)] bg-white/85 p-6 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-serif text-2xl font-semibold">작성한 리뷰</h3>
              {profileReviews.length > 0 ? (
                <Link
                  href={`/profile/${userId}/reviews`}
                  className="text-sm font-semibold text-[var(--accent)]"
                >
                  전체 리뷰 보기
                </Link>
              ) : null}
            </div>
            {profileReviews.length > 0 ? (
              <div className="mt-5 space-y-5">
                {profileReviews.map((review, index) => {
                  return (
                    <Link
                      key={review.id}
                      href={`/reviews/${review.id}`}
                      className={`flex flex-col gap-5 rounded-[28px] border border-[var(--border)] bg-white px-5 py-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row ${
                        index === 0 ? "ring-1 ring-[var(--accent)]" : ""
                      }`}
                    >
                      <div className="h-28 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#f2d4b7] via-[#e4b48b] to-[#c46a3c]">
                        {review.coverUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={review.coverUrl}
                            alt={review.title}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-base font-semibold text-[var(--ink)]">
                              {review.title}
                            </p>
                            <p className="text-xs text-[var(--muted)]">
                              {review.authors.join(", ")}
                            </p>
                          </div>
                          <span className="rounded-full bg-[var(--paper-strong)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                            평점 {review.rating}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-[var(--muted)]">
                          {review.summary}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)]">
                          <span>조회수 {review.viewCount}</span>
                          <span>{review.createdAt}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-4 text-sm text-[var(--muted)]">
                {isReviewsLoading
                  ? "리뷰를 불러오는 중입니다."
                  : "작성한 리뷰가 없습니다."}
              </div>
            )}
          </div>

          {isOwner ? (
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
                {bookmarkedReviews.map((item) => (
                  <div
                    key={item.reviewId}
                    className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
                  >
                    <p className="font-semibold text-[var(--ink)]">
                      {item.title}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {item.reviewerNickname} · 평점 {item.rating}
                    </p>
                  </div>
                ))}
                {bookmarkedReviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/60 px-4 py-3 text-xs text-[var(--muted)]">
                    북마크한 리뷰가 없습니다.
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
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
