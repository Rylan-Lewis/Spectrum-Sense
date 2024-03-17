import { Button, ButtonGroup } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";

function VideoCard() {
  let videoRef = useRef(null);
  let photoRef = useRef(null);
  const [videoToggle, setToggle] = useState(false);
  const [stream, setStream] = useState(null); // State to hold the stream

  async function handleToggle() {
    const newToggle = !videoToggle;
    setToggle(newToggle); // Update the state
    if (!newToggle && stream) {
      // If toggled off and stream exists, stop the tracks
      stream.getTracks().forEach((track) => track.stop());
      setStream(null); // Clear the stream reference
      return;
    } else {
      getUserCamera(newToggle);
    }
  }

  function getUserCamera(newToggle) {
    navigator.mediaDevices
      .getUserMedia({
        video: newToggle,
      })
      .then((newStream) => {
        let video = videoRef.current;
        video.srcObject = newStream;
        video.play();
        setStream(newStream); // Store the stream reference
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center gap-5 items-center">
      <div>
        {videoToggle ? (
          <video
            className="rounded-md w-72 md:w-96 lg:w-auto border-primary border-2 self-center hover:shadow-2xl hover:shadow-primary  transition-all "
            ref={videoRef}
          />
        ) : (
          <h1 className="m-5">Your webcam is off!</h1>
        )}
      </div>
      <div>
        <ButtonGroup>
          <Button onClick={handleToggle} color="primary" variant="ghost">
            Camera Toggle
          </Button>
          <Button color="primary" variant="shadow" startContent>
            Capture!
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default VideoCard;
