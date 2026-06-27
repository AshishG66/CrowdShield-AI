import AppLayout from "@/components/layout/AppLayout";
import { EventLifecycleProvider } from "@/context/EventLifecycleContext";
import { SimulationController } from "@/components/simulation/SimulationController";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EventLifecycleProvider>
      <AppLayout>
        <SimulationController />
        {children}
      </AppLayout>
    </EventLifecycleProvider>
  );
}
