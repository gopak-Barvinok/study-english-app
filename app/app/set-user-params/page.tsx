"use client";

import SetIsTeacherComponent from "@/components/SetIsTeacherComponent";
import SetLanguageComponent from "@/components/SetLanguageComponent";
import { useUserStore } from "@/store/userStore";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

enum PageState {
  SET_LANG_PAGE,
  SET_TEACHER_IS_READY_PAGE,
};

export default function SetUserParamsPage() {
  const [choosedLanguages, setChoosedLanguages] = useState<string[]>([]);
  const [choosedRole, setChoosedRole] = useState<string>("Student");
  const [pageState, setPageState] = useState<PageState>(PageState.SET_LANG_PAGE);
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  useEffect(() => {
    if (user?.languages && user.languages.length > 0 && user.role) {
      return redirect("/app");
    }
  }, [user]);

  const handleToggleLanguage = (language: string, checked: boolean) => {
    setChoosedLanguages((prev) => {
      if (checked) {
        return [...prev, language];
      } else {
        return prev.filter((l) => l !== language);
      }
    });
  };

  const handleToggleRole = (role: string) => {
    setChoosedRole(role);
  }

  const handleLanguagePage = () => {
    setPageState(PageState.SET_TEACHER_IS_READY_PAGE);
  }

  const handleRolePage = async () => {
    await updateUser({
      languages: choosedLanguages,
      role: choosedRole,
    });
  }

  return (
    <div>
      {pageState === PageState.SET_LANG_PAGE && (
        <SetLanguageComponent 
        pageIsReady={handleLanguagePage} 
        toggleLanguages={handleToggleLanguage}
        choosedLanguages={choosedLanguages}
        />
      )}
      {pageState === PageState.SET_TEACHER_IS_READY_PAGE && (
        <SetIsTeacherComponent 
        pageIsReady={handleRolePage}
        toggleRole={handleToggleRole}
        choosedRole={choosedRole}
        />
      )}
    </div>
  );
}
