import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { LoginSignupPageComponent } from "~/app/_components/login-signup-component";
import { VerifyEmailPageComponent } from "~/app/_components/verify-email-component";
import { api } from "~/trpc/server";

export default async function VerifyEmailPage() {
  const hello = await api.post.hello({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Verify Email here!
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>
        </div>
        <VerifyEmailPageComponent/>
      </div>
    </main>
  );
}