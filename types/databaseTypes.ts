export interface DatabaseUser {
    id: string;
    email: string | null;
    name: string | null;
    surname: string | null;
    username: string | null;
    image: string | null;
    emailVerified: Date | null;
    languages: string[];
    registrationDate: Date | null;
    isAdmin: boolean | null;
    role: string | null;
    generatedCards: any[];
  }