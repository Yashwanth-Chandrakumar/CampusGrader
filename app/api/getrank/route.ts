import { connectMongoDB } from "@/lib/mongodb";
import College from "@/models/collegeSchema";
import { NextResponse } from "next/server";

export async function GET(req:any) {
  try {
    await connectMongoDB();

    // Aggregate to count the number of reviews for each college and project the name
    const colleges = await College.aggregate([
      {
        $group: {
          _id: "$name",
          totalReviews: { $sum: 1 }
        }
      },
      {
        $sort: { totalReviews: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          totalReviews: 1
        }
      }
    ]);

    return NextResponse.json({ colleges });
  } catch (error) {
    console.error("Error fetching most reviewed colleges: ", error);
    return NextResponse.json({ error: 'An error occurred while fetching most reviewed colleges.' }, { status: 500 });
  }
}
