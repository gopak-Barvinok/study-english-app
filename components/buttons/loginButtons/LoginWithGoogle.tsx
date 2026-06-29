"use client";

import { signIn } from "next-auth/react";

export default function LoginWithGoogle() {
  return (
    <button
      className="btn bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 rounded-full px-6 shadow-sm hover:-translate-y-0.5 transition-transform duration-200 font-medium"
      onClick={() => signIn("google")}
    >
      <svg
        aria-label="Google logo"
        width="18"
        height="18"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <g>
          <path d="m0 0H512V512H0" fill="#fff" />
          <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
          <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
          <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
          <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
        </g>
      </svg>
      Continue with Google
    </button>
  );
}
