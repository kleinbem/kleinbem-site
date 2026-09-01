import { createAuthClient } from "better-auth/svelte";

// The kleinbem-auth service origin. Override at build time with PUBLIC_AUTH_URL.
const baseURL = import.meta.env.PUBLIC_AUTH_URL ?? "https://login.kleinbem.dev";

export const authClient = createAuthClient({ baseURL });

export type SocialProvider = "google" | "facebook";
