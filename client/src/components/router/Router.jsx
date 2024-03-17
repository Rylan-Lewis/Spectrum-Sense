import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Landing from "../Landing";
import Register from "../Register";
import App from "../../App";
import SignUp from "../getStarted/SignUp";
import VideoCard from "../analysis/VideoCard";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{
      path: "/",
      element: <Landing />
    },
    {
      path: "/get-started",
      element: <Register />
    },{
      path: "/sign-up",
      element: <SignUp />
    },{
      path: "/spectrum-sense",
      element: <VideoCard />
    }]
  },
]);

export default router;
