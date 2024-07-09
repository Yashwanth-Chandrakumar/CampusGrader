import { s3 } from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const uploadFileToS3 = async (bucketName: string, key: string, body: Buffer, contentType: string): Promise<string> => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return s3Url;  // Construct the URL manually
  } catch (err) {
    console.error('Error', err);
    throw err;  // Ensure any error is properly propagated
  }
};

export { uploadFileToS3 };
