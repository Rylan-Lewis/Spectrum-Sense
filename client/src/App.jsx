import React from "react";
import "./App.css";
import Landing from "./components/Landing";
import { Outlet, RouterProvider } from "react-router-dom";
import router from "./components/router/Router";
import NavbarComponent from "./components/NavbarComponent";

export default function App() {
  return (
    <div className="w-full h-screen font-poppins flex flex-col justify-center items-center">
      <div className="fixed left-0 right-0 top-0">
        <NavbarComponent />
      </div>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}
