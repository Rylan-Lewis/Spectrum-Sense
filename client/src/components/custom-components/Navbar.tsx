"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useInfo } from "@/hooks/useInfo";
import useAuth from "@/hooks/useAuth";
import AvatarNav from "./AvatarNav";
import { ModeToggle } from "./theme-toggle";

export default function Navbar() {
  useAuth();
  const { user } = useInfo();

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
        <Link href={"/"}>
          <h1 className="font-light text-sm md:text-xl">Spectrum Sense</h1>
        </Link>
      </div>
      <div className="justify-end m-2">
        <div className="flex gap-2">
          {user.email ? (
            <div>
              <AvatarNav />
            </div>
          ) : (
            <Link href={"/login"}>
              <Button className="text-foreground " variant="default">
                {"Get Started"}
              </Button>
            </Link>
          )}
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
