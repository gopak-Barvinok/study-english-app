import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string | null;
  }

  interface Session {
    user: User;
  }

  interface Theme {
    
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string | null;
    // name: string | null;
    // surname: string | null;
    // username: string | null;
    // image: string | null;
    // emailVerified: Date | null;
    // languages: string[];
    // roomIds: string[];
    // registrationDate: Date | null;
    // isAdmin: boolean | null;
  }
}