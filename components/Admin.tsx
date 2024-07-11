"use client"
import Image from "next/image";
import { useState } from "react";

const Admin = () => {
    const verfied = [
        {
            collegeName: "IIT Madras",
            userName: "John Doe",
            image: "https://campusgrader.s3.amazonaws.com/66717378d67bd2bfe68adce2_668e3bd980e13dcf1421656c_1720597468139.jpeg"
        },
        {
            collegeName: "IIT Delhi",
            userName: "Jane Smith",
            image: "https://campusgrader.s3.amazonaws.com/66717378d67bd2bfe68adce2_888888_1720595926030.jpeg"
        },
    ];

    const [zoomStyles, setZoomStyles] = useState({});

    const handleMouseMove = (e:any) => {
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
                {verfied.map((item, index) => (
                    <div key={index} className="flex flex-col md:flex-row items-center bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 mb-4">
                        <div 
                            className="relative w-32 h-32 md:w-48 md:h-48 mb-4 md:mb-0 overflow-hidden group" 
                            onMouseMove={handleMouseMove} 
                            onMouseLeave={handleMouseLeave}
                        >
                            <Image
                                src={item.image}
                                alt={item.userName}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-300 transform group-hover:scale-150"
                                style={zoomStyles}
                            />
                        </div>
                        <div className="flex flex-col md:ml-6">
                            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.userName}</h1>
                            <h2 className="text-md text-gray-600 dark:text-gray-400">{item.collegeName}</h2>
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
