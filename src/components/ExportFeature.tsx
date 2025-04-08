
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";
import useStore from "@/lib/store";

export default function ExportFeature() {
  const { currentSimId, recharges, simCards } = useStore();

  const handleExportCSV = () => {
    if (!currentSimId) {
      toast.error("Please select a SIM card first");
      return;
    }

    try {
      // Filter recharges for current SIM
      const simRecharges = recharges.filter(r => r.simId === currentSimId);
      const currentSim = simCards.find(sim => sim.id === currentSimId);
      
      if (simRecharges.length === 0) {
        toast.error("No recharge data to export");
        return;
      }

      // Create CSV content
      const csvHeader = "Date,Time,Operation ID,Amount (DA),User 1,User 2\n";
      const csvContent = simRecharges.map(recharge => {
        return `${recharge.date},${recharge.time},"${recharge.operationId}",${recharge.amount},${recharge.forUser1 ? "Yes" : "No"},${recharge.forUser2 ? "Yes" : "No"}`;
      }).join("\n");

      const csv = csvHeader + csvContent;
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `sim-recharges-${currentSim?.number || currentSimId}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CSV file exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  const handleShareByEmail = () => {
    if (!currentSimId) {
      toast.error("Please select a SIM card first");
      return;
    }

    const currentSim = simCards.find(sim => sim.id === currentSimId);
    const simName = currentSim ? currentSim.name : "Unknown SIM";
    const simNumber = currentSim ? currentSim.number : "";

    const subject = encodeURIComponent(`SIM Recharge Summary for ${simName}`);
    const body = encodeURIComponent(`Here is my SIM recharge summary for ${simName} (${simNumber}).`);
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    toast.success("Email client opened");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
        <CardDescription>Export or share your recharge data</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Export your recharge history or share a summary via email.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button onClick={handleExportCSV} className="w-full" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
        <Button onClick={handleShareByEmail} className="w-full" variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Share by Email
        </Button>
      </CardFooter>
    </Card>
  );
}
