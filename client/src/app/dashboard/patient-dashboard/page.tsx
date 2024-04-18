"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";
import { useInfo } from "@/hooks/useInfo";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type PredictionResult = {
  prediction: string;
  probabilities: number[];
};

function VideoCard() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [videoToggle, setToggle] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (videoToggle) {
      getUserCamera(true);
    } else {
      // Turn off camera when videoToggle is false
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
  }, [videoToggle]);

  function getUserCamera(newToggle: boolean) {
    navigator.mediaDevices
      .getUserMedia({
        video: newToggle,
      })
      .then((newStream) => {
        let video = videoRef.current;
        if (video) {
          video.srcObject = newStream;
          video.play();
          setStream(newStream);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const { user } = useInfo();
  const router = useRouter();
  async function handleCapture() {
    let imageDataUrl = null;

    if (imageFile) {
      const formData = new FormData();
      formData.append("imagefile", imageFile);

      try {
        const response = await fetch("http://127.0.0.1:3000/predict", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data: PredictionResult = await response.json();
          try {
            const response = await updateDoc(doc(db, "patient", `${user.uid}`), {
              prediction: `${data.prediction}`,
              not_autistic_prob: data.probabilities[0] as number, // Type assertion here
              autistic_prob: data.probabilities[1] as number, // Type assertion here
            });
            toast(
              "The prediction has successfully been sent to the doctor you are consulting!"
            );
            router.push("/");
          } catch (error) {
            console.error("Error setting document:", error);
            toast("Failed to send prediction. Please try again!");
          }

          console.log(data);
          // Handle the response data as needed
        } else {
          console.error("Failed to make prediction");
        }
      } catch (error) {
        console.error("Error making prediction", error);
      }
    } else {
      // Capture from webcam
      if (videoRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext("2d");
        if (context) {
          context.drawImage(
            videoRef.current,
            0,
            0,
            canvas.width,
            canvas.height
          );
          // Get the image data URL from the canvas in JPG format
          imageDataUrl = canvas.toDataURL("image/jpeg", 1.0); // Quality parameter set to 1.0 (maximum quality)
        }
      }

      if (imageDataUrl) {
        // Convert the data URL to a Blob
        const base64Data = imageDataUrl.split(",")[1];
        const blob = await fetch(imageDataUrl).then((res) => res.blob());

        // Create a File object from the Blob
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });

        // Send the image file to the backend
        const formData = new FormData();
        formData.append("imagefile", file);

        try {
          const response = await fetch("http://127.0.0.1:3000/predict", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data: PredictionResult = await response.json();
            try {
              const response = await updateDoc(doc(db, "patient", `${user.uid}`), {
                prediction: `${data.prediction}`,
                not_autistic_prob: data.probabilities[0][0], // Type assertion here
                autistic_prob: data.probabilities[0][1], // Type assertion here
              });
              toast(
                "The prediction has successfully been sent to the doctor you are consulting!"
              );
              setToggle(false);
              router.push("/");
            } catch (error) {
              console.error("Error setting document:", error);
              toast("Failed to send prediction. Please try again!");
            }  
          } else {
            console.error("Failed to make prediction");
          }
        } catch (error) {
          console.error("Error making prediction", error);
        }
      }
    }
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageFile(file);
        setImageData(event.target?.result?.toString() || null);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleUpdateImage() {
    setImageFile(null);
    setImageData(null);
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center gap-5 items-center">
      <div>
        {videoToggle && !imageData ? (
          <video
            className="rounded-md w-72 md:w-96 lg:w-auto border-primary border-2 self-center hover:shadow-2xl hover:shadow-primary  transition-all "
            ref={videoRef}
          />
        ) : (
          <h1 className="m-5">Your webcam is off!</h1>
        )}
      </div>
      <div className="">
        {imageData ? (
          <div className="flex flex-col justify-center items-center">
            <Image
              className="rounded-md flex w-3/4  border-primary border-2 self-center hover:shadow-2xl hover:shadow-primary transition-shadow"
              src={imageData}
              alt="Captured Image"
              width={400}
              height={300}
            />
          </div>
        ) : (
          <input
            title="Image Upload"
            type="file"
            accept="image/*"
            ref={imageInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
        )}
      </div>
      <div>
        <div className="flex flex-col md:flex-row justify-center gap-2">
          <Button onClick={() => setToggle(!videoToggle)} variant={"outline"}>
            {videoToggle ? "Turn off Camera" : "Turn on Camera"}
          </Button>
          {imageData ? (
            <div className="flex justify-center items-center gap-2">
              <Button
                className=""
                onClick={handleUpdateImage}
                variant={"default"}
              >
                Update Image
              </Button>
              <Button onClick={handleCapture} variant={"default"}>
                Upload
              </Button>
            </div>
          ) : (
            <>
              <Button onClick={() => handleCapture()} variant={"default"}>
                Click Picture
              </Button>
              <Button
                onClick={() => imageInputRef.current?.click()}
                variant={"default"}
              >
                Upload Image
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
