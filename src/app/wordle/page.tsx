import Link from "next/link";
import WordleGrid from "~/app/_components/wordle-grid";
import { api } from "~/trpc/server";

export default async function Wordle() {
  const hello = await api.post.hello({ text: "from tRPC" });

  return (
    <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex justify-between pt-2 items-center px-8">
            <div className="w-11"></div>
            <div className="text-5xl font-bold">WORDLE</div>
            <Link href="/" className="text-base font-normal w-11">Login</Link>
        </div>
        <main className="flex min-h-screen flex-col items-center justify-center ">   
            <div className="container flex flex-col items-center justify-center gap-12 px-4 pb-4 ">
                <WordleGrid/>
            </div>
        </main>
    </div>
  );
}