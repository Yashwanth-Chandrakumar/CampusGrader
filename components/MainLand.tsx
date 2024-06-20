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
    
    return (<div className="flex flex-col items-center min-h-screen py-2 bg-gray-100 ">
      <div className="w-full max-w-4xl mt-40">
      <PlaceholdersAndVanishInputDemo navUrl="college"/>
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