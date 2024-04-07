"use client";

import { TRPCError } from "@trpc/server";
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
  const [inputError,setInputError]=useState(false);
  const [inputData, setInputData] = useState<InputData>({
    email: '',
    password: '',
  });
  const [errorMessage,setErrorMessage]=useState("");
  
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
  const INPUT_ERROR_MESSAGE=(
    <div className="container">
      <div>Invalid credentials.</div>
      <div>- Invalid email or password.</div>
      <div>- Email should contain '@'.</div>
      <div>- Password must be atleast 8 characters long.</div>
    </div>
  );

  async function submitHandler(name:string,email:string,password:string){
    if(email==="" || email.length<4 || password==="" || password.length<8){
      setInputError(true);
      return;
    }
    setInputError(false);
    if(nameDisabled && inputError===false){
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
    setInputData({ ...inputData, email: email,password: password });
    const userLogin=await login.refetch();
    console.log(userLogin.data);
    if(userLogin.isSuccess){
      router.push("/categories-page");
    }else if(userLogin.isError){
      let err="Code:"+userLogin.error.data?.httpStatus+"; Message:"+userLogin.error.message;

      setErrorMessage(err?err:"");
    }
    // if(userLogin.data){
    //   console.log(typeof(userLogin.data));
    // }
    // if(typeof(userLogin.data)){
    //   if(userLogin.data){
    //     const result=userLogin.data;
    //     // console.log(result);
    //    // router.push("/categories-page");
    //   }
    // }
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
        type="email"
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
      <div>{inputError?INPUT_ERROR_MESSAGE:<div></div>}</div>
      <div>{errorMessage}</div>
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
