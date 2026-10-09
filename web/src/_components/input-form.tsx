import { Mail } from "lucide-react";
import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import APP_URL from "../utils/api.js";

interface SubscribeState {
  email: string;
  error: string | null;
}

const errorPayloadSchema = z.object({ message: z.string().optional() });

// form
function InputForm() {
  const navigate = useNavigate();

  const subscribeAction = async (
    _prev: SubscribeState,
    formData: FormData,
  ): Promise<SubscribeState> => {
    const email = formData.get("email");
    // email check
    if (typeof email !== "string" || email === null) {
      return { email: "", error: null };
    }

    try {
      const response = await fetch(`${APP_URL}/newsletter/subscribe`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      const json: unknown = await response.json();

      if (!response.ok) {
        const parsed = errorPayloadSchema.safeParse(json);
        return {
          email,
          error: parsed.success
            ? (parsed.data.message ?? "Invalid email, please try again.")
            : "Invalid email, please try again.",
        };
      }

      await navigate("/confirm-email-sent", {
        state: { email, confirmed: false },
      });
      return { email, error: null };
    } catch (error: unknown) {
      console.error(error);
      return { email, error: "something went wrong. please try again." };
    }
  };

  const [state, formAction, isPending] = useActionState(subscribeAction, {
    email: "",
    error: null,
  });

  return (
    <section id="input-form">
      <div>
        <div className="flex flex-col justify-center items-center mt-2">
          {/* subscription form*/}
          <form
            action={formAction}
            className="relative flex items-center bg-[#121212] rounded border border-white/5 mt-6 text-sm max-w-xl w-full"
          >
            <Mail className="text-cream mx-4" size={47} />
            <input
              defaultValue={state.email}
              type="email"
              name="email"
              placeholder="Enter your email"
              className="focus:outline-none pl-10 py-5 bg-[#121212] w-full placeholder-gray-500 y-50 font-bold text-cream"
              required
              disabled={isPending}
            />
            <button
              className="shrink-0 mr-2 px-6 py-3 text-sm bg-cream rounded-md active:scale-95 transition duration-300 text-ink disabled:opacity-60"
              type="submit"
            >
              <span className="font-bold text-ink">
                {isPending ? "Subscribing..." : "Subscribe"}
              </span>
            </button>
          </form>
        </div>
        {/*error*/}
        <div className="flex flex-col mt-5 justify-center items-center p-5">
          <span
            role="alert"
            className="text-red-600 text-xl text-start mb-1 text-opacity-70 font-bold"
          >
            {state.error}
          </span>
        </div>
      </div>
    </section>
  );
}

export default InputForm;
