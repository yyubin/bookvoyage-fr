"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReviewResponse } from "../../types/content";
import { deleteReview, updateReview } from "../../services/reviewWriteService";

type ReviewOwnerActionsProps = {
  review: ReviewResponse;
  ownerId: number | string;
};

const VISIBILITY_OPTIONS = [
  { value: "PUBLIC", label: "전체 공개" },
  { value: "PRIVATE", label: "비공개" },
] as const;

export default function ReviewOwnerActions({
  review,
  ownerId,
}: ReviewOwnerActionsProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState(review.summary ?? "");
  const [content, setContent] = useState(review.content ?? "");
  const [rating, setRating] = useState(review.rating ?? 0);
  const [visibility, setVisibility] = useState(review.visibility ?? "PUBLIC");
  const [genre, setGenre] = useState(review.genre ?? "");
  const [keywords, setKeywords] = useState<string[]>(review.keywords ?? []);
  const [highlights, setHighlights] = useState<string[]>(
    review.highlights ?? [],
  );
  const [keywordInput, setKeywordInput] = useState("");
  const [highlightInput, setHighlightInput] = useState("");

  const redirectUrl = useMemo(() => `/profile/${ownerId}/reviews`, [ownerId]);

  const addKeyword = () => {
    const value = keywordInput.trim();
    if (!value || keywords.includes(value)) {
      setKeywordInput("");
      return;
    }
    setKeywords((prev) => [...prev, value]);
    setKeywordInput("");
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

  const handleUpdate = async () => {
    if (isSubmitting) {
      return;
    }
    if (summary.length > 200) {
      setError("한줄 요약은 200자 이내로 입력해주세요.");
      return;
    }
    if (content.length > 5000) {
      setError("리뷰 내용은 5000자 이내로 입력해주세요.");
      return;
    }
    if (!genre.trim()) {
      setError("장르를 선택해주세요.");
      return;
    }
    if (rating < 1) {
      setError("평점을 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await updateReview(review.reviewId, {
        title: review.title,
        authors: review.authors,
        isbn10: review.isbn10,
        isbn13: review.isbn13,
        coverUrl: review.coverUrl,
        publisher: review.publisher,
        publishedDate: review.publishedDate,
        description: review.description,
        language: review.language,
        pageCount: review.pageCount,
        googleVolumeId: review.googleVolumeId,
        rating,
        summary,
        content,
        visibility,
        genre: genre.trim(),
        keywords,
        highlights,
      });
      setIsEditOpen(false);
      router.refresh();
    } catch {
      setError("리뷰 수정에 실패했어요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (isSubmitting) {
      return;
    }
    const confirmed = window.confirm("리뷰를 삭제할까요? 복구할 수 없어요.");
    if (!confirmed) {
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await deleteReview(review.reviewId);
      router.push(redirectUrl);
    } catch {
      setError("리뷰 삭제에 실패했어요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
      <button
        type="button"
        onClick={() => setIsEditOpen(true)}
        className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[var(--ink)]"
      >
        수정
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="rounded-full border border-rose-200 bg-white px-4 py-2 text-rose-500"
        disabled={isSubmitting}
      >
        삭제
      </button>

      {isEditOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsEditOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-[var(--shadow)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-serif text-2xl font-semibold">리뷰 수정</h3>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)]"
              >
                닫기
              </button>
            </div>

            <div className="mt-6 space-y-5 text-sm">
              <div>
                <p className="text-xs font-semibold text-[var(--muted)]">
                  한줄 요약
                </p>
                <input
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--muted)]">
                  리뷰 내용
                </p>
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  className="mt-2 h-40 w-full resize-none rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-[var(--muted)]">
                    평점
                  </p>
                  <select
                    value={rating}
                    onChange={(event) => setRating(Number(event.target.value))}
                    className="mt-2 w-full rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}점
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--muted)]">
                    공개 범위
                  </p>
                  <select
                    value={visibility}
                    onChange={(event) => setVisibility(event.target.value)}
                    className="mt-2 w-full rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                  >
                    {VISIBILITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--muted)]">
                    장르
                  </p>
                  <select
                    value={genre}
                    onChange={(event) => setGenre(event.target.value)}
                    className="mt-2 w-full rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[var(--ink)] outline-none focus:border-[var(--accent)]"
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
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--muted)]">
                  키워드
                </p>
                <input
                  value={keywordInput}
                  onChange={(event) => setKeywordInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addKeyword();
                    }
                  }}
                  className="mt-2 w-full rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                  placeholder="키워드를 입력하고 Enter"
                />
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
                  {keywords.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setKeywords((prev) => prev.filter((tag) => tag !== item))
                      }
                      className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[var(--accent)]"
                    >
                      #{item} ×
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--muted)]">
                  하이라이트
                </p>
                <input
                  value={highlightInput}
                  onChange={(event) => setHighlightInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addHighlight();
                    }
                  }}
                  className="mt-2 w-full rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                  placeholder="하이라이트를 입력하고 Enter"
                />
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
                  {highlights.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setHighlights((prev) =>
                          prev.filter((tag) => tag !== item),
                        )
                      }
                      className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[var(--accent)]"
                    >
                      {item} ×
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error ? (
              <p className="mt-4 text-sm font-semibold text-rose-500">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex justify-end gap-2 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[var(--ink)]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "저장 중" : "저장"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
