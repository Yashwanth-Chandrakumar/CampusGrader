import NavbarDemo from "./navbar";
import Rating from "./rating/Rating";

const View = ({college}:{college:string;}) => {
  return (
    <div className="flex flex-col mt-32 text-black dark:text-white items-center min-h-screen py-2 bg-zinc-50 dark:bg-zinc-900 ">
        <NavbarDemo/>
        <div className="w-full max-w-7xl mt-10 p-10">
        <h1 className="text-2xl">{college}</h1>
        <Rating isEditable={false} rating={4} />
        </div>
    </div>
  )
}

export default View