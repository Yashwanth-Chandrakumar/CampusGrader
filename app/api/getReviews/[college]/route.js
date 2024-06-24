import { connectMongoDB } from "@/lib/mongodb";
import College from "@/models/collegeSchema";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectMongoDB();
    const { college } = params;
    const reviews = await College.find({ name: college });
    console.log("reviews: ", reviews);
    return NextResponse.json({ reviews });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'An error occurred while fetching reviews.' }, { status: 500 });
  }
}
