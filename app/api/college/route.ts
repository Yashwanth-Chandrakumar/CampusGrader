import { connectMongoDB } from '@/lib/mongodb';
import College from '@/models/collegeSchema';
import User from '@/models/userSchema';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: any) {
  try {
    const {
      name, email, 
      academicRating, academicReview,
      facultyRating, facultyReview,
      infrastructureRating, infrastructureReview,
      accommodationRating, accommodationReview,
      socialLifeRating, socialLifeReview,
      feeRating, feeReview,
      placementRating, placementReview,
      foodRating, foodReview
    } = await req.json();

    const user = await User.findOne({email});
    const userId = user._id;
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid userId format' }, { status: 400 });
    }
    const objectId = new ObjectId(userId);

    await connectMongoDB();
    const newCollege = await College.create({
      name,
      userId: objectId,
      academicRating, academicReview,
      facultyRating, facultyReview,
      infrastructureRating, infrastructureReview,
      accommodationRating, accommodationReview,
      socialLifeRating, socialLifeReview,
      feeRating, feeReview,
      placementRating, placementReview,
      foodRating, foodReview
    });

    return NextResponse.json(newCollege, { status: 201 });
  } catch (error) {
    console.error('Error creating college:', error);
    return NextResponse.json(
      { message: 'Error creating college', error: error },
      { status: 500 }
    );
  }
}