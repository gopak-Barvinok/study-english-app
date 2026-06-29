import { useState } from "react";
import { useRouter } from "next/navigation";

type AfterCallLayoutProps = { teacherId?: string };

export default function AfterCallLayout({teacherId}: AfterCallLayoutProps) {
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState<string>();
  const router = useRouter();
  const ratings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  const handleSubmit = async () => {
    if(teacherId && rating > 0) {
      await fetch("/api/rate-lesson", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({teacherId, rating, comment: comments}),
      });
    }
    router.push("/app");
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm animate-fade-in">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold">Lesson complete!</h1>
        <p className="text-base-content/55 text-sm">How was your session?</p>
      </div>

      <div className="bg-base-200 border border-base-300 rounded-2xl p-6 w-full space-y-5 shadow-xl">
        <div className="space-y-3">
          <p className="text-sm font-medium text-base-content/70">Rate the teacher</p>
          <div className="rating rating-lg rating-half flex justify-center">
            {ratings.map((value, i) => (
              <input
                key={i}
                type="radio"
                name="rating-11"
                className={
                  value === 0
                    ? "rating-hidden"
                    : `mask mask-star-2 ${i % 2 === 1 ? "mask-half-1" : "mask-half-2"} bg-primary`
                }
                onChange={() => setRating(value)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-base-content/70">Leave a comment</p>
          <textarea
            placeholder="How did the lesson go?"
            className="textarea textarea-bordered w-full"
            rows={3}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
      </div>

      <button
        className="btn btn-primary w-full rounded-xl hover:-translate-y-0.5 transition-transform duration-200"
        onClick={handleSubmit}
      >
        Submit & Back to home
      </button>
    </div>
  );
}
