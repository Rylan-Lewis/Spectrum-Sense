"use client";
import { useEffect, useState } from "react";
import DoctorForm from "./components/doctor-form";
import PatientForm from "./components/patient-form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Page() {
  const [loaded, setLoad] = useState(false);
  const [type, setType] = useState("patient");
  useEffect(() => {
    setLoad(true);
  }, []);


  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <AlertDialog open={loaded}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>What best describes you?</AlertDialogTitle>
            <div>
              <RadioGroup defaultValue="patient" onValueChange={(e)=>{setType(e)}
              }>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="patient" id="patient" />
                  <Label htmlFor="patient">Patient</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="doctor" id="doctor" />
                  <Label htmlFor="doctor">Doctor</Label>
                </div>
              </RadioGroup>
            </div>
          </AlertDialogHeader>
          <AlertDialogDescription>
            This action cannot be undone once the more details form is
            submitted. But, incase you choose the wrong option right now you can
            reload the page.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setLoad(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setLoad(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {type == "patient" ? <PatientForm /> : <DoctorForm />}
    </div>
  );
}
