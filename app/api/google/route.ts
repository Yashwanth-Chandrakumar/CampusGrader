import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/userSchema";
import { NextResponse } from "next/server";

export async function POST(request:any) {
  const { name, email } = await request.json();

  await connectMongoDB();
  
  // Check if a user with the given email already exists
  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    // Update existing user record if necessary
    existingUser.name = name; // Update name or other fields as necessary
    existingUser.lastLogin = new Date(); // Update last login time
    await existingUser.save();
    return NextResponse.json({ message: "Existing user updated" }, { status: 200 });
  } else {
    // Create a new user only if no existing user is found
    const newUser = await User.create({ name, email });
    return NextResponse.json({ message: "New user created" }, { status: 201 });
  }
}
