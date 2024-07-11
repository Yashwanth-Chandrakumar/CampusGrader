// app/api/gets3/route.ts
import { connectMongoDB } from "@/lib/mongodb";
import College from "@/models/collegeSchema"; // Import the College model
import IdCardUpload from "@/models/idSchema";
import User from "@/models/userSchema"; // Import the User model
import { NextResponse } from "next/server";

// Ensure schemas are registered by performing a dummy operation
function registerSchemas() {
  User.findOne(); // Dummy operation to ensure the schema is registered
  College.findOne(); // Dummy operation to ensure the schema is registered
}

export async function GET() {
  try {
    await connectMongoDB();
    registerSchemas(); // Call the function to register schemas

    const idv = await IdCardUpload.find().populate('userId').populate('collegeReviewId');
    console.log("verify: ", idv);
    return NextResponse.json({ idv });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'An error occurred while fetching reviews.' }, { status: 500 });
  }
}
