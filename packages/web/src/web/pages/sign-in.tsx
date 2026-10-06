import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AlertCircle, ArrowRight, Check, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "../lib/auth";
import { BrandButton } from "../components/ui/brand-button";
import { ScriptLogo } from "../components/ui/brand";
import { GemIcon } from "../components/ui/gem";
import { Panel, Shell } from "../components/ui/primitives";
import { cn } from "@/lib/utils";

type Mode = "login" | "create";

// Email/password sessions share the managed-auth bearer slot so the oRPC client
// and the auth client send one token, even where iframe cookies are blocked.
const TOKEN_KEY = "runable.managed-auth.token";
const captureToken = {
  onSuccess: (ctx: { response: Response }) => {
    const token = ctx.response.headers.get("set-auth-token");
    if (token) localStorage.setItem(TOKEN_KEY, token);
  },
};

const PERKS = [
  "Thirty-six lessons across six courses",
  "Success Gems credited as you finish each lesson",
  "Nine achievements, Bronze through Legend",
  "Your progress saved on every device",
];

function useQueryParams() {
  const [location] = useLocation();
  const search = typeof window !== "undefined" ? window.location.search : "";
  return { params: new URLSearchParams(search), location };
}

export default function SignInPage() {
  const { params } = useQueryParams();
  const [, navigate] = useLocation();
  const { data: session } = authClient.useSession();

  const [mode, setMode] = useState<Mode>(params.get("mode") === "create" ? "create" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<"google" | "email" | null>(null);

  const next = params.get("next") || "/dashboard";

  useEffect(() => {
    if (session) navigate(next, { replace: true });
  }, [session, next, navigate]);

  async function handleGoogle() {
    setError(null);
    setPending("google");
    const result = await authClient.managedAuth.signIn({ provider: "google" });
    if (result.error && result.error.code !== "POPUP_CLOSED") {
      setError(result.error.message ?? "Google sign-in failed. Try again.");
    }
    setPending(null);
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending("email");
    try {
      if (mode === "create") {
        const res = await authClient.signUp.email({ name: name.trim() || email.split("@")[0], email, password }, captureToken);
        if (res.error) setError(res.error.message ?? "Could not create that account.");
      } else {
        const res = await authClient.signIn.email({ email, password }, captureToken);
        if (res.error) setError(res.error.message ?? "Wrong email or password.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }
    setPending(null);
  }

  return (
    <div className="dot-grid bg-cream text-ink/10">
      <Shell wide className="grid items-center gap-12 py-16 lg:grid-cols-[1fr_0.95fr] lg:py-24">
        {/* Pitch side */}
        <div className="text-ink">
          <ScriptLogo variant="primary" className="h-32 w-auto hard" />
          <h1 className="mt-9 text-[clamp(2.1rem,5vw,3.2rem)] uppercase">
            {mode === "create" ? (
              <>
                Your first Gems
                <br />
                are one lesson
                <br />
                away.
              </>
            ) : (
              <>
                Welcome back.
                <br />
                Pick up where
                <br />
                you left off.
              </>
            )}
          </h1>
          <ul className="mt-8 space-y-3.5">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-[14.5px] text-ink/80">
                <span className="mt-[2px] inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-gem">
                  <Check className="size-3" strokeWidth={3.5} />
                </span>
                {perk}
              </li>
            ))}
          </ul>
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-4 py-2 text-[12.5px] font-semibold">
            <GemIcon className="size-4 text-gem" />
            Free. No card, no trial timer.
          </p>
        </div>

        {/* Form side */}
        <Panel className="p-7 text-ink sm:p-9">
          <div className="grid grid-cols-2 gap-1 rounded-[11px] border-2 border-ink bg-cream p-1">
            {(["login", "create"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className={cn(
                  "label rounded-[7px] py-2.5 transition-colors",
                  mode === m ? "bg-ink text-cream" : "text-ink/60 hover:text-ink",
                )}
              >
                {m === "login" ? "Log in" : "Create account"}
              </button>
            ))}
          </div>

          <BrandButton
            variant="paper"
            size="lg"
            className="mt-6 w-full"
            onClick={handleGoogle}
            disabled={pending !== null}
          >
            {pending === "google" ? (
              <Loader2 className="size-[18px] animate-spin" />
            ) : (
              <FcGoogle className="size-[19px]" />
            )}
            Continue with Google
          </BrandButton>

          <div className="my-6 flex items-center gap-4">
            <span className="h-[2px] flex-1 bg-ink/15" />
            <span className="label text-muted-ink">or with email</span>
            <span className="h-[2px] flex-1 bg-ink/15" />
          </div>

          <form onSubmit={handleEmail} className="space-y-4">
            {mode === "create" ? (
              <Field
                label="Name"
                type="text"
                value={name}
                onChange={setName}
                placeholder="Alex Carter"
                autoComplete="name"
              />
            ) : null}
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="At least 8 characters"
              autoComplete={mode === "create" ? "new-password" : "current-password"}
              required
              minLength={8}
            />

            {error ? (
              <div className="flex items-start gap-2.5 rounded-[10px] border-2 border-danger bg-danger/8 p-3 text-[13px] text-danger">
                <AlertCircle className="mt-[1px] size-4 shrink-0" />
                {error}
              </div>
            ) : null}

            <BrandButton
              type="submit"
              variant="navy"
              size="lg"
              className="w-full"
              disabled={pending !== null}
            >
              {pending === "email" ? (
                <>
                  <Loader2 className="size-[18px] animate-spin" />
                  {mode === "create" ? "Creating account" : "Signing in"}
                </>
              ) : (
                <>
                  {mode === "create" ? "Create my account" : "Log in"}
                  <ArrowRight className="size-[18px]" />
                </>
              )}
            </BrandButton>
          </form>

          <p className="mt-6 text-center text-[12px] leading-relaxed text-muted-ink">
            By continuing you agree to the SuccessOS 26 Terms of Service. Success Gems are a
            progress reward and have no monetary value.
          </p>
        </Panel>
      </Shell>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.ComponentProps<"input">, "value" | "onChange">) {
  return (
    <label className="block">
      <span className="label text-muted-ink">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-12 w-full rounded-[10px] border-2 border-ink bg-cream px-4 text-[14.5px] outline-none transition-shadow placeholder:text-muted-ink/60 focus:bg-paper focus:shadow-[3px_3px_0_0_var(--navy)]"
      />
    </label>
  );
}
