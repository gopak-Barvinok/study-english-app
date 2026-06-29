import { signOut } from "next-auth/react";

export default function SignOutBtn() {
  return (
    <button
      className="btn btn-ghost btn-sm text-error hover:bg-error/10 rounded-xl transition-colors duration-200"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign out
    </button>
  );
}
