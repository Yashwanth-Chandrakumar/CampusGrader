// app/api/updateverify/route.ts
import { connectMongoDB } from "@/lib/mongodb";
import College from "@/models/collegeSchema";
import IdCardUpload from "@/models/idSchema";
import { deleteFromS3 } from "@/utils/s3utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectMongoDB();
    const { collegeId, verified, idUploadId, imageUrl } = await request.json();

    // Update the verification status of the college
    await College.findByIdAndUpdate(collegeId, { verified });

    // Delete the entry from IdCardUpload
    await IdCardUpload.findByIdAndDelete(idUploadId);

    // Extract the S3 key from the image URL
    const key = imageUrl.split('/').pop();

    // Delete the image from S3
    await deleteFromS3(key);

    return NextResponse.json({ message: 'Verification updated and cleanup done successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while updating verification' }, { status: 500 });
  }
}
