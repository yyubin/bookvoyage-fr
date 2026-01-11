import Link from "next/link";
import { GOOGLE_OAUTH_URL } from "../services/authService";
import LogoMark from "../components/LogoMark";
import AuthLoginForm from "../components/AuthLoginForm";

export default function AuthPage() {
  return (
    <div className="paper-texture min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-16 pt-8 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Bookvoyage
              </p>
              <h1 className="font-serif text-2xl font-semibold">
                로그인 / 회원가입
              </h1>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:-translate-y-0.5 hover:shadow-md"
          >
            홈으로 돌아가기
          </Link>
        </header>

        <main className="mt-16 grid flex-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[var(--shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
              로그인
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold">
              책 이야기를 나누려면 로그인하세요.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              소셜 로그인 또는 이메일 로그인으로 시작할 수 있어요.
            </p>
            <div className="mt-8">
              <a
                href={GOOGLE_OAUTH_URL}
                className="flex w-full items-center justify-center gap-3 rounded-full border border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--paper-strong)] text-base">
                  G
                </span>
                Google로 계속하기
              </a>
            </div>
            <div className="mt-10 border-t border-[var(--border)] pt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--muted)]">
                이메일 로그인
              </p>
              <AuthLoginForm />
            </div>
            <p className="mt-4 text-xs text-[var(--muted)]">
              로그인 시 서비스 이용약관과 개인정보처리방침에 동의한 것으로
              간주됩니다.
            </p>
          </section>

          <aside className="rounded-[32px] border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow)]">
            <h3 className="font-serif text-2xl font-semibold">Bookvoyage란?</h3>
            <p className="mt-3 text-sm text-[var(--muted)]">
              리뷰와 추천이 자연스럽게 이어지는 책 커뮤니티. 좋아하는 문장과
              감정을 기록하고, 비슷한 취향의 사람들과 공유하세요.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                <p className="font-semibold text-[var(--ink)]">
                  감정 기반 피드
                </p>
                <p className="text-xs text-[var(--muted)]">
                  내 취향에 가까운 리뷰를 추천해요.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                <p className="font-semibold text-[var(--ink)]">리액션</p>
                <p className="text-xs text-[var(--muted)]">
                  이모지로 빠르게 공감하세요.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                <p className="font-semibold text-[var(--ink)]">서재 관리</p>
                <p className="text-xs text-[var(--muted)]">
                  읽고 있는 책을 모아볼 수 있어요.
                </p>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
