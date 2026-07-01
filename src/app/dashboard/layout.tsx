import ConvexClientProvider from "@/components/ConvexClientProvider";
import { DashboardAuthGate, DashboardFrame } from "@/components/layouts/dashboard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClientProvider>
      <DashboardFrame>
        <DashboardAuthGate>{children}</DashboardAuthGate>
      </DashboardFrame>
    </ConvexClientProvider>
  );
}
