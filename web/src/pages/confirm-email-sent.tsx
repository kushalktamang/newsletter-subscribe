import { useLocation } from "react-router-dom";

interface ConfirmState {
  email?: string;
  confirmed?: boolean;
}

function ConfirmEmailSent() {
  const location = useLocation();
  const state = (location.state ?? {}) as ConfirmState;
  const confirmed = Boolean(state.confirmed);

  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center text-cream">
        <h1 className="text-6xl font-bold mb-4">
          {confirmed ? "Email confirmed" : "Confirmation email sent"}
        </h1>
        <p className="text-gray-400 text-sm">
          {confirmed
            ? "Thanks for confirming. You're all set."
            : "Please check your inbox to confirm your email."}
        </p>
      </div>
    </section>
  );
}

export default ConfirmEmailSent;
