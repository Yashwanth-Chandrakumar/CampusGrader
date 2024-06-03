import Image from "next/image";
import AuroraBackgroundDemo from "../components/landpage"
import NavbarDemo from "@/components/navbar";
import { BentoGridThirdDemo } from "@/components/grid";
export default function Home() {
  return (
    <>
      <NavbarDemo/>
      <AuroraBackgroundDemo/>
      <BentoGridThirdDemo/>
      </>
  );
}
