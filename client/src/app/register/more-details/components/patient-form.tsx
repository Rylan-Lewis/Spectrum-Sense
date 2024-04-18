"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/app/firebaseConfig";
import { useInfo } from "@/hooks/useInfo";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const patientSchema = z.object({
  patientFirstName: z
    .string()
    .min(1, {
      message: "Firstname cannot be left blank.",
    })
    .refine((value) => !/\s/.test(value), {
      message: "There cannot be any whitespaces!",
    }),
  patientLastName: z
    .string()
    .min(1, {
      message: "Lastname cannot be left blank.",
    })
    .refine((value) => !/\s/.test(value), {
      message: "There cannot be any whitespaces!",
    }),
  patientAge: z.coerce
    .number()
    .max(3, { message: "The patient must be younger than 4 years of age!" }),
  consultingDoctor: z.string({
    required_error: "Please select the consulting doctor.",
  }),
});

export default function PatientForm() {
  const patientForm = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      patientFirstName: "",
      patientLastName: "",
      patientAge: undefined,
      consultingDoctor: "",
    },
  });
  const [doctors, setDoctors] = useState<DocumentData[]>([]);
  useEffect(() => {
    async function getDoctors() {
      const q = query(collection(db, "doctor"));
      const querySnapshot = await getDocs(q);
      const newDoctors:Array<DocumentData> = [];
      querySnapshot.forEach((doc) => {
        newDoctors.push(doc.data());
      });
      setDoctors(newDoctors);
    }  
    getDoctors();
  }, []);
  
  const { user } = useInfo();
  const id = user.uid
  const parentEmail = user.email
  const router = useRouter()
  async function onSubmit(values: z.infer<typeof patientSchema>) {
    try {
      const response = await setDoc(doc(db, "patient", `${id}` ), {
        name: `${values.patientFirstName} ${values.patientLastName}`,
        age: `${values.patientAge}`,
        parent_email: `${parentEmail}`,
        doctor_email: `${values.consultingDoctor}`,
        
        uid: `${id}`,
      });

      const currentUser = auth.currentUser;
      if (currentUser) {
        await sendEmailVerification(currentUser);
        toast("Verification email has been sent!");
        toast("Verify and refresh!");
        router.push('/')
        // LogOut
      } else toast("Some error occured");
    } catch (error) {
      console.log(error);

      toast(`Error: ${error}`);
    }
    console.log(values);
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-medium">Patient form</h1>
      <Separator />
      <Form {...patientForm}>
        <form
          onSubmit={patientForm.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row justify-center md:items-center gap-5">
            <FormField
              control={patientForm.control}
              name="patientFirstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Rylan" {...field} />
                  </FormControl>
                  <FormDescription>This is your first name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={patientForm.control}
              name="patientLastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lewis" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your patients last name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={patientForm.control}
            name="patientAge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patients Age</FormLabel>
                <FormControl>
                  <Input placeholder="3" {...field} />
                </FormControl>
                <FormDescription>This is your patients age.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={patientForm.control}
            disabled={!doctors ? true : false}
            name="consultingDoctor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your consulting doctor email" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors &&
                      doctors.map((doctor, index) => {
                        console.log(doctors);
                        
                        return (
                          <SelectItem key={index} value={`${doctor?.email}`}>
                            {`${doctor?.name}`}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
                {/* <FormDescription>
                  Choose your .
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
