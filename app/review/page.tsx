"use client";

import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import Loading from "@/components/procedures/Loading";

export default function ReviewPage() {
  const [words, setWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchWords = async () => {
      if (!user?.roomIds?.length) {
        setWords([]);
        setLoading(false);
        return;
      }

      try {
        const allWords: string[] = [];
        
        for (const roomId of user.roomIds) {
          const res = await fetch("/api/get-learned-words", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomId }),
          });
          
          if (res.ok) {
            const data = await res.json();
            console.log("Data:", data);
            const roomWords = Array.isArray(data) ? data : JSON.parse(data || '[]');
            allWords.push(...roomWords);
          }
        }
        console.log("Words:", words);
        setWords(allWords);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div>
      {words.length > 0 ? (
        <div>{words.join(" ")}</div>
      ) : (
        <h1>No words to review yet</h1>
      )}
    </div>
  );
}