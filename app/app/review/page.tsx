"use client";

import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import Loading from "@/components/procedures/Loading";
import GeneratingCardsComponent from "@/components/GeneratingCardComponent";
import { fetchGet } from "@/utils/utils";

export default function ReviewPage() {
  const [cards, setCards] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) return;
    
    fetchGet("/api/request-cards", {
      "X-User-Id": user.id,
    })
      .then((response) => {
        setCards(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="flex-1 flex flex-col">
      {cards && cards.length > 0 ? (
        <GeneratingCardsComponent cards={cards} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-base-content/40 animate-fade-in">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 opacity-30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-sm">No cards to review yet</p>
          <p className="text-xs">Generate some cards to start reviewing</p>
        </div>
      )}
    </div>
  );
}
