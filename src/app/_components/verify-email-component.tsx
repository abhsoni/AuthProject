"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { NextResponse, NextRequest } from 'next/server';


import { api } from "~/trpc/react";

export function VerifyEmailPageComponent() {
  const router = useRouter();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const createUser = api.auth.createUser.useMutation({
//     onSuccess: () => {
//       router.refresh();
//       setName("");
//     },
//   });
    const [code, setCode] = useState("");
    // const verifyCode = api.user.createCategory.useMutation({
    //     onSuccess: () => {
    //       router.refresh();
    //       setCode("");
    //     },
    // });
    const verifyCodeFunction = api.auth.verifyCode.useMutation({
        onSuccess: () => {
          router.refresh();
          router.push("/");
          setCode("");
        },
      });
    function verifyCode(code:string){
      verifyCodeFunction.mutate({code});
    }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        verifyCode(code);
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Enter Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={false}
      >
        {false ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
