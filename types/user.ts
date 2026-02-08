export type User = {
    name: string;
    surname: string;
    username: string;
    languages: Languages[];
    userId: string;
    registrationDate: string;
    email: string;
    roomIds: string[];
}

export type LanguageMassive = {
    language: Languages;
    isNative: boolean;
}

export type Languages = "English" | "German" | "French" | "Spanish";

// export type Countries = "Ukraine" | "Great Britain" | "USA";