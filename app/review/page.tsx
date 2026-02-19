"use client";

import { useUserStore } from "@/store/userStore";
import { useEffect, useState, useRef } from "react";
import Loading from "@/components/procedures/Loading";
import GeneratingCardsComponent from "@/components/GeneratingCardComponent";
import { fetchGet } from "@/utils/utils";

export default function ReviewPage() {
  const [cards, setCards] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchCards = async () => {
      
      if (!user?.generatedCards?.length) {
        setCards([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetchGet("/api/request-cards", {
          'X-User-Id': user.id,
        });
        setCards(prevCards => [
          ...(prevCards || []),
          ...response.generatedCards,
        ]);

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div>
      {cards && cards.length > 0 ? (
        <GeneratingCardsComponent cards={cards}/>
      ) : (
        <h1>No cards to review yet</h1>
      )}
    </div>
  );
}
