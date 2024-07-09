import { convertToStream } from '@/helpers/convertToStream';
import { connectMongoDB } from '@/lib/mongodb';
import { uploadFileToS3 } from '@/lib/uploadFiletoS3';
import College from '@/models/collegeSchema';
import IdCardUpload from '@/models/idSchema';
import User from '@/models/userSchema';
import formidable, { Fields, File, Files } from 'formidable';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';

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

export const POST = async (req: NextRequest) => {
  try {
    await connectMongoDB();

    const form = formidable();
    const stream = convertToStream(req);

    const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
      form.parse(stream, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

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
      return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
    }

    const user = await User.findOne({ email: formFields.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
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
        return NextResponse.json({ message: 'Error uploading to S3', uploadError }, { status: 500 });
      } finally {
        await fs.promises.unlink(file.filepath);
      }
    }

    return NextResponse.json(newCollege, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ message: 'Error creating review', error }, { status: 500 });
  }
};
