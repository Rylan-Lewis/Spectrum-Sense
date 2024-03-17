import {
  Button,
  Image,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import React from "react";
import logo from "../assets/logo.png";

export default function NavbarComponent() {
  return (
    <div>
      <Navbar maxWidth="full">
        <NavbarContent justify="start">
          <Image className="invert" src={logo} width={200} />
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button color="primary" variant="shadow">
              Get started
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
}
