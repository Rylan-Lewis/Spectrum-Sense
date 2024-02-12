import React from "react";
import NavbarComponent from "./NavbarComponent";

export default function Landing() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="fixed left-0 right-0 top-0">
        <NavbarComponent />
      </div>
      <div className="w-2/3">
        <h1 className="text text-justify">
          <span className="font-semibold">Spectrum Sense</span> is a cutting-edge ML-powered platform <span className="text-slate-400">designed to
          support early intervention and improve the lives of individuals and
          their families.</span>
        </h1>
      </div>
    </div>
  );
}
