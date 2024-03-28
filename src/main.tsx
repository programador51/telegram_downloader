import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "bootswatch/dist/minty/bootstrap.min.css";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import ErrorPage from "./error-page.tsx";
import ConfigurationAddOn from "./structure/configuration/index.tsx";
import Global from "./structure/configuration/Global/index.tsx";

const router = createMemoryRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/configuration",
    element: <ConfigurationAddOn />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Global>
      <RouterProvider router={router} />
    </Global>
  </React.StrictMode>
);
