import { useEffect, useState } from "react";

type CardComponentProps = {
  back: string;
  example: string;
  front: string;
  translate: string;
  reloadCard: () => void;
  accept: boolean;
  acceptCard: () => void;
  text: string;
  setText: (text: string) => void;
};

export default function CardComponent({
  back,
  example,
  front,
  translate,
  reloadCard,
  accept,
  acceptCard,
  text,
  setText,
}: CardComponentProps) {

  const handleSetText = (txt: string) => {
    setText(txt);
  };

  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <div className="card-body items-center text-center">
        <h2 className="card-title">{back}</h2>
        <p>Example: {example}</p>
        {!accept ? (
          <input
            type="text"
            placeholder="Front"
            className="input input-neutral rounded-md"
            value={text}
            onChange={(e) => handleSetText(e.target.value)}
          />
        ) : (
          <div>
            <p>Front: {front}</p>
            <p>Translate: {translate}</p>
          </div>
        )}
        <div className="card-actions">
          {!accept ? (
            <button className="btn btn-success" onClick={acceptCard}>
              Accept
            </button>
          ) : (
            <button className="btn btn-success" onClick={reloadCard}>
              Reload card
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
