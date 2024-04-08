"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState, useMemo } from "react";
import { NextResponse, NextRequest } from 'next/server'

import { api } from "~/trpc/react";
interface CachedData {
  token:string;
  userID:string;
} 

export function CategoriesTable() {
  type Category = {
    id: number
    categoryName: string
    createdAt: Date
    updatedAt: Date
  }
  const router = useRouter();
  const [name, setName] = useState("");
  const [currentPage,setCurrentPage] = useState(1);
  const categories = api.category.getCategories.useQuery();
  const ITEMS_PER_PAGE=10;
  const totalNumberOfCategories = categories.data?.length;
  
  const [pageCategories, setPageCategories] = useState<(Category | undefined)[]>([]);
  const savedUserID = localStorage.getItem("userId")?.toString();
  const user = api.auth.getUserByID.useQuery({userID:savedUserID?savedUserID:""});
  const indexOfLastRecord = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstRecord = indexOfLastRecord - ITEMS_PER_PAGE;
  let userCategories:Category[];
  useEffect(()=>{
    // user.refetch();
    // if(!user.data?.name){
    //   router.push("/");
    //   router.refresh();
    //   return;
    // }
    if(!localStorage.getItem("userId") || !localStorage.getItem("token")){
      router.push("/");
      router.refresh();
      return;
    }
    // console.log(user.data?.name);

    // console.log(localStorage.getItem("userId"));
    // console.log(localStorage.getItem("token"));
  },[]);
  function prevBtnHandler(){
    if(currentPage===1){
        return;
    }else if(currentPage>1){
        setCurrentPage(currentPage-1);
    }
  }
  function nextBtnHandler(){
    if(totalNumberOfCategories){
        if(currentPage>=Math.ceil(totalNumberOfCategories/ITEMS_PER_PAGE)){
            return;
        }else if(currentPage<Math.ceil(totalNumberOfCategories/ITEMS_PER_PAGE)){
            setCurrentPage(currentPage+1);
        }
    }
    return;
  }
  function checkHandler(e:ChangeEvent<HTMLInputElement>){
    // let categoryID=e.target.value;
    // let user = 
    // console.log(categoryID);
  }
  // console.log(categories.data);
  return (
    <div className="container">
        {categories.data?.slice(indexOfFirstRecord, indexOfLastRecord).map((category, index) => (<div key={category.id}>
          <div className={"mb-[0.125rem] block min-h-[1.5rem] ps-[1.5rem]"}>
          <input
            className={"relative float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ms-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-checkbox checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ms-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent rtl:float-right dark:border-neutral-400 dark:checked:border-primary dark:checked:bg-primary"}
            type="checkbox"
            value={category?.id.toString()}
            onChange={(e)=>{checkHandler(e);}}
            id={category?.id.toString()} />
          <label
            className={"inline-block ps-[0.15rem] hover:cursor-pointer"}
            htmlFor={category?.id.toString()}>
            {category?.categoryName}
          </label>
        </div></div>
        ))}
        <div>Total Categories: {totalNumberOfCategories}</div>
        <div>Current Page: {currentPage}</div>
        <div>User Name: {user.data?.name}</div>
        <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"} onClick={prevBtnHandler}>Prev</button>
        <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"} onClick={nextBtnHandler}>Next</button>
    </div>
  );
}
