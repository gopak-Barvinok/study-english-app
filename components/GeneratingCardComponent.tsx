import { useEffect, useState } from "react";
import CardComponent from "./CardComponent";

type GeneratingCardsComponentProps = {
  cards: any[];
};

export default function GeneratingCardsComponent({
  cards,
}: GeneratingCardsComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    return cards.length > 0 ? 0 : -1;
  });
  const [text, setText] = useState<string>("");
  const [accept, setAccept] = useState<boolean>(false);

  const acceptCard = () => {
    setAccept(true);
  };

  useEffect(() => {
    if (cards.length > 0 && currentIndex === -1) {
      setCurrentIndex(0);
    }
  }, [cards, currentIndex]);

  const reloadCard = () => {
    if (cards.length === 0) return;
    setAccept(false);
    setCurrentIndex((current) => (current + 1) % cards.length);
  };

  return (
    <div>
      {cards && (
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
        />
      )}
    </div>
  );
}
