import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Landing from "../Landing";
import Register from "../Register";
import App from "../../App";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{
      path: "/",
      element: <Landing />
    },
    {
      path: "/register",
      element: <Register />
    }]
  },
]);

export default router;
