
import React from "react";
import SimSelector from "./SimSelector";
import SimBalance from "./SimBalance";
import RechargeHistory from "./recharge/RechargeHistory"; // Updated import path
import SyncFeature from "./SyncFeature";
import ExportFeature from "./ExportFeature";
import { Toaster } from "sonner";

const DashboardLayout = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">SIM Recharge Manager</h1>
          <SimSelector />
        </header>

        <div className="grid md:grid-cols-7 gap-6">
          <div className="md:col-span-5">
            <RechargeHistory />
          </div>
          <div className="md:col-span-2 space-y-6">
            <SimBalance />
            <SyncFeature />
            <ExportFeature />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
