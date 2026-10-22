import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <Suspense fallback={<div className="font-mono text-xs text-zinc-500">Loading sign up...</div>}>
        <SignUp />
      </Suspense>
    </div>
  );
}
