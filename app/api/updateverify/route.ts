// app/api/updateVerification/route.ts
import { connectMongoDB } from "@/lib/mongodb";
import College from "@/models/collegeSchema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectMongoDB();
    const { collegeId, verified } = await request.json();

    await College.findByIdAndUpdate(collegeId, { verified });

    return NextResponse.json({ message: 'Verification updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while updating verification' }, { status: 500 });
  }
}
