
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import useStore from "@/lib/store";
import { Recharge } from "@/types";

import RechargeTable from "./RechargeTable";
import RechargeTotals from "./RechargeTotals";
import { AddRechargeDialog } from "./AddRechargeDialog";
import { EditRechargeDialog } from "./EditRechargeDialog";

export default function RechargeHistory() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentRecharge, setCurrentRecharge] = useState<Recharge | null>(null);

  const { currentSimId, getRechargesBySimAndDate, getTotalsByDate } = useStore();
  
  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
  const recharges = currentSimId ? getRechargesBySimAndDate(currentSimId, formattedDate) : [];
  const { total, user1Total, user2Total } = currentSimId ? getTotalsByDate(currentSimId, formattedDate) : { total: 0, user1Total: 0, user2Total: 0 };

  const handleEditClick = (recharge: Recharge) => {
    setCurrentRecharge(recharge);
    setEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recharge History</CardTitle>
        <CardDescription>View and manage your SIM card recharges</CardDescription>
        <div className="flex items-center justify-between">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <Button
            onClick={handleAddClick}
            className="bg-brand-green hover:bg-brand-green-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Recharge
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <RechargeTable 
          recharges={recharges}
          onEdit={handleEditClick}
        />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <RechargeTotals 
          user1Total={user1Total} 
          user2Total={user2Total} 
          total={total} 
        />
      </CardFooter>

      <AddRechargeDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        currentSimId={currentSimId}
        formattedDate={formattedDate}
      />

      <EditRechargeDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        currentRecharge={currentRecharge}
        setCurrentRecharge={setCurrentRecharge}
      />
    </Card>
  );
}
