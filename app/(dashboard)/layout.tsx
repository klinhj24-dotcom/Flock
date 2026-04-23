import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { OnboardingGate } from "@/components/onboarding/onboarding-gate";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <OnboardingGate />
      <Sidebar />
      <main className="min-h-screen pb-16 md:ml-[240px] md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
