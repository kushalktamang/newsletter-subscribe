const configuredApiUrl: unknown = import.meta.env.VITE_APP_API_URL;
const APP_URL =
  typeof configuredApiUrl === "string" && configuredApiUrl.length > 0 ? configuredApiUrl : "/api";

export default APP_URL;
