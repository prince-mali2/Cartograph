import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OrganizationSwitcher, UserButton, OrganizationProfile } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Suspense } from "react";

async function WorkspaceContent() {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const clerk = await clerkClient();

  let activeOrgId = orgId;

  if (!activeOrgId) {
    const memberships = await clerk.users.getOrganizationMembershipList({ userId });
    if (memberships.data.length === 0) {
      const user = await clerk.users.getUser(userId);
      const name = user.firstName ? `${user.firstName}'s Workspace` : 'Workspace';
      const newOrg = await clerk.organizations.createOrganization({
        name,
        createdBy: userId,
      });
      activeOrgId = newOrg.id;
    } else {
      activeOrgId = memberships.data[0].organization.id;
    }
  }

  let orgName = "Workspace";
  let orgSlug = "";
  if (activeOrgId) {
    try {
      const org = await clerk.organizations.getOrganization({ organizationId: activeOrgId });
      orgName = org.name;
      orgSlug = org.slug || "";
    } catch {
      // fallback
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="flex items-center justify-between px-6 h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-4">
          <span className="font-mono font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
            cartograph//
          </span>
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          <OrganizationSwitcher
            hidePersonal={false}
            afterCreateOrganizationUrl="/"
            afterSelectOrganizationUrl="/"
          />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserButton />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-xs">
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Active Organization
              </span>
              <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
                {orgName}
              </h1>
              {orgSlug && (
                <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-0.5">
                  slug: {orgSlug} | id: {activeOrgId}
                </p>
              )}
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Team & Settings
              </h2>

              <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-3 max-h-80 overflow-y-auto">
                <OrganizationProfile
                  routing="hash"
                  appearance={{
                    elements: {
                      rootBox: "w-full max-w-none shadow-none bg-transparent",
                      cardBox: "w-full max-w-none shadow-none bg-transparent border-0 p-0",
                      pageScrollBox: "p-2",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center font-mono text-xs text-zinc-500">Loading cartograph...</div>}>
      <WorkspaceContent />
    </Suspense>
  );
}
