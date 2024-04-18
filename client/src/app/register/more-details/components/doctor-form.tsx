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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useInfo } from "@/hooks/useInfo";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/app/firebaseConfig";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { sendEmailVerification } from "firebase/auth";
import useLogOut from "@/hooks/useLogOut";

const doctorSchema = z.object({
  doctorFirstName: z
    .string()
    .min(1, {
      message: "Firstname cannot be left blank.",
    })
    .refine((value) => !/\s/.test(value), {
      message: "There cannot be any whitespaces!",
    }),
  doctorLastName: z
    .string()
    .min(1, {
      message: "Lastname cannot be left blank.",
    })
    .refine((value) => !/\s/.test(value), {
      message: "There cannot be any whitespaces!",
    }),
  doctorAge: z.coerce
    .number()
    .min(18, { message: "The doctor must be of minimum 18 years of age!" }),
});

export default function DoctorForm() {
  const doctorForm = useForm<z.infer<typeof doctorSchema>>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      doctorFirstName: "",
      doctorLastName: "",
      doctorAge: undefined,
    },
  });


  const { user } = useInfo();
  const router = useRouter();
  const id = user.uid;
  const email = user.email;
  
  async function onSubmit(values: z.infer<typeof doctorSchema>) {
    try {
      const response = await setDoc(doc(db, "doctor", `${id}`), {
        name: `${values.doctorFirstName} ${values.doctorLastName}`,
        email: `${email}`,
        uid: `${id}`,
      });

      const currentUser = auth.currentUser;
      if (currentUser) {
        await sendEmailVerification(currentUser);
        toast("Verification email has been sent!");
        toast("Verify and refresh!");
        router.push('/')
      } else toast("Some error occured");
    } catch (error) {
      console.log(error);
      toast(`Error: ${error}`);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-medium">Doctor form</h1>
      <Separator />
      <Form {...doctorForm}>
        <form
          onSubmit={doctorForm.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row justify-center md:items-center gap-5">
            <FormField
              control={doctorForm.control}
              name="doctorFirstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Zaidali" {...field} />
                  </FormControl>
                  <FormDescription>This is your first name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={doctorForm.control}
              name="doctorLastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Merchant" {...field} />
                  </FormControl>
                  <FormDescription>This is your last name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={doctorForm.control}
            name="doctorAge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input placeholder="68" {...field} />
                </FormControl>
                <FormDescription>This is your age.</FormDescription>
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
