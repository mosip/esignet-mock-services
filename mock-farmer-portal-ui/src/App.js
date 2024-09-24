import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";

import RegisterForm from "./screens/RegisterForm";
import Landing from "./screens/Landing";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      loader: () => redirect("/agroveritas/home"),
    },
    {
      path: "/agroveritas",
      children: [
        {
          path: "home",
          element: <Landing />,
        },
        {
          path: "farmerRegistration",
          element: <RegisterForm />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
