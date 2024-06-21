import { connectMongoDB } from '@/lib/mongodb'; // Adjust the path as needed
import College from '@/models/collegeSchema'; // Adjust the path as needed
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongoDB();

  if (req.method === 'POST') {
    const { name, userId, academic, faculty, infrastructure, accommodation, socialLife, fee, placement, food } = req.body;

    try {
      const newCollege = new College({ name, userId, academic, faculty, infrastructure, accommodation, socialLife, fee, placement, food });
      await newCollege.save();
      res.status(201).json(newCollege);
    } catch (error) {
      res.status(400).json({ message: 'Error creating college', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
