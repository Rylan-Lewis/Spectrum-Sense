"use client";
import * as React from "react";
import {
  query,
  collection,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInfo } from "@/hooks/useInfo";
import { db } from "@/app/firebaseConfig";
import { Input } from "@/components/ui/input";

interface Patient {
  name: string;
  age: string;
  autisticProb: number;
  notAutisticProb: number;
  parentEmail: string;
  prediction: string;
}

export function PatientDataTable(): JSX.Element {
  const { user } = useInfo();
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = React.useState<Patient[]>([]);

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const q = query(
          collection(db, "patient"),
          where("doctor_email", "==", user.email)
        );
        const snapshot = await getDocs(q);
        const fetchedPatients: Patient[] = snapshot.docs.map((doc): Patient => {
          const data: DocumentData = doc.data();
          // Determine result based on probabilities
          const result: string =
            data.autistic_prob > data.not_autistic_prob
              ? "Autistic"
              : "Not Autistic";
          return {
            name: data.name,
            age: data.age.toString(),
            autisticProb: parseFloat(data.autistic_prob.toFixed(2)),
            notAutisticProb: parseFloat(data.not_autistic_prob.toFixed(2)),
            parentEmail: data.parent_email,
            prediction: result,
          };
        });
        setPatients(fetchedPatients);
        setFilteredPatients(fetchedPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchData();
  }, [user.email]);

  const handleFilter = (value: string): void => {
    const filtered = patients.filter((patient) =>
      patient.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  return (
    <div className="w-3/4 border-primary border-2 p-5 hover:shadow-2xl hover:shadow-primary  transition-all ">
      <Input
        placeholder="Filter by name..."
        onChange={(event) =>
          handleFilter((event.target as HTMLInputElement).value)
        }
        className="max-w-sm mb-4"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Autistic Probability</TableCell>
            <TableCell>Not Autistic Probability</TableCell>
            <TableCell>Parent Email</TableCell>
            <TableCell>Result</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.map((patient: Patient, index: number) => (
            <TableRow key={index}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.autisticProb}</TableCell>
              <TableCell>{patient.notAutisticProb}</TableCell>
              <TableCell>{patient.parentEmail}</TableCell>
              <TableCell>{patient.prediction}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
