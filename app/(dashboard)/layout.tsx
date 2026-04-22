import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Sidebar />
      <main className="ml-[240px] min-h-screen">{children}</main>
    </div>
  );
}
