import {
  isRouteErrorResponse,
  useRouteError,
  useNavigate,
} from "react-router-dom";
import { AlertCircle } from "lucide-react";

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const goHome = () => navigate("/");

  return (
    <section
      id="error"
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
    >
      <AlertCircle className="text-cream text-9xl mb-6 animate-pulse" />

      {isRouteErrorResponse(error) ? (
        <div>
          <h1 className="text-6xl font-extrabold text-cream mb-2">
            {error.status}
          </h1>
          <h2 className="text-2xl font-semibold text-cream mb-4">
            {error.statusText}
          </h2>
        </div>
      ) : error instanceof Error ? (
        <div>
          <h1 className="text-4xl font-bold text-cream mb-4">
            Oops! Something went wrong.
          </h1>
        </div>
      ) : (
        <h1 className="text-4xl font-bold text-cream mb-4">Unknown Error</h1>
      )}

      <button
        onClick={() => void goHome()}
        className="mt-8 px-6 py-3 bg-cream text-ink font-semibold rounded-lg shadow-lg transition-all duration-300 hover:bg-cream/34 cursor-pointer"
      >
        Go Back Home
      </button>
    </section>
  );
}

export default ErrorPage;
