"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

// Define the shape of your user data
interface IUser {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  collegeReviewId: {
    _id: string;
    name: string;
    userId: string;
    verified: boolean;
    idCardUploadId: string | null;
    academicRating: number;
    academicReview: string;
    facultyRating: number;
    facultyReview: string;
    infrastructureRating: number;
    infrastructureReview: string;
    accommodationRating: number;
    accommodationReview: string;
    socialLifeRating: number;
    socialLifeReview: string;
    feeRating: number;
    feeReview: string;
    placementRating: number;
    placementReview: string;
    foodRating: number;
    foodReview: string;
  } | null;
  imageUrl: string;
  verified: boolean;
  adminNotes: string;
}

const Admin = () => {
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [zoomStyles, setZoomStyles] = useState({});
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [showPopup, setShowPopup] = useState(false);

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

  const handleNameClick = (user: IUser) => {
    setSelectedUser(user);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedUser(null);
  };

  const handleAccept = async (collegeId: string) => {
    try {
      const response = await fetch('/api/updateverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collegeId, verified: true }),
      });

      if (response.ok) {
        setAllUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.collegeReviewId && user.collegeReviewId._id === collegeId
              ? {
                  ...user,
                  collegeReviewId: {
                    ...user.collegeReviewId,
                    verified: true,
                  },
                }
              : user
          )
        );
      } else {
        console.error('Failed to update verification');
      }
    } catch (error) {
      console.error('An error occurred while updating verification', error);
    }
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
              <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200 cursor-pointer" onClick={() => handleNameClick(item)}>{item.userId.name}</h1>
              <h2 className="text-md text-gray-600 dark:text-gray-400 cursor-pointer" onClick={() => handleNameClick(item)}>
                {item.collegeReviewId ? item.collegeReviewId.name : "No College Information"}
              </h2>
              <div className="flex mt-4">
                <button className="bg-green-500 text-white py-2 px-4 rounded-md mr-2" onClick={() => item.collegeReviewId && handleAccept(item.collegeReviewId._id)}>Accept</button>
                <button className="bg-red-500 text-white py-2 px-4 rounded-md">Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPopup && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-lg w-96 max-h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <p><strong>Name:</strong> {selectedUser.userId.name}</p>
            <p><strong>Email:</strong> {selectedUser.userId.email}</p>
            {selectedUser.collegeReviewId && (
              <>
                <h2 className="text-xl font-bold mt-4 mb-2">College Details</h2>
                <p><strong>College Name:</strong> {selectedUser.collegeReviewId.name}</p>
                <p><strong>Academic Rating:</strong> {selectedUser.collegeReviewId.academicRating}</p>
                <p><strong>Academic Review:</strong> {selectedUser.collegeReviewId.academicReview}</p>
                <p><strong>Faculty Rating:</strong> {selectedUser.collegeReviewId.facultyRating}</p>
                <p><strong>Faculty Review:</strong> {selectedUser.collegeReviewId.facultyReview}</p>
                <p><strong>Infrastructure Rating:</strong> {selectedUser.collegeReviewId.infrastructureRating}</p>
                <p><strong>Infrastructure Review:</strong> {selectedUser.collegeReviewId.infrastructureReview}</p>
                <p><strong>Accommodation Rating:</strong> {selectedUser.collegeReviewId.accommodationRating}</p>
                <p><strong>Accommodation Review:</strong> {selectedUser.collegeReviewId.accommodationReview}</p>
                <p><strong>Social Life Rating:</strong> {selectedUser.collegeReviewId.socialLifeRating}</p>
                <p><strong>Social Life Review:</strong> {selectedUser.collegeReviewId.socialLifeReview}</p>
                <p><strong>Fee Rating:</strong> {selectedUser.collegeReviewId.feeRating}</p>
                <p><strong>Fee Review:</strong> {selectedUser.collegeReviewId.feeReview}</p>
                <p><strong>Placement Rating:</strong> {selectedUser.collegeReviewId.placementRating}</p>
                <p><strong>Placement Review:</strong> {selectedUser.collegeReviewId.placementReview}</p>
                <p><strong>Food Rating:</strong> {selectedUser.collegeReviewId.foodRating}</p>
                <p><strong>Food Review:</strong> {selectedUser.collegeReviewId.foodReview}</p>
              </>
            )}
            <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md" onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
