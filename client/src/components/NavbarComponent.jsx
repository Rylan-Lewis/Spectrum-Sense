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
import { Link } from "react-router-dom";

export default function NavbarComponent() {
  return (
    <div>
      <Navbar maxWidth="full">
        <NavbarContent justify="start">
          <Link to='/'><Image className="invert cursor-pointer" src={logo} width={200} /></Link>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Link to='/get-started'>
              <Button color="primary" variant="shadow">
                Get started
              </Button>
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
}
