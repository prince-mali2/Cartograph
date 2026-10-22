import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <Suspense fallback={<div className="font-mono text-xs text-zinc-500">Loading sign in...</div>}>
        <SignIn />
      </Suspense>
    </div>
  );
}
