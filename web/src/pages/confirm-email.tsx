import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import APP_URL from "../utils/api";

type ConfirmResult = { status: "loading" } | { status: "error"; message: string };

const errorPayloadSchema = z.object({
  message: z.string().optional(),
});

function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<ConfirmResult>({ status: "loading" });
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const hasValidParams = email !== null && email.length > 0 && token !== null && token.length > 0;

  useEffect(() => {
    let isActive = true;

    if (hasValidParams) {
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
            const body: unknown = await response.json().catch(() => null);
            const parsedBody = errorPayloadSchema.safeParse(body);
            if (isActive) {
              setResult({
                status: "error",
                message: parsedBody.success
                  ? (parsedBody.data.message ?? "Failed to confirm email.")
                  : "Failed to confirm email.",
              });
            }
            return;
          }

          if (isActive) {
            void navigate("/confirm-email-sent", {
              replace: true,
              state: { email, confirmed: true },
            });
          }
        } catch (error: unknown) {
          if (isActive) {
            console.error(error);
            setResult({
              status: "error",
              message: "Something went wrong. Please try again.",
            });
          }
        }
      };

      void confirmEmail();
    }

    return () => {
      isActive = false;
    };
  }, [email, hasValidParams, navigate, token]);

  const hasError = !hasValidParams || result.status === "error";
  const message = (() => {
    if (!hasValidParams) {
      return "Invalid confirmation link.";
    }
    if (result.status === "error") {
      return result.message;
    }
    return "Confirming your email...";
  })();

  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center text-cream">
        <h1 className="text-4xl font-bold mb-4">
          {hasError ? "Confirmation failed" : "Confirming your email..."}
        </h1>
        <p className="text-gray-400 text-sm">{message}</p>
      </div>
    </section>
  );
}

export default ConfirmEmail;
