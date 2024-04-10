import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { LoginSignupPageComponent } from "~/app/_components/login-signup-component";
import { api } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "TRPC!" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Login <span className="text-[hsl(280,100%,70%)]">here</span> !
        </h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>
          <p className="text-2xl text-white">
            Account not created yet? Click here to <Link href="/signup-page" className="text-[hsl(280,100%,70%)]">Signup</Link> . 
          </p>
        </div>

        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const latestPost = await api.post.getLatest();

  return (
    <div className="w-full max-w-xs">
      <LoginSignupPageComponent/>
    </div>
  );
}
