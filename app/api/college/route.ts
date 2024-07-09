import { connectMongoDB } from '@/lib/mongodb';
import { s3 } from '@/lib/s3';
import College from '@/models/collegeSchema';
import IdCardUpload from '@/models/idSchema';
import User from '@/models/userSchema';
import formidable from 'formidable';
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
    form.parse(req, async (err, fields: FormFields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ message: 'Error parsing form' });
      }

      // Basic validation
      if (!fields.name || !fields.email) {
        return res.status(400).json({ message: 'Name and email are required' });
      }

      const user = await User.findOne({ email: fields.email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const newCollege = await College.create({
        name: fields.name,
        userId: user._id,
        academicRating: Number(fields.academicRating),
        academicReview: fields.academicReview,
        facultyRating: Number(fields.facultyRating),
        facultyReview: fields.facultyReview,
        infrastructureRating: Number(fields.infrastructureRating),
        infrastructureReview: fields.infrastructureReview,
        accommodationRating: Number(fields.accommodationRating),
        accommodationReview: fields.accommodationReview,
        socialLifeRating: Number(fields.socialLifeRating),
        socialLifeReview: fields.socialLifeReview,
        feeRating: Number(fields.feeRating),
        feeReview: fields.feeReview,
        placementRating: Number(fields.placementRating),
        placementReview: fields.placementReview,
        foodRating: Number(fields.foodRating),
        foodReview: fields.foodReview,
        verified: false
      });

      if (files.idCard && files.idCard[0]) {
        const file = files.idCard[0];
        const fileContent = await fs.promises.readFile(file.filepath);

        try {
          const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `id-cards/${newCollege._id}-${file.originalFilename}`,
            Body: fileContent,
            ContentType: file.mimetype,
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
    res.status(500).json({ message: 'Error creating college', error: error });
  }
}