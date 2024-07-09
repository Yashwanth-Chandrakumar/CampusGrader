import { s3 } from '@/lib/s3';
import { PutObjectCommand, PutObjectCommandOutput } from '@aws-sdk/client-s3';

const uploadFileToS3 = async (bucketName: string, key: string, body: Buffer, contentType: string): Promise<PutObjectCommandOutput> => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    console.log('Upload Success', data);
    return data;  // Return the response data
  } catch (err) {
    console.error('Error', err);
    throw err;  // Ensure any error is properly propagated
  }
};

export { uploadFileToS3 };
