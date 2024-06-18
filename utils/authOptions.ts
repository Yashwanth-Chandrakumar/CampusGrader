import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/userSchema";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
interface Credentials {
    email: string;
    password: string;
  }

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials as Credentials;

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
          console.log("Error manual login: ", error);
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider === "google") {
        try {
          const res = await fetch("http://localhost:3000/api/google", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: user.name, email: user.email }),
          });
          if (!res.ok) throw new Error('Failed to process the user data with Google account.');
          return true; // If the API handles the user correctly, we proceed.
        } catch (error) {
          console.error('SignIn error with Google provider:', error);
          return false; // Prevent login if there's an error.
        }
      }
      return true; // For other providers or credentials, proceed normally.
    },
    
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
};

