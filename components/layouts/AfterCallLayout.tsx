import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AfterCallLayout() {
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState<string>();
  const router = useRouter();
  const ratings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  const handleSetRating = (value: number) => {
    setRating(value);
  }

  const handleSetComments = (comments: string) => {
    setComments(comments);
  }

  const handlePushingToMainPage = () => {
    router.push("/app");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1>The call ended</h1>
      <div className="flex flex-col gap-2">
        <h1>Rate the teacher</h1>
        <div className="rating rating-lg rating-half">
          {ratings.map((value, i) => (
            <input
              key={i}
              type="radio"
              name="rating-11"
              className={`${value === 0 ? "rating-hidden" : `mask mask-star-2 ${i % 2 === 1 ? "mask-half-1" : "mask-half-2"} bg-green-500`}`}
              onChange={() => handleSetRating(value)}
            />
          ))}
        </div>
        <textarea
          placeholder="Leave a comment"
          className="textarea textarea-info"
          onChange={(e) => handleSetComments(e.target.value)}
        />
      </div>
      <button
        className="btn btn-error"
        onClick={() => handlePushingToMainPage()}
      >
        Return to Main page
      </button>
    </div>
  );
}
