
import React from "react";
import SimSelector from "./SimSelector";
import RechargeHistory from "./RechargeHistory";
import SimBalance from "./SimBalance";
import SyncFeature from "./SyncFeature";
import ExportFeature from "./ExportFeature";

export default function DashboardLayout() {
  return (
    <div className="container py-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">SIM Recharge Manager</h1>
        <SimSelector />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <RechargeHistory />
        </div>
        <div className="space-y-6">
          <SimBalance />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
            <SyncFeature />
            <ExportFeature />
          </div>
        </div>
      </div>
    </div>
  );
}
