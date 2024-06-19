"use client"

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
    // const { data: session, status } = useSession();
    // if(status==="unauthenticated"){
    //     redirect("/auth/login")
    // }
    return (<>
     <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Search for colleges..."
          className="w-1/2 mx-auto block px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="w-full max-w-2xl mt-10">
        <section className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Top Colleges in Your Area</h2>
          <p>Content for top colleges in your area...</p>
        </section>
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Most Viewed Colleges</h2>
          <p>Content for most viewed colleges...</p>
        </section>
      </div>
    </div>
    </>)
}

export default MainLand