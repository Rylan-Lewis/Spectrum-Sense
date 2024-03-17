import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from "@nextui-org/react";
import React from "react";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link,  useNavigate } from "react-router-dom";

function LoginCard() {

  const navigate = useNavigate()

  function handleSubmit(){
    return navigate("/spectrum-sense")
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <Card className="flex flex-col gap-2 w-64 md:w-72">
          <CardHeader className="flex flex-col gap-2">
            <h1 className="justify-center">Login</h1>
            <Divider />
          </CardHeader>
          <CardBody className="flex flex-col gap-5">
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
            <Button variant="solid" size="sm" type="submit" color="primary">
              Login
            </Button>
          </CardBody>
          <CardFooter className=" flex flex-col justify-center">
            <Link to='/sign-up'>
              <h1 className="text-xs text-primary hover:scale-105 transition-all cursor-pointer">
                Don't have an account, Signup!
              </h1>
            </Link>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default LoginCard;
