import { connectMongoDB } from '@/lib/mongodb';
import College from '@/models/collegeSchema';
import User from '@/models/userSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { college: string } }) {
  try {
    await connectMongoDB();

    const body = await request.json();
    const {
      email,
      academicRating,
      academicReview,
      facultyRating,
      facultyReview,
      infrastructureRating,
      infrastructureReview,
      accommodationRating,
      accommodationReview,
      socialLifeRating,
      socialLifeReview,
      feeRating,
      feeReview,
      placementRating,
      placementReview,
      foodRating,
      foodReview,
    } = body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const newCollege = await College.create({
      name: params.college,
      userId: user._id,
      academicRating: Number(academicRating),
      academicReview,
      facultyRating: Number(facultyRating),
      facultyReview,
      infrastructureRating: Number(infrastructureRating),
      infrastructureReview,
      accommodationRating: Number(accommodationRating),
      accommodationReview,
      socialLifeRating: Number(socialLifeRating),
      socialLifeReview,
      feeRating: Number(feeRating),
      feeReview,
      placementRating: Number(placementRating),
      placementReview,
      foodRating: Number(foodRating),
      foodReview,
      verified: false,
    });

    return NextResponse.json(newCollege, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ message: 'Error creating review', error }, { status: 500 });
  }
}