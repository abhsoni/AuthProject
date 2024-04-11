"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState, useMemo } from "react";
import { NextResponse, NextRequest } from 'next/server'
import { useQuery } from '@tanstack/react-query'


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
  const [categories, setCategories] = useState([]);
  const [userSelectedCategories, setUserSelectedCategories] = useState<number[]>([]);
  const fetchCategories = api.category.getCategories.useQuery();
  const ITEMS_PER_PAGE=10;
  const totalNumberOfCategories = fetchCategories.data?.length;
  
  const [pageCategories, setPageCategories] = useState<(Category | undefined)[]>([]);
  const savedUserID ="23";
  const user = api.auth.getUserByID.useQuery({userID:savedUserID?savedUserID:""});
  
  const userCat = api.auth.updateUserCategories.useMutation({
    onSuccess: async () => {
      console.log("success");
      
      await user.refetch();
      
      if (user.data && ("categories" in user.data)) {
        setUserSelectedCategories(user.data.categories);
      }
      // setUserSelectedCategories();
      // router.push('/verifyemail-page');
    },
  });
  const indexOfLastRecord = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstRecord = indexOfLastRecord - ITEMS_PER_PAGE;
  useEffect( ()=>{
    // user.refetch();
    // if(!user.data?.name){
    //   router.push("/");
    //   router.refresh();
    //   return;
    // }
    
    
    // if(typeof window !== 'undefined'){
    //   if(!localStorage.getItem("userId") || !localStorage.getItem("token")){
    //     router.push("/");
    //     router.refresh();
    //     return;
    //   }
    // }
    if (user.data && ("categories" in user.data)) {
      setUserSelectedCategories(user.data.categories);
    }
    console.log(JSON.stringify(user.data));
  },[user.data, router]);
  
    
  
  function prevBtnHandler(){
    if(currentPage===1){
        return;
    }else if(currentPage>1){
        setCurrentPage(currentPage-1);
    }
  }
  console.log(JSON.stringify(user.data));
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
  const result = api.auth.deleteAllUser.useMutation({
    onSuccess: () => {
      console.log("user deleted!");
    },
  });
  function checkHandler(e:ChangeEvent<HTMLInputElement>){
    // result.mutate();
    // const categoryID=parseInt(e.target.value);
    
    
    console.log(e.target.value);
    const userID="23";
    if(userID){
      userCat.mutate({userID,categoryId:parseInt(e.target.value)});
    }
    console.log(JSON.stringify(user.data));
    // console.log(selectedCategory);
    
    // console.log(categoryID);
  }
  
  function categoryCheckHandler(){
    return true;
    
  }
  
  return (
    <div className="container">
        {fetchCategories.data?.slice(indexOfFirstRecord, indexOfLastRecord).map((category, index) => (<div key={category.id}>
          <div className={"mb-[0.125rem] block min-h-[1.5rem] ps-[1.5rem]"}>
          <input
            className={"relative float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ms-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-checkbox checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ms-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent rtl:float-right dark:border-neutral-400 dark:checked:border-primary dark:checked:bg-primary"}
            type="checkbox"
            value={category?.id.toString()}
            onChange={(e)=>{checkHandler(e);}}
            checked={userSelectedCategories.includes(category.id)}
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
        <div>User Selected Categories: {userSelectedCategories.length}</div>
        <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"} onClick={prevBtnHandler}>Prev</button>
        <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"} onClick={nextBtnHandler}>Next</button>
    </div>
  );
}
