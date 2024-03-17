import { Card, CardBody, CardFooter, CardHeader, Input } from "@nextui-org/react";
import React from "react";

function FormCard(){
  return <div className="">
    <form>
      <Card className="">
        <CardHeader>
          <h1 className="">Login</h1>
        </CardHeader>
        <CardBody className="flex flex-col gap-5">
          <Input size="sm" label="Email" isRequired required/>
          <Input size="sm" label="Password" type="password" isRequired required/>
        </CardBody>
        <CardFooter className="flex flex-col justify-center">
          <h1 className="text-xs text-primary hover:scale-105 transition-all">Don't have an account, Signup!</h1>
        </CardFooter>
      </Card>
    </form>
  </div>
}

export default FormCard