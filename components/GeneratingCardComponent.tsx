import { useEffect, useState } from "react";
import CardComponent from "./CardComponent";

type GeneratingCardsComponentProps = {
  cards: any[];
};

export default function GeneratingCardsComponent({
  cards,
}: GeneratingCardsComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    cards.length > 0 ? 0 : -1,
  );
  const [text, setText] = useState<string>("");
  const [accept, setAccept] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (cards.length > 0 && currentIndex === -1) setCurrentIndex(0);
  }, [cards, currentIndex]);

  const acceptCard = () => {
    const correct =
      text.trim().toLowerCase() ===
      cards[currentIndex].front?.trim().toLowerCase();
    setIsCorrect(correct);
    setAccept(true);
  };

  const reloadCard = () => {
    if (cards.length === 0) return;
    setAccept(false);
    setIsCorrect(null);
    setText("");
    setCurrentIndex((current) => (current + 1) % cards.length);
  };

  if (!cards || cards.length === 0 || currentIndex === -1) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-base-content/40 text-sm">
        {currentIndex + 1} / {cards.length}
      </div>
      <CardComponent
        back={cards[currentIndex].back}
        example={cards[currentIndex].example}
        front={cards[currentIndex].front}
        translate={cards[currentIndex].translation}
        reloadCard={reloadCard}
        accept={accept}
        acceptCard={acceptCard}
        text={text}
        setText={setText}
        isCorrect={isCorrect}
      />
    </div>
  );
}
