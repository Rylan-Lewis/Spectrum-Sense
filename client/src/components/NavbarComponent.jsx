import { Image, Navbar, NavbarBrand } from "@nextui-org/react";
import React from "react";
import logo from "../assets/logo.png"

export default function NavbarComponent(){
    return(
        <div>
            <Navbar className="justify-start">
                <NavbarBrand className="">
                    <Image className="invert" src={logo} width={200} />
                </NavbarBrand>
            </Navbar>
        </div>
    )
}