import { connectMongoDB } from '@/lib/mongodb'; // Adjust the path as needed
import College from '@/models/collegeSchema'; // Adjust the path as needed
import { ObjectId } from 'mongodb'; // Import ObjectId from mongodb
import { NextResponse } from 'next/server';

export async function POST(req:any) {
  try {
    const { name, userId, academic, faculty, infrastructure, accommodation, socialLife, fee, placement, food } = await req.json();

    // Validate and convert userId to ObjectId
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid userId format' }, { status: 400 });
    }
    const objectId = new ObjectId(userId);

    await connectMongoDB();
    const newCollege = await College.create({
      name,
      userId: objectId,
      academic,
      faculty,
      infrastructure,
      accommodation,
      socialLife,
      fee,
      placement,
      food
    });

    return NextResponse.json(newCollege, { status: 201 });
  } catch (error) {
    console.error('Error creating college:', error); // Enhanced error logging
    return NextResponse.json(
      { message: 'Error creating college', error: error },
      { status: 500 }
    );
  }
}
