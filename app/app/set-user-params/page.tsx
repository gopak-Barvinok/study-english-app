"use client";

import SetAgeComponent from "@/components/SetAgeComponent";
import SetLanguageComponent from "@/components/SetLanguageComponent";
import SetLocationComponent from "@/components/SetLocationComponent";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

enum PageState {
  SET_LANG_PAGE,
  SET_AGE_PAGE,
  SET_LOCATION_PAGE,
}

export default function SetUserParamsPage() {
  const [choosedLanguages, setChoosedLanguages] = useState<
    { language: string; level: string }[]
  >([{ language: "", level: "" }]);
  const [choosedAge, setChoosedAge] = useState<string>();
  const [choosedLocation, setChoosedLocation] = useState<string>();
  const [choosedTimezone, setChoosedTimezone] = useState<string>();
  const [pageState, setPageState] = useState<PageState>(
    PageState.SET_LANG_PAGE,
  );
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const router = useRouter();

  useEffect(() => {
    if (
      user?.languages 
      && 
      user.languages.length > 0
      &&
      user.age
      &&
      user.location
      &&
      user.timezone
    ) {
      router.push("/app");
    }
  }, [user]);

  const handleLanguagePage = () => {
    setPageState(PageState.SET_AGE_PAGE);
  };

  const handleLanguageChange = (index: number, language: string) => {
    setChoosedLanguages((prev) =>
      prev.map((item, i) => (i === index ? { language, level: "" } : item)),
    );
  };

  const handleLevelChange = (index: number, level: string) => {
    setChoosedLanguages((prev) =>
      prev.map((item, i) => (i === index ? { ...item, level } : item)),
    );
  };

  const handleAddLanguage = () => {
    setChoosedLanguages((prev) => [...prev, { language: "", level: "" }]);
  };

  const handleRemoveLanguage = (index: number) => {
    setChoosedLanguages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleAge = (age: string) => {
    setChoosedAge(age);
  };

  const handleAgePage = () => {
    setPageState(PageState.SET_LOCATION_PAGE);
  };

  const handleToggleLocation = (location: string) => {
    setChoosedLocation(location);
  };

  const handleToggleTimezone = (timezoneOffset: string) => {
    setChoosedTimezone(timezoneOffset);
  };

  const handleLocationPage = async () => {
    await updateUser({
      languages: choosedLanguages,
      age: choosedAge,
      location: choosedLocation,
      timezone: choosedTimezone,
    });
  };

  useEffect(() => {
    if(choosedLanguages.length === 0) {
      handleAddLanguage();
    }
    console.log("State lang:", choosedLanguages);
  }, [choosedLanguages]);

  return (
    <div>
      {pageState === PageState.SET_LANG_PAGE && (
        <SetLanguageComponent
          pageIsReady={handleLanguagePage}
          languageChange={handleLanguageChange}
          levelChange={handleLevelChange}
          addLanguage={handleAddLanguage}
          removeLanguage={handleRemoveLanguage}
          choosedLanguages={choosedLanguages}
        />
      )}
      {pageState === PageState.SET_AGE_PAGE && (
        <SetAgeComponent
          toggleAge={handleToggleAge}
          pageIsReady={handleAgePage}
        />
      )}
      {pageState === PageState.SET_LOCATION_PAGE && (
        <SetLocationComponent
          pageIsReady={handleLocationPage}
          choosedCountry={choosedLocation ? choosedLocation : null}
          toggleLocation={handleToggleLocation}
          toggleTimezone={handleToggleTimezone}
        />
      )}
    </div>
  );
}
