import ConvexClientProvider from "@/components/ConvexClientProvider";
import { DashboardAuthGate, DashboardFrame } from "@/components/layouts/dashboard";
import { LinkedInProfileSetupGate } from "@/modules/profiles/components/linkedin-profile-setup-gate";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClientProvider>
      <DashboardFrame>
        <DashboardAuthGate>
          <LinkedInProfileSetupGate>{children}</LinkedInProfileSetupGate>
        </DashboardAuthGate>
      </DashboardFrame>
    </ConvexClientProvider>
  );
}
