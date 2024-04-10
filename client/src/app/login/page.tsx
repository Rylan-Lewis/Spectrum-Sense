"use client";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";
import { toast } from "sonner"

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string()
     .min(8, { message: "Password must be at least 8 characters." })
     .refine(value => /[a-z]/.test(value), {
       message: "Password must contain at least one lowercase letter.",
     })
     .refine(value => /[A-Z]/.test(value), {
       message: "Password must contain at least one uppercase letter.",
     })
     .refine(value => /[0-9]/.test(value), {
       message: "Password must contain at least one number.",
     })
     .refine(value => /[^a-zA-Z0-9]/.test(value), {
       message: "Password must contain at least one special character.",
     }),
 });


export default function Login() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    try {
      const response = await signInWithEmailAndPassword(auth, values.email, values.password)
      router.push('/dashboard')
      toast(`Welcome!`)
    } catch (error) {
      toast(`Error: ${error}`)
    }

    console.log(values);
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="w-1/2 flex flex-col ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@spectrum-sense.xyz" {...field} />
                  </FormControl>
                  {/* <FormDescription>Enter your email.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="shhh!!!" {...field} />
                  </FormControl>
                  {/* <FormDescription>Enter your password.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        <Button className="text-[10px] md:text-base justify-end" variant={'link'}>{`Don't have an account? Register here!`} </Button>
      </div>
    </div>
  );
}
