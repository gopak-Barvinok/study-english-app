import { getRandomNonZeroIndex } from "@/scripts/client";
import { useEffect, useState } from "react";
import AsyncButton from "./buttons/AsyncBtn";

type GeneratingCardsComponentProps = {
  cards: any[];
}

export default function GeneratingCardsComponent({
  cards
}: GeneratingCardsComponentProps) {
  const [randomIndex, setRandomIndex] = useState<number>();

  const reloadCard = async () => {
    const rndInd = await getRandomNonZeroIndex(cards.length) as number;
    setRandomIndex(rndInd);
  }

  useEffect(() => {
    reloadCard();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div>
        {randomIndex && (
          <div>
            <p>Back: {cards[randomIndex].back}</p>
            <p>Example: {cards[randomIndex].example}</p>
            <p>Front: {cards[randomIndex].front}</p>
            <p>Translation: {cards[randomIndex].translation}</p>
          </div>
        )}
      </div>
      {/* <button className="btn btn-success" onClick={reloadCard}>Reload card</button> */}
      <AsyncButton
      func={reloadCard}
      isLoadingText="Loading"
      isNormalText="Reload card"
      className="btn btn-success"
      />
    </div>
  );
}
