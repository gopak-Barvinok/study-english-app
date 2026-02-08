"use client";

import { useUserStore } from "@/store/userStore";
import { Languages, User } from "@/types/user";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function LanguagePage() {
  const [isLanguages, setIsLanguages] = useState<Languages[]>();
  const [choosedLanguages, setChoosedLanguages] = useState<Languages[]>([]);
  const { data: session, update } = useSession();
  const { user } = useUserStore();

  if (user?.languages && user.languages.length > 0) {
    redirect("/");
  }

  const loadLanguages = async () => {
    const req = await fetch("/api/get-lang", {
      method: "GET",
      headers: {
        Accept: "application/json",
        
      },
    });

    const response = await req.json();
    return response;
  };

  const handleToggleLanguage = (language: Languages, checked: boolean) => {
    setChoosedLanguages((prev) => {
      if (checked) {
        return [...prev, language];
      } else {
        return prev.filter((l) => l !== language);
      }
    });
  };

  const handleAccept = async () => {
     if (!session?.user) return;

     await update({
      user: {
        ...session.user,
        languages: choosedLanguages,
      }
     });
  };

  const clickLang = () => {
    handleAccept();
  }

  useEffect(() => {
    loadLanguages().then((lang) => setIsLanguages(lang));
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
              onChange={(e) => handleToggleLanguage(lang, e.target.checked)}
            />
          </div>
        ))}
      </div>
      <button onClick={clickLang} className="btn btn-success">
        Accept
      </button>
    </div>
  );
}
