import { returnLanguageWithLevels } from "@/scripts/client";

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
  const allComplete = choosedLanguages.every((item) => item.language && item.level);

  return (
    <div className="bg-base-200 border border-base-300 rounded-2xl p-8 shadow-xl w-full max-w-md animate-fade-in">
      <div className="space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Choose your languages</h1>
          <p className="text-base-content/50 text-sm">Select the languages you're learning</p>
        </div>

        <div className="space-y-3">
          {choosedLanguages.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <select
                value={item.language || ""}
                className="select select-bordered flex-1"
                onChange={(e) => languageChange(index, e.target.value)}
              >
                <option value="" disabled>Select language</option>
                {languagesList.map((lang, i) => (
                  <option key={i} value={lang}>{lang}</option>
                ))}
              </select>

              {item.language && (
                <select
                  value={item.level || ""}
                  className="select select-bordered flex-1"
                  onChange={(e) => levelChange(index, e.target.value)}
                >
                  <option value="" disabled>Level</option>
                  {returnLanguageWithLevels(item.language).map((lvl, i) => (
                    <option key={i} value={lvl}>{lvl}</option>
                  ))}
                </select>
              )}

              {item.language && item.level && (
                <button
                  className="btn btn-ghost btn-sm text-error hover:bg-error/10 rounded-xl"
                  onClick={() => removeLanguage(index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {allComplete && (
          <button
            onClick={addLanguage}
            className="btn btn-ghost btn-sm w-full border border-dashed border-base-300 rounded-xl hover:border-primary/50 hover:text-primary transition-colors duration-200"
          >
            + Add another language
          </button>
        )}

        <button
          onClick={pageIsReady}
          disabled={!allComplete}
          className="btn btn-primary w-full rounded-xl hover:-translate-y-0.5 transition-transform duration-200 disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
