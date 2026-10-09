import { randomBytes } from "node:crypto";

const newToken = () => randomBytes(32).toString("hex");

export default newToken;
