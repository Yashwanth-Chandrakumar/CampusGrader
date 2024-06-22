import { connectMongoDB } from '@/lib/mongodb';
import College from '@/models/collegeSchema';
import User from '@/models/userSchema';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
export async function POST(req: any) {
  try {
    await connectMongoDB();

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
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!ObjectId.isValid(user._id)) {
      return NextResponse.json({ message: 'Invalid userId format' }, { status: 400 });
    }

    const newCollege = await College.create({
      name,
      userId: user._id,  // No need to create a new ObjectId
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