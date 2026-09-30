import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Subscribe from "./pages/subscribe.tsx";
import ErrorPage from "./pages/error.tsx";
import ConfirmEmail from "./pages/confirm-email.tsx";
import ConfirmEmailSent from "./pages/confirm-email-sent.tsx";
import "./_css/index.css";

const rootElement = document.querySelector("#root");
if (rootElement === null) {
  throw new Error("root element is empty");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Subscribe />,
      },
      {
        path: "confirm-email",
        element: <ConfirmEmail />,
      },
      {
        path: "confirm-email-sent",
        element: <ConfirmEmailSent />,
      },
    ],
  },
]);

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
