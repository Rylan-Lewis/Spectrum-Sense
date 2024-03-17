import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import logo from "../../assets/logo.png";

export default function OptionsCard() {
  return (
    <Card className="m-5 md:max-w-[400px]">
      <CardHeader className="flex gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          className="invert"
          src={logo}
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">Spectrum Sense</p>
          <p className="text- text-default-500">spectrum-sense.org</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <h1>Who are you?</h1>
        <RadioGroup label="Select your favorite city" orientation="horizontal">
          <Radio value="buenos-aires">Buenos Aires</Radio>
          <Radio value="sydney">Sydney</Radio>
          <Radio value="san-francisco">San Francisco</Radio>
          <Radio value="london">London</Radio>
          <Radio value="tokyo">Tokyo</Radio>
        </RadioGroup>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link
          isExternal
          showAnchorIcon
          href="https://github.com/nextui-org/nextui"
        >
          Visit source code on GitHub.
        </Link>
      </CardFooter>
    </Card>
  );
}
