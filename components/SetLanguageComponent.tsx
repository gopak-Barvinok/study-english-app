import { returnLanguageWithLevels } from "@/scripts/client";
import { useEffect, useState } from "react";

type SetLanguageComponentProps = {
  pageIsReady: () => void;
  choosedLanguages: { language: string; level: string }[];
  languageChange: (index: number, language: string) => void;
  levelChange: (index: number, level: string) => void;
  addLanguage: () => void;
  removeLanguage: (index: number) => void;
};

export default function SetLanguageComponent({
  pageIsReady,
  choosedLanguages,
  languageChange,
  levelChange,
  addLanguage,
  removeLanguage,
}: SetLanguageComponentProps) {
   const languagesList = ["English", "Spanish", "French", "German"];

  const handleAccept = () => {
    pageIsReady();
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="flex justify-center">Choose your languages</h1>
      {choosedLanguages?.map((item, index) => (
          <div key={index} className="flex flex-row gap-4">
            <select
              value={item.language || ""}
              className="select select-neutral"
              onChange={(e) => languageChange(index, e.target.value)}
            >
              <option value="" disabled={true}>Select a language</option>
              {languagesList?.map((lang, i) => (
                  <option key={i} value={lang}>
                    {lang}
                  </option>
                ))}
            </select>
            {item.language && (
              <select
                value={item.level || ""}
                className="select select-neutral"
                onChange={(e) => levelChange(index, e.target.value)}
              >
                <option value="" disabled={true}>Select a level</option>
                {returnLanguageWithLevels(item.language).map((lvl, i) => (
                  <option key={i} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            )}
            {choosedLanguages[index].language &&
              choosedLanguages[index].level 
              &&
              (
                <button
                  className="btn btn-error"
                  onClick={() => removeLanguage(index)}
                >
                  X
                </button>
              )}
          </div>
        ))}
      {choosedLanguages.every((item) => item.language && item.level) && (
        <button onClick={addLanguage} className="btn btn-success">
          Add new language
        </button>
      )}
      <button
        onClick={handleAccept}
        className={`btn btn-success ${
          choosedLanguages.every((item) => item.language && item.level)
            ? ""
            : "btn-disabled"
        }`}
      >
        Accept
      </button>
    </div>
  );
}
