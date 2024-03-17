import React from "react";
import NavbarComponent from "../NavbarComponent";

export default function LandingMain() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="w-2/3">
        <h1 className="text text-justify md:text-4xl md:text-left">
          <span className="font-semibold">Spectrum Sense</span> <span className="">is a bleeding-edge ML-powered platform</span> <span className="text-slate-400 hover:text-primary-700">designed to
          support early intervention and improve the lives of individuals and
          their families.</span>
        </h1>
      </div>
      {/* <Particles id="tsparticles" init={particlesInit}/> */}
    </div>
  );
}
