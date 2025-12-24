export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted)]">
      <div className="mx-auto max-w-6xl px-6 pb-10 sm:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-serif text-lg font-semibold text-[var(--ink)]">
              Bookvoyage
            </p>
            <p className="mt-2 max-w-md">
              책과 사람, 리뷰와 추천이 부드럽게 흐르는 독서 커뮤니티.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-semibold">
            <button className="transition hover:text-[var(--ink)]">
              서비스 소개
            </button>
            <button className="transition hover:text-[var(--ink)]">
              이용약관
            </button>
            <button className="transition hover:text-[var(--ink)]">
              개인정보처리방침
            </button>
            <button className="transition hover:text-[var(--ink)]">
              고객센터
            </button>
            <button className="transition hover:text-[var(--ink)]">
              문의하기
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          <p>© 2024 Bookvoyage. All rights reserved.</p>
          <div className="flex gap-3">
            <span>Instagram</span>
            <span>Twitter</span>
            <span>Newsletter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
