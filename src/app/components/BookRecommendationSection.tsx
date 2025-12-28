import Link from "next/link";
import BookRecommendationCarousel from "./BookRecommendationCarousel";
import { getBookRecommendationsServer } from "../services/recommendationServerService";

export default async function BookRecommendationSection() {
  const { response, status } = await getBookRecommendationsServer(12);
  const isSignedIn = status !== 401;

  return (
    <section className="fade-up-delay mt-12">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-serif text-2xl font-semibold">책 추천</h3>
        <Link
          href="/books/recommendations"
          className="text-sm font-semibold text-[var(--accent)]"
        >
          추천 전체 보기
        </Link>
      </div>
      <BookRecommendationCarousel
        items={response.items}
        isSignedIn={isSignedIn}
      />
    </section>
  );
}
