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
  }
}