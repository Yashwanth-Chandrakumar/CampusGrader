import { connectMongoDB } from '@/lib/mongodb';
import College from '@/models/collegeSchema';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: any) {
  try {
    const {
      name, userId, 
      academicRating, academicReview,
      facultyRating, facultyReview,
      infrastructureRating, infrastructureReview,
      accommodationRating, accommodationReview,
      socialLifeRating, socialLifeReview,
      feeRating, feeReview,
      placementRating, placementReview,
      foodRating, foodReview
    } = await req.json();

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