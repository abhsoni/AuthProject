"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CategoriesTable } from "~/app/_components/categories-table";


export default function CategoriesPage() {
    const router = useRouter();
    function logoutHandler(){
        if(typeof window !== 'undefined'){
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
        }
        router.push("/");
        router.refresh();
        return ;
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">

            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Select your <span className="text-[hsl(280,100%,70%)]">Categories.</span>
            </h1>
            <p className="text-2xl text-white">
                Click here to <button className="text-[hsl(280,100%,70%)]" onClick={logoutHandler}>Logout</button> . 
            </p>
            <CategoriesTable/>
        </div>
        </main>
    );
}
