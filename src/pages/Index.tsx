
import { useEffect } from "react";
import SimCardSetup from "@/components/SimCardSetup";
import DashboardLayout from "@/components/DashboardLayout";
import useStore from "@/lib/store";

const Index = () => {
  const { simCards } = useStore();

  useEffect(() => {
    document.title = "SIM Recharge Manager";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {simCards.length === 0 ? <SimCardSetup /> : <DashboardLayout />}
    </div>
  );
};

export default Index;
