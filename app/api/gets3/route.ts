
import { connectMongoDB } from "@/lib/mongodb";
import IdCardUpload from "@/models/idSchema";
import User from "@/models/userSchema";
import College from "@/models/collegeSchema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    console.log("Connected to MongoDB");

    const idv = await IdCardUpload.find().populate('userId').populate('collegeReviewId');
    console.log("Fetched records: ", idv);

    if (idv.length === 0) {
      console.log("No records found in IdCardUpload collection");
    }

    // Create a response with disabled caching
    const response = NextResponse.json({ idv });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: 'An error occurred while fetching reviews.' }, { status: 500 });
  }
}
