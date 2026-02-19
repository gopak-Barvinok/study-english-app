import { useEffect, useState } from "react";

type SetLanguageComponentProps = {
  pageIsReady: () => void;
  choosedLanguages: string[]
  toggleLanguages: (language: string, checked: boolean) => void;
};

export default function SetLanguageComponent({
  pageIsReady,
  choosedLanguages,
  toggleLanguages,
}: SetLanguageComponentProps) {
  const [isLanguages, setIsLanguages] = useState<string[]>();

  const handleAccept = () => {
    pageIsReady();
  };

  useEffect(() => {
    const languages = ["English", "Spanish", "French", "German"];
    setIsLanguages(languages);
  }, []);

  return (
    <div className="flex flex-col">
      <h1>What language do you want to learn?</h1>
      <div className="join join-vertical grid grid-cols-2 gap-y-2 mb-3 mt-3">
        {isLanguages?.map((lang) => (
          <div key={lang} className="join-item contents">
            <span className="text-lg">{lang}</span>
            <input
              type="checkbox"
              className="checkbox checkbox-success justify-self-end"
              checked={choosedLanguages.includes(lang)}
              onChange={(e) => toggleLanguages(lang, e.target.checked)}
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleAccept}
        className={`btn btn-success ${choosedLanguages.length > 0 ? "" : "btn-disabled"}`}
      >
        Accept
      </button>
    </div>
  );
}
