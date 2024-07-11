"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

// Define the shape of your user data
interface IUser {
  _id: string;
  userId: {
    name: string;
  };
  collegeReviewId: {
    name: string;
  };
  imageUrl: string;
  verified: boolean;
  adminNotes: string;
}

const Admin = () => {
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [zoomStyles, setZoomStyles] = useState({});

  useEffect(() => {
    const fetchAllUsers = async () => {
      const response = await fetch(`/api/gets3`);
      const data = await response.json();
      setAllUsers(data.idv);
    };

    fetchAllUsers();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyles({
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyles({});
  };

  return (
        <div className='flex flex-col items-center min-h-screen py-2 bg-zinc-50 dark:bg-zinc-900'>
          <div className='w-full max-w-4xl mt-32'>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6'>Welcome Admin</h1>
            {allUsers.map((item) => (
              <div key={item._id} className="flex flex-col md:flex-row items-center bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 mb-4">
                <div 
                  className="relative w-32 h-32 md:w-48 md:h-48 mb-4 md:mb-0 overflow-hidden group" 
                  onMouseMove={handleMouseMove} 
                  onMouseLeave={handleMouseLeave}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.userId.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 transform group-hover:scale-150"
                    style={zoomStyles}
                  />
                </div>
                <div className="flex flex-col md:ml-6">
                  <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.userId.name}</h1>
                  <h2 className="text-md text-gray-600 dark:text-gray-400">{item.collegeReviewId.name}</h2>
                  <div className="flex mt-4">
                    <button className="bg-green-500 text-white py-2 px-4 rounded-md mr-2">Accept</button>
                    <button className="bg-red-500 text-white py-2 px-4 rounded-md">Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
};

export default Admin;
