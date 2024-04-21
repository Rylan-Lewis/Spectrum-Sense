"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";
import { useInfo } from "@/hooks/useInfo";
import { toast } from "sonner";

const DashboardPage = () => {
  const router = useRouter();
  const { user } = useInfo();

  useEffect(() => {
    const checkUserType = async () => {
      try {
        // Check if the user exists in the doctor collection
        const doctorQuery = query(
          collection(db, "doctor"),
          where("email", "==", user.email)
        );
        const doctorSnapshot = await getDocs(doctorQuery);
        if (!doctorSnapshot.empty) {
          // User is a doctor, route to doctor's dashboard
          toast(`Welcome Doctor`)
          router.push("/dashboard/doctor-dashboard");
          return;
        }

        // Check if the user exists in the patient collection
        const patientQuery = query(
          collection(db, "patient"),
          where("parent_email", "==", user.email)
        );
        const patientSnapshot = await getDocs(patientQuery);
        if (!patientSnapshot.empty) {
          // User is a patient, route to patient's dashboard
          toast(`Welcome!`)
          router.push("/dashboard/patient-dashboard");
          return;
        }

        // User not found in any collection
        toast('Please complete the process')
        router.push('/register/more-details')
        console.error("User not found in any collection");
        // Handle this case as needed (e.g., show an error message)
      } catch (error) {
        console.error("Error checking user type:", error);
        // Handle error (e.g., show an error message)
      }
    };

    if (user) {
      checkUserType();
    }
  }, [router, user]);

  return <div className="w-full h-screen flex justify-center items-center">Loading...</div>; // Placeholder while checking user type
};

export default DashboardPage;
