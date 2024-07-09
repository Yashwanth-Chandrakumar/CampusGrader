import { connectMongoDB } from '@/lib/mongodb';
import { s3 } from '@/lib/s3';
import College from '@/models/collegeSchema';
import IdCardUpload from '@/models/idSchema';
import { NextResponse } from 'next/server';

async function deleteFromS3(imageUrl: string) {
  const key = imageUrl.split('/').pop(); // Extract the key from the URL
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName || !key) {
    throw new Error('Bucket name or key is undefined');
  }

  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
    console.log(`File deleted successfully: ${key}`);
  } catch (error) {
    console.error(`Error deleting file from S3: ${error}`);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    await connectMongoDB();

    const { idCardUploadId, verified, adminNotes } = await req.json();

    const idCardUpload = await IdCardUpload.findById(idCardUploadId);
    if (!idCardUpload) {
      return NextResponse.json({ message: 'ID card upload not found' }, { status: 404 });
    }

    idCardUpload.verified = verified;
    idCardUpload.adminNotes = adminNotes || '';
    await idCardUpload.save();

    // If verified, update the associated college review
    if (verified) {
      await College.findByIdAndUpdate(idCardUpload.collegeReviewId, { verified: true });
    }

    // Delete the ID card information after verification
    if (idCardUpload.imageUrl) {
      await deleteFromS3(idCardUpload.imageUrl);
    }
    await IdCardUpload.findByIdAndDelete(idCardUploadId);

    return NextResponse.json({ message: 'ID card verified and processed successfully' });
  } catch (error: unknown) {
    console.error('Error verifying ID card:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { message: 'Error verifying ID card', error: errorMessage },
      { status: 500 }
    );
  }
}
