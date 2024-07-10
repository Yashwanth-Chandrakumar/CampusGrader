import IdCardUpload from '@/models/idSchema';
import User from '@/models/userSchema';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from './../../../utils/authOptions';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const collegeId = formData.get('collegeId') as string | null;

    if (!file || !collegeId) {
      return NextResponse.json({ message: 'File or college ID is missing' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileName = `${user._id}_${collegeId}_${Date.now()}.${file.type.split('/')[1]}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    const idCardUpload = await IdCardUpload.create({
      userId: user._id,
      collegeReviewId: collegeId,
      imageUrl: imageUrl,
    });

    return NextResponse.json({ message: 'Image uploaded successfully', imageUrl, idCardUploadId: idCardUpload._id }, { status: 200 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ message: 'Error uploading image', error }, { status: 500 });
  }
}
