import { useParams } from 'next/navigation';

const page = () => {

    const param = useParams()
    const college = param.college;
  return (
    <div>{college}</div>
  )
}

export default page