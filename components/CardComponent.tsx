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
  isCorrect: boolean | null;
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
  isCorrect,
}: CardComponentProps) {
  return (
    <div className="bg-base-200 border border-base-300 rounded-2xl shadow-xl w-96 hover:-translate-y-1 transition-transform duration-300 animate-fade-in">
      <div className="p-8 flex flex-col items-center text-center gap-5">
        <h2 className="text-2xl font-bold text-base-content">{back}</h2>
        <p className="text-base-content/55 text-sm leading-relaxed">
          <span className="text-base-content/40 uppercase tracking-wider text-xs">Example</span>
          <br />
          {example}
        </p>
        {!accept ? (
          <input
            type="text"
            placeholder="Type the translation..."
            className="input input-bordered w-full focus:input-primary transition-colors duration-200"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <div className="space-y-1.5 py-1">
            <p className="font-semibold text-primary text-lg">{front}</p>
            <p className="text-base-content/55 text-sm">{translate}</p>
          </div>
        )}
        {accept && isCorrect !== null && (
          <div className={`text-sm font-medium ${isCorrect ? "text-success" : "text-error"}`}>
            {isCorrect ? "Correct!" : "Wrong"}
          </div>
        )}
        <div className="w-full">
          {!accept ? (
            <button
              className="btn btn-primary w-full rounded-xl hover:-translate-y-0.5 transition-transform duration-200"
              onClick={acceptCard}
            >
              Check
            </button>
          ) : (
            <button
              className="btn btn-primary w-full rounded-xl hover:-translate-y-0.5 transition-transform duration-200"
              onClick={reloadCard}
            >
              Next card →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
