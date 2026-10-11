import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import APP_URL from "../utils/api";

type ConfirmStatus = "loading" | "error";

function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<ConfirmStatus>("loading");
  const [message, setMessage] = useState("Confirming your email...");

  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      setStatus("error");
      setMessage("Invalid confirmation link.");
      return;
    }

    let isActive = true;

    const confirmEmail = async () => {
      try {
        const response = await fetch(`${APP_URL}/newsletter/confirm-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, token }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          if (!isActive) return;
          setStatus("error");
          setMessage(payload?.message ?? "Failed to confirm email.");
          return;
        }

        if (isActive) {
          navigate("/confirm-email-sent", {
            replace: true,
            state: { email, confirmed: true },
          });
        }
      } catch (error) {
        if (!isActive) return;
        console.error(error);
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    confirmEmail();

    return () => {
      isActive = false;
    };
  }, [navigate, searchParams]);

  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center text-cream">
        <h1 className="text-4xl font-bold mb-4">
          {status === "loading"
            ? "Confirming your email..."
            : "Confirmation failed"}
        </h1>
        <p className="text-gray-400 text-sm">{message}</p>
      </div>
    </section>
  );
}

export default ConfirmEmail;
