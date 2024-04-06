"use client";

import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'
import { useState,useEffect } from "react";
import { api } from "~/trpc/react";
interface InputData {
  email: string;
  password: string;
}

export function LoginSignupPageComponent() {
  const router = useRouter();
  const pathName = usePathname();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameDisabled,setNameDisabled]= useState(true);
  const [inputData, setInputData] = useState<InputData>({
    email: '',
    password: '',
  });
  
  useEffect(()=>{
    if(pathName==="/signup-page"){
      setNameDisabled(false);
    }
    console.log(pathName);
  },[]);
  

  const createUser = api.auth.createUser.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      
      router.push('/verifyemail-page');
    },
  });

  async function submitHandler(name:string,email:string,password:string){
    if(nameDisabled){
      try{
        await loginHandler(email,password);
      }catch(error){
        console.log(error);
      } 
    }else{
      try{createUser.mutate({ name, email, password });}
      catch(error){
        console.log(error);
      } 
    }
    console.log(pathName);
  }
  async function loginHandler(email:string,password:string){
    if(email==="" || password===""){
      return;
    }
    setInputData({ ...inputData, email: email,password: password });
    const userLogin=await login.refetch();
    if(userLogin){
      if(userLogin.isSuccess){
        const result=userLogin.data;
        console.log(result);
        router.push("/categories-page");
      }
    }
  }
  const login = api.auth.login.useQuery(inputData);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        console.log("sdc");
        await submitHandler(name,email,password); 
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Name"
        value={name}
        hidden={nameDisabled}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="text"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createUser.isPending}
      >
        {createUser.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
