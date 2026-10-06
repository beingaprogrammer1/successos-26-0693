import { authClient } from "./auth";

// Finish a returning managed sign-in redirect before any route renders.
// Imported first from main.tsx; top-level await holds later sibling imports.
await authClient.managedAuth.handleRedirect();
