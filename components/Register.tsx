"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";
import { IconBrandGoogle } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default  function SignupFormDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [showOtp,setShowOtp] = useState(false)
  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setShowOtp(false);
    setOtp("");
    setError("");
  };
  const router = useRouter();
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    if (!name || !email || !password) {
      setError("Please enter all fields");
    } else {
      setError(""); 
    }

    try {
        const exist = await fetch("/api/login",{
          method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),

        })

        const { user } = await exist.json();

      if (user) {
        setError("User already exists.");
        return;
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem("userDetails", JSON.stringify({ name, email, password}));
      localStorage.setItem("otp",otp.toString())
      setShowOtp(true)
    } catch (error) {
      console.log("Error during registeration", error);
    }
  };

  const verifyOtp = async() => {
        const storedOtp = localStorage.getItem("otp");
        if ( storedOtp && storedOtp === otp) {
            console.log("OTP verified successfully");
            try {
              const res = await fetch ("/api/register",{
                method: "POST",
                headers:{
                  "Content-Type":"application/json",
                },
                body:JSON.stringify({
                  name,email,password,
                }),
              });
              if(res.ok){
                resetForm();
                router.push("/auth/login");
              }
              else{
                console.log("User register failed")
              }
            } catch (error) {
              console.log("Error during registeration", error);
            }
            localStorage.removeItem("otp");
            localStorage.removeItem("userDetails");
            router.push("/auth/login");
        } else {
            setError("Invalid OTP, please try again.");
        }
    };

  
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to Campus Grader
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          No worries this is just a procedure you details are safe with us just like your internal marks.
        </p>

        <form className="my-8" onSubmit={handleSubmit}>

          {!showOtp ? (
                        <>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Tyler" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            </LabelInputContainer>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" placeholder="projectmayhem@fc.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </LabelInputContainer>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </LabelInputContainer>
                            <button type="submit" className="bg-gradient-to-br from-black to-neutral-600 w-full text-white rounded-md h-10">Sign up &rarr;</button>
                        </>
                    ) : (
                        <>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="otp">OTP</Label>
                                <Input id="otp" placeholder="Enter OTP" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
                            </LabelInputContainer>
                            <button onClick={verifyOtp} className="bg-gradient-to-br from-black to-neutral-600 w-full text-white rounded-md h-10">Verify OTP</button>
                        </>
                    )}
            {error && <p className="text-red-600 text-center text-m max-w-sm pt-4 dark:text-red-600">{error}</p>}

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <button
            onClick={()=>{signIn("google")}}
            type="button"
              className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
      
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                Google
              </span>
              <BottomGradient />
            </button>
          </div>
          <div className="bg-gradient-to-r  from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <p className="text-neutral-600 py-2 text-center text-sm max-w-sm pb-2 dark:text-neutral-300">
            Existing user
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            type="button"
            className="relative group/btn flex dark:text-white space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          >
            Sign in
            <BottomGradient />
          </button>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};