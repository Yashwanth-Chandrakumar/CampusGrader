import { authOptions } from './../../../utils/authOptions';
// Adjust this import based on where you've defined your NextAuth configuration
import IdCardUpload from '@/models/idSchema';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from 'next/server';

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

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const collegeId = formData.get('collegeId') as string | null;

    if (!file || !collegeId) {
      return NextResponse.json({ message: 'File or college ID is missing' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileName = `8_${collegeId}_${Date.now()}.${file.type.split('/')[1]}`;

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
      userId: '66717378d67bd2bfe68adce2',
      collegeReviewId: '667e67dc49958117b3d3e163',
      imageUrl: imageUrl,
    });

    return NextResponse.json({ message: 'Image uploaded successfully', imageUrl, idCardUploadId: idCardUpload._id }, { status: 200 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ message: 'Error uploading image', error }, { status: 500 });
  }
}