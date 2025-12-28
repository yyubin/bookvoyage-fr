"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthButtons from "../../components/AuthButtons";
import { useAuth } from "../../components/AuthProvider";
import LogoMark from "../../components/LogoMark";
import { searchBooks } from "../../services/searchService";
import { createReview } from "../../services/reviewWriteService";
import type { BookSearchItem } from "../../types/content";

const BOOK_PAGE_SIZE = 6;

export default function ReviewCreatePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [rating, setRating] = useState(0);
  const [spoiler, setSpoiler] = useState(false);
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [genre, setGenre] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<BookSearchItem[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookSearchItem | null>(null);
  const [bookStartIndex, setBookStartIndex] = useState(0);
  const [bookNextStartIndex, setBookNextStartIndex] = useState<number | null>(
    null,
  );
  const [bookTotalItems, setBookTotalItems] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth?redirect=/reviews/new");
    }
  }, [isLoading, router, user]);

  if (isLoading || !user) {
    return (
      <div className="paper-texture min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 pb-16 pt-8 sm:px-8">
          <div className="rounded-[28px] border border-[var(--border)] bg-white/80 px-6 py-4 text-sm text-[var(--muted)] shadow-[var(--shadow)]">
            로그인 확인 중입니다.
          </div>
        </div>
      </div>
    );
  }

  const addTag = () => {
    const value = tagInput.trim();
    if (!value || tags.includes(value)) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, value]);
    setTagInput("");
  };

  const addHighlight = () => {
    const value = highlightInput.trim();
    if (!value || highlights.includes(value)) {
      setHighlightInput("");
      return;
    }
    setHighlights((prev) => [...prev, value]);
    setHighlightInput("");
  };

  const runBookSearch = async (query: string, startIndex: number) => {
    setIsSearching(true);
    setSearchError(null);
    try {
      const result = await searchBooks(query, {
        startIndex,
        size: BOOK_PAGE_SIZE,
      });
      setSearchResults(result.items);
      setBookStartIndex(startIndex);
      setBookNextStartIndex(result.nextStartIndex);
      setBookTotalItems(result.totalItems);
      if (result.items.length === 0) {
        setSearchError("검색 결과가 없습니다.");
      }
    } catch {
      setSearchResults([]);
      setBookNextStartIndex(null);
      setBookTotalItems(null);
      setSearchError("검색에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setSearchError("검색어를 입력해주세요.");
      return;
    }
    await runBookSearch(query, 0);
  };

  const handlePrevPage = () => {
    const query = searchQuery.trim();
    if (!query || bookStartIndex <= 0) {
      return;
    }
    const prevStartIndex = Math.max(0, bookStartIndex - BOOK_PAGE_SIZE);
    void runBookSearch(query, prevStartIndex);
  };

  const handleNextPage = () => {
    const query = searchQuery.trim();
    if (!query || bookNextStartIndex === null) {
      return;
    }
    void runBookSearch(query, bookNextStartIndex);
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }
    if (!selectedBook) {
      setSubmitError("리뷰할 책을 선택해주세요.");
      return;
    }
    if (!genre.trim()) {
      setSubmitError("장르를 입력해주세요.");
      return;
    }
    if (rating < 1) {
      setSubmitError("평점을 선택해주세요.");
      return;
    }
    if (summary.length > 200) {
      setSubmitError("한줄 요약은 200자 이내로 입력해주세요.");
      return;
    }
    if (content.length > 5000) {
      setSubmitError("리뷰 내용은 5000자 이내로 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await createReview(selectedBook, {
        rating,
        summary,
        content,
        visibility,
        genre: genre.trim(),
        keywords: tags,
        highlights,
      });
      router.push(`/reviews/${response.reviewId}`);
    } catch {
      setSubmitError("리뷰 등록에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="paper-texture min-h-screen">
      <div className="mx-auto max-w-4xl px-6 pb-16 pt-8 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Bookvoyage
              </p>
              <h1 className="font-serif text-2xl font-semibold">
                리뷰 작성
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <Link
              href="/"
              className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:-translate-y-0.5 hover:shadow-md"
            >
              피드로 돌아가기
            </Link>
            <AuthButtons />
          </div>
        </header>

        <main className="mt-10 space-y-6">
          <section className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[var(--shadow)]">
            <h2 className="font-serif text-2xl font-semibold">
              어떤 책에 대한 리뷰인가요?
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              책 제목이나 작가로 검색해 선택하세요.
            </p>
            <form className="mt-6 space-y-4" onSubmit={handleSearch}>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="책 제목, 작가, ISBN으로 검색"
                  className="w-full flex-1 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] sm:w-auto"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-md"
                  disabled={isSearching}
                >
                  {isSearching ? "검색 중" : "검색"}
                </button>
              </div>
            </form>

            {selectedBook ? (
              <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-white px-5 py-4">
                <p className="text-xs font-semibold text-[var(--muted)]">
                  선택한 책
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      {selectedBook.title}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {selectedBook.authors.join(", ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBook(null)}
                    className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-semibold text-[var(--muted)]"
                  >
                    선택 해제
                  </button>
                </div>
              </div>
            ) : null}

            {searchError ? (
              <p className="mt-4 text-sm text-rose-500">{searchError}</p>
            ) : null}

            {searchResults.length > 0 ? (
              <>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {searchResults.map((book) => (
                    <button
                      key={`${book.title}-${book.googleVolumeId ?? book.isbn13 ?? book.isbn10 ?? "book"}`}
                      type="button"
                      onClick={() => setSelectedBook(book)}
                      className="rounded-[20px] border border-[var(--border)] bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <p className="text-sm font-semibold text-[var(--ink)]">
                        {book.title}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        {book.authors.join(", ")}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {book.publisher ?? "출판사 정보 없음"}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-[var(--muted)]">
                  <span>
                    {bookTotalItems !== null
                      ? `${bookStartIndex + 1}-${bookStartIndex + searchResults.length} / ${bookTotalItems}`
                      : null}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handlePrevPage}
                      disabled={isSearching || bookStartIndex <= 0}
                      className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-semibold text-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      이전
                    </button>
                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={isSearching || bookNextStartIndex === null}
                      className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-semibold text-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      다음
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </section>

          <section className="rounded-[32px] border border-[var(--border)] bg-white/85 p-8 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold">리뷰 내용</h2>
              <span className="text-xs font-semibold text-[var(--muted)]">
                최대 2,000자
              </span>
            </div>
            <input
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="한 줄 요약을 입력하세요."
              className="mt-4 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
            />
            <div className="mt-4">
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="h-56 w-full resize-none rounded-[24px] border border-[var(--border)] bg-white/90 px-5 py-4 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                placeholder="책을 읽으며 느낀 감정과 생각을 적어보세요."
              />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                <p className="text-xs font-semibold text-[var(--muted)]">
                  별점 입력
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const value = index + 1;
                    return (
                      <button
                        key={`star-${value}`}
                        className={`text-xl transition ${
                          rating >= value ? "text-[var(--accent)]" : "text-[#d7c7b3]"
                        }`}
                        onClick={() => setRating(value)}
                        type="button"
                        aria-label={`${value}점`}
                      >
                        ★
                      </button>
                    );
                  })}
                  <span className="text-xs font-semibold text-[var(--muted)]">
                    {rating > 0 ? `${rating}.0` : "선택 없음"}
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                <p className="text-xs font-semibold text-[var(--muted)]">
                  스포일러 토글
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    className={`relative h-7 w-12 rounded-full transition ${
                      spoiler ? "bg-[var(--accent)]" : "bg-[#d7c7b3]"
                    }`}
                    onClick={() => setSpoiler((prev) => !prev)}
                    type="button"
                    aria-pressed={spoiler}
                    aria-label="스포일러 포함"
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                        spoiler ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-semibold text-[var(--muted)]">
                    {spoiler ? "스포일러 포함" : "스포일러 없음"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                <p className="text-xs font-semibold text-[var(--muted)]">
                  장르
                </p>
                <select
                  value={genre}
                  onChange={(event) => setGenre(event.target.value)}
                  className="mt-2 w-full rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                >
                  <option value="">장르 선택</option>
                  <option value="FICTION">문학 / 소설</option>
                  <option value="CLASSIC">고전문학</option>
                  <option value="POETRY">시</option>
                  <option value="ESSAY">에세이</option>
                  <option value="FANTASY">판타지</option>
                  <option value="SCIENCE_FICTION">SF</option>
                  <option value="MYSTERY">미스터리</option>
                  <option value="THRILLER">스릴러</option>
                  <option value="HORROR">호러</option>
                  <option value="ROMANCE">로맨스</option>
                  <option value="HISTORICAL_FICTION">역사소설</option>
                  <option value="PHILOSOPHY">철학</option>
                  <option value="PSYCHOLOGY">심리학</option>
                  <option value="SOCIOLOGY">사회학</option>
                  <option value="POLITICS">정치</option>
                  <option value="ECONOMICS">경제학</option>
                  <option value="HISTORY">역사</option>
                  <option value="SELF_HELP">자기계발</option>
                  <option value="BUSINESS">비즈니스</option>
                  <option value="LEADERSHIP">리더십</option>
                  <option value="CAREER">커리어</option>
                  <option value="FINANCE">재테크</option>
                  <option value="SCIENCE">과학</option>
                  <option value="TECHNOLOGY">기술 / 프로그래밍</option>
                  <option value="MATHEMATICS">수학</option>
                  <option value="MEDICINE">의학</option>
                  <option value="ART">예술</option>
                  <option value="MUSIC">음악</option>
                  <option value="CULTURE">문화</option>
                  <option value="TRAVEL">여행</option>
                  <option value="COOKING">요리</option>
                  <option value="HEALTH">건강</option>
                  <option value="RELIGION">종교</option>
                  <option value="EDUCATION">교육</option>
                  <option value="CHILDREN">아동</option>
                  <option value="POCKET">단행본 / 기타</option>
                </select>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                <p className="text-xs font-semibold text-[var(--muted)]">
                  공개 범위
                </p>
                <select
                  value={visibility}
                  onChange={(event) => setVisibility(event.target.value)}
                  className="mt-2 w-full rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                >
                  <option value="PUBLIC">전체 공개</option>
                  <option value="PRIVATE">비공개</option>
                </select>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-sm font-semibold text-[var(--muted)]">
                하이라이트
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  className="w-full rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                  placeholder="강조할 문장이나 핵심 포인트를 입력하고 Enter를 누르세요."
                  value={highlightInput}
                  onChange={(event) => setHighlightInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addHighlight();
                    }
                  }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
                {highlights.map((item) => (
                  <button
                    key={item}
                    className="rounded-full border border-[var(--border)] bg-white px-3 py-1 transition hover:border-transparent hover:bg-[var(--paper-strong)]"
                    onClick={() =>
                      setHighlights((prev) => prev.filter((tag) => tag !== item))
                    }
                    type="button"
                  >
                    {item} ×
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow)]">
            <h2 className="font-serif text-2xl font-semibold">태그</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              리뷰를 대표하는 태그를 직접 입력하세요.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <input
                className="w-full rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                placeholder="태그를 입력하고 Enter를 누르세요."
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                }}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
              {tags.map((tag) => (
                <button
                  key={tag}
                  className="rounded-full border border-[var(--border)] bg-white px-3 py-1 transition hover:border-transparent hover:bg-[var(--paper-strong)]"
                  onClick={() =>
                    setTags((prev) => prev.filter((item) => item !== tag))
                  }
                  type="button"
                >
                  #{tag} ×
                </button>
              ))}
            </div>
          </section>

          <section className="flex flex-wrap items-center justify-between gap-4">
            <button className="rounded-full border border-[var(--border)] bg-white px-5 py-2 text-sm font-semibold text-[var(--muted)]">
              임시 저장
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white shadow-md disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "게시 중" : "리뷰 게시하기"}
            </button>
          </section>
          {submitError ? (
            <p className="text-sm font-semibold text-rose-500">{submitError}</p>
          ) : null}
        </main>
      </div>
    </div>
  );
}
