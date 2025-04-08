
import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import useStore from "@/lib/store";
import { RechargeFormData } from "./types";

interface AddRechargeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSimId: string | null;
  formattedDate: string;
}

export function AddRechargeDialog({ 
  open, 
  onOpenChange,
  currentSimId,
  formattedDate
}: AddRechargeDialogProps) {
  const { addRecharge } = useStore();
  
  const [formData, setFormData] = useState<RechargeFormData>({
    time: format(new Date(), "HH:mm"),
    operationId: "",
    amount: "",
    forUser1: false,
    forUser2: false,
  });

  const resetForm = () => {
    setFormData({
      time: format(new Date(), "HH:mm"),
      operationId: "",
      amount: "",
      forUser1: false,
      forUser2: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentSimId) {
      toast.error("Please select a SIM card first");
      return;
    }

    try {
      const amountValue = parseFloat(formData.amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      addRecharge({
        simId: currentSimId,
        date: formattedDate,
        time: formData.time,
        operationId: formData.operationId,
        amount: amountValue,
        forUser1: formData.forUser1,
        forUser2: formData.forUser2,
      });

      toast.success("Recharge added successfully");
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to add recharge");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Recharge</DialogTitle>
          <DialogDescription>
            Enter the details for the recharge transaction
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="operationId">Operation ID / Via</Label>
              <Input
                id="operationId"
                placeholder="e.g., Card, Cash, Transfer"
                value={formData.operationId}
                onChange={(e) => setFormData({ ...formData, operationId: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (DA)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="forUser1"
                  checked={formData.forUser1}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, forUser1: !!checked })
                  }
                />
                <Label htmlFor="forUser1">User 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="forUser2"
                  checked={formData.forUser2}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, forUser2: !!checked })
                  }
                />
                <Label htmlFor="forUser2">User 2</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-brand-green hover:bg-brand-green-dark">
              Add Recharge
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
