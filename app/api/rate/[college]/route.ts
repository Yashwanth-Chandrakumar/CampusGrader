import { connectMongoDB } from '@/lib/mongodb';
import { uploadFileToS3 } from '@/lib/uploadFiletoS3';
import College from '@/models/collegeSchema';
import IdCardUpload from '@/models/idSchema';
import User from '@/models/userSchema';
import formidable, { Fields, File, Files } from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const getFieldAsString = (field: string | string[] | undefined): string => {
  if (Array.isArray(field)) {
    return field[0];
  }
  return field || '';
};

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
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

      const formFields = {
        name: getFieldAsString(fields.name),
        email: getFieldAsString(fields.email),
        academicRating: getFieldAsString(fields.academicRating),
        academicReview: getFieldAsString(fields.academicReview),
        facultyRating: getFieldAsString(fields.facultyRating),
        facultyReview: getFieldAsString(fields.facultyReview),
        infrastructureRating: getFieldAsString(fields.infrastructureRating),
        infrastructureReview: getFieldAsString(fields.infrastructureReview),
        accommodationRating: getFieldAsString(fields.accommodationRating),
        accommodationReview: getFieldAsString(fields.accommodationReview),
        socialLifeRating: getFieldAsString(fields.socialLifeRating),
        socialLifeReview: getFieldAsString(fields.socialLifeReview),
        feeRating: getFieldAsString(fields.feeRating),
        feeReview: getFieldAsString(fields.feeReview),
        placementRating: getFieldAsString(fields.placementRating),
        placementReview: getFieldAsString(fields.placementReview),
        foodRating: getFieldAsString(fields.foodRating),
        foodReview: getFieldAsString(fields.foodReview),
      };

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
        verified: false,
      });

      if (files.idCard && Array.isArray(files.idCard) && files.idCard.length > 0) {
        const file = files.idCard[0] as File;
        const fileContent = await fs.promises.readFile(file.filepath);

        try {
          const uploadResult = await uploadFileToS3(
            process.env.AWS_S3_BUCKET_NAME!,
            `id-cards/${newCollege._id}-${file.originalFilename}`,
            fileContent,
            file.mimetype || 'application/octet-stream'
          );

          await IdCardUpload.create({
            userId: user._id,
            collegeReviewId: newCollege._id,
            imageUrl: uploadResult.Location,
          });
        } catch (uploadError) {
          console.error('Error uploading to S3:', uploadError);
          await College.findByIdAndDelete(newCollege._id);
          return res.status(500).json({ message: 'Error uploading to S3', uploadError });
        } finally {
          await fs.promises.unlink(file.filepath);
        }
      }

      res.status(201).json(newCollege);
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review', error });
  }
};
