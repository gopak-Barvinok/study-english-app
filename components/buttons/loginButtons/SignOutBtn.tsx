import { signOut } from "next-auth/react"

export default function SignOutBtn() {
    return <button className="btn btn-error w-30" onClick={() => signOut({callbackUrl: "/"})}>Sign out</button>
}