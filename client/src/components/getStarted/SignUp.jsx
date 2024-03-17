import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React from "react";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlinePersonOutline } from "react-icons/md";
import { Link } from "react-router-dom";

function SignUp() {
  return (
    <div className="">
      <form>
        <Card className="flex flex-col gap-2 w-64 md:w-72">
          <CardHeader className="flex flex-col gap-2">
            <h1 className="justify-center">Sign up</h1>
            <Divider />
          </CardHeader>
          <CardBody className="flex flex-col gap-5">
            <Select label="What best defines you?" required isRequired>
              <SelectItem value={"parent"}>Parent</SelectItem>
              <SelectItem value={"guardian"}>Guardian</SelectItem>
              <SelectItem value={"doctor"}>Doctor</SelectItem>
            </Select>
            <Input
              size="sm"
              startContent={<MdOutlinePersonOutline />}
              label="Full Name"
              isRequired
              required
            />
            <Input
              size="sm"
              startContent={<MdOutlineEmail />}
              labelPlacement="inside"
              label="Email"
              isRequired
              required
            />
            <Input
              size="sm"
              startContent={<RiLockPasswordLine />}
              label="Password"
              type="password"
              isRequired
              required
            />
            <Button variant="solid" size="sm" color="primary">
              Sign Up
            </Button>
          </CardBody>
          <CardFooter className=" flex flex-col justify-center">
            <Link to={'/get-started'}>
              <h1 className="text-xs text-primary hover:scale-105 transition-all cursor-pointer">
                Already have an account, Login!
              </h1>
            </Link>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default SignUp;
