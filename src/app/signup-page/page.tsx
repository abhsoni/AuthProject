
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginSignupPageComponent } from "~/app/_components/login-signup-component";


export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Signup <span className="text-[hsl(280,100%,70%)]">Page</span>
        </h1>
        <p>Create your account</p>
        <p className="text-2xl text-white">
            Already registered! Click here to <Link href="/" className="text-[hsl(280,100%,70%)]">Login</Link> . 
          </p>
        <LoginSignupPageComponent />
      </div>
    </main>
  );
}
