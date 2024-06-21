"use client"

import { useParams } from 'next/navigation';

const Page = () => {
    const params = useParams();
    let college = '';
    
    if (typeof params.college === 'string') {
        college = decodeURIComponent(params.college);
    } else if (Array.isArray(params.college)) {
        college = decodeURIComponent(params.college[0]);
    }

    return (
        <div>{college}</div>
    )
}

export default Page;