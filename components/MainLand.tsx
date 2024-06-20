"use client"

import { cn } from "@/utils/cn";
import { SessionProvider } from "next-auth/react";

const MainLand = () => {

    
  return (
    <div>
        <SessionProvider>
            <Landingpage/>

        </SessionProvider>
        
    </div>
  )
}

const Landingpage = ()=>{
    
    return (<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100 ">
      <div className="w-full max-w-4xl">
      <form
      className={cn(
        "w-full relative max-w-xl mx-auto bg-white dark:bg-zinc-800 h-12 rounded-2xl overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200 bg-gray-50"
      )}
      
    >
      <input
        
        type="text"
        className={cn(
          "w-full relative text-sm sm:text-base z-40 border-none dark:text-white bg-transparent text-black h-full rounded-xl focus:outline-none focus:ring-0 pl-4 sm:pl-5 pr-16"
        )}
      />

    </form>
        {/* <input
          type="text"
          placeholder="Search for colleges..."
          className={cn(
            "w-full relative text-sm sm:text-base z-40 border-none dark:text-white bg-transparent text-black h-full rounded-xl focus:outline-none focus:ring-0 pl-4 sm:pl-5 pr-16"
          )}/> */}
      </div>
      <div className="w-full max-w-4xl mt-10">
        <section className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Top Colleges in Your Area</h2>
          <p>Content for top colleges in your area...</p>
        </section>
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Most Viewed Colleges</h2>
          <p>Content for most viewed colleges...</p>
        </section>
      </div>
    </div>)
}

export default MainLand