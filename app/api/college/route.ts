import { connectMongoDB } from '@/lib/mongodb';
import { s3 } from '@/lib/s3';
import College from '@/models/collegeSchema';
import IdCardUpload from '@/models/idSchema';
import User from '@/models/userSchema';
import formidable, { Fields, Files } from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

type FormFields = {
  name: string;
  email: string;
  academicRating: string;
  academicReview: string;
  facultyRating: string;
  facultyReview: string;
  infrastructureRating: string;
  infrastructureReview: string;
  accommodationRating: string;
  accommodationReview: string;
  socialLifeRating: string;
  socialLifeReview: string;
  feeRating: string;
  feeReview: string;
  placementRating: string;
  placementReview: string;
  foodRating: string;
  foodReview: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectMongoDB();

    const form = new formidable.IncomingForm();
    form.parse(req, async (err: any, fields: Fields, files: Files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ message: 'Error parsing form' });
      }

      // Ensure fields match FormFields structure
      const formFields: FormFields = {
        name: fields.name as string,
        email: fields.email as string,
        academicRating: fields.academicRating as string,
        academicReview: fields.academicReview as string,
        facultyRating: fields.facultyRating as string,
        facultyReview: fields.facultyReview as string,
        infrastructureRating: fields.infrastructureRating as string,
        infrastructureReview: fields.infrastructureReview as string,
        accommodationRating: fields.accommodationRating as string,
        accommodationReview: fields.accommodationReview as string,
        socialLifeRating: fields.socialLifeRating as string,
        socialLifeReview: fields.socialLifeReview as string,
        feeRating: fields.feeRating as string,
        feeReview: fields.feeReview as string,
        placementRating: fields.placementRating as string,
        placementReview: fields.placementReview as string,
        foodRating: fields.foodRating as string,
        foodReview: fields.foodReview as string,
      };

      // Basic validation
      if (!formFields.name || !formFields.email) {
        return res.status(400).json({ message: 'Name and email are required' });
      }

      const user = await User.findOne({ email: formFields.email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const newCollege = await College.create({
        name: formFields.name,
        userId: user._id,
        academicRating: Number(formFields.academicRating),
        academicReview: formFields.academicReview,
        facultyRating: Number(formFields.facultyRating),
        facultyReview: formFields.facultyReview,
        infrastructureRating: Number(formFields.infrastructureRating),
        infrastructureReview: formFields.infrastructureReview,
        accommodationRating: Number(formFields.accommodationRating),
        accommodationReview: formFields.accommodationReview,
        socialLifeRating: Number(formFields.socialLifeRating),
        socialLifeReview: formFields.socialLifeReview,
        feeRating: Number(formFields.feeRating),
        feeReview: formFields.feeReview,
        placementRating: Number(formFields.placementRating),
        placementReview: formFields.placementReview,
        foodRating: Number(formFields.foodRating),
        foodReview: formFields.foodReview,
        verified: false
      });

      if (files.idCard && Array.isArray(files.idCard) && files.idCard.length > 0) {
        const file = files.idCard[0];
        const fileContent = await fs.promises.readFile(file.filepath);

        try {
          const bucketName = process.env.AWS_S3_BUCKET_NAME;
          if (!bucketName) {
            throw new Error('AWS_S3_BUCKET_NAME is not defined');
          }

          const params = {
            Bucket: bucketName,
            Key: `id-cards/${newCollege._id}-${file.originalFilename}`,
            Body: fileContent,
            ContentType: file.mimetype || undefined,
          };

          const uploadResult = await s3.upload(params).promise();

          await IdCardUpload.create({
            userId: user._id,
            collegeReviewId: newCollege._id,
            imageUrl: uploadResult.Location,
          });
        } catch (uploadError) {
          console.error('Error uploading to S3:', uploadError);
          // You might want to delete the newCollege entry here if S3 upload fails
        } finally {
          // Clean up the temp file
          await fs.promises.unlink(file.filepath);
        }
      }

      res.status(201).json(newCollege);
    });
  } catch (error) {
    console.error('Error creating college:', error);
    res.status(500).json({ message: 'Error creating college', error });
  }
}
