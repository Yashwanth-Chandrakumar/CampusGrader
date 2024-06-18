"use client"

import { SessionProvider, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

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
    const { data: session, status } = useSession();
    if(status==="unauthenticated"){
        redirect("/auth/login")
    }
    return (<>
    <div className="mt-5">
        Hello
    </div>
    </>)
}

export default MainLand