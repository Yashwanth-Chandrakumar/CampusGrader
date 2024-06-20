"use client"

import { SessionProvider } from "next-auth/react";
import { PlaceholdersAndVanishInputDemo } from "./titleinput";

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
    
    return (<div className="flex flex-col items-center min-h-screen py-2  bg-zinc-50 dark:bg-zinc-900 ">
      <div className="w-full max-w-4xl mt-32">
      <PlaceholdersAndVanishInputDemo/>
      </div>
      <div className="w-full max-w-4xl mt-10">
        <section className="mt-5 bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4">
          <h2 className="text-gray-800 dark:text-gray-200 py-2 font-bold">Top Colleges in Your Area</h2>
          <p className="text-gray-800 dark:text-gray-200">Content for top colleges in your area...</p>
        </section>
        <section className="mt-5 bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4">
          <h2 className="text-gray-800 dark:text-gray-200 py-2 font-bold">Most Viewed Colleges</h2>
          <p className="text-gray-800 dark:text-gray-200">Content for most viewed colleges...</p>
        </section>
      </div>
    </div>)
}

export default MainLand