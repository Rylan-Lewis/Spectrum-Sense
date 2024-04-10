'use client'
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center w-full absolute">
      <div className="flex items-center gap-2">
        <Image
          className="dark:invert size-[32]"
          src={"/favicon.svg"}
          alt="logo"
          width={48}
          height={48}
        />
      <Link href={'/'}><h1 className="font-light text-sm md:text-xl">Spectrum Sense</h1></Link>
      </div>
      <Button className="justify-end text-foreground m-2" variant="default">Get Started</Button>
    </div>
  );
}
