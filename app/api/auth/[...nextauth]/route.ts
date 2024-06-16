import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/userSchema";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user) {
            throw new Error("User not found");
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            throw new Error("Incorrect password");
          }

          return user;
        } catch (error) {
          console.log("Error: ", error);
          throw error;
        }
      },
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
  ],
  callbacks:{
    async signIn({user,account}){
        console.log("User: ",user);
        console.log("Account: ",account);
        const {name,email} = user;
        if(account.provider==="google"){
            try {
                const res = await fetch('http://localhost:3000/auth/register/api/google',{
                    method:"POST",
                    headers:{
                        "Content-Type":"applications/json",
                    },
                    body:JSON.stringify({
                        name,email,
                    })
                })
                if (res.ok){
                    return user;
                }
            } catch (error) {
                console.log(error)
            }
        }
        return user;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
