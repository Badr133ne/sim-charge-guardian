
import React, { useState, useEffect } from "react";
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
import { Recharge } from "@/types";
import { RechargeFormData } from "./types";

interface EditRechargeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRecharge: Recharge | null;
  setCurrentRecharge: (recharge: Recharge | null) => void;
}

export function EditRechargeDialog({
  open,
  onOpenChange,
  currentRecharge,
  setCurrentRecharge,
}: EditRechargeDialogProps) {
  const { updateRecharge } = useStore();
  
  const [formData, setFormData] = useState<RechargeFormData>({
    time: "",
    operationId: "",
    amount: "",
    forUser1: false,
    forUser2: false,
  });

  // Update form when currentRecharge changes
  useEffect(() => {
    if (currentRecharge) {
      setFormData({
        time: currentRecharge.time,
        operationId: currentRecharge.operationId,
        amount: currentRecharge.amount.toString(),
        forUser1: currentRecharge.forUser1,
        forUser2: currentRecharge.forUser2,
      });
    }
  }, [currentRecharge]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentRecharge) {
      return;
    }

    try {
      const amountValue = parseFloat(formData.amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      updateRecharge(currentRecharge.id, {
        time: formData.time,
        operationId: formData.operationId,
        amount: amountValue,
        forUser1: formData.forUser1,
        forUser2: formData.forUser2,
      });

      toast.success("Recharge updated successfully");
      onOpenChange(false);
      setCurrentRecharge(null);
    } catch (error) {
      toast.error("Failed to update recharge");
      console.error(error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setCurrentRecharge(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Recharge</DialogTitle>
          <DialogDescription>
            Update the details for this recharge
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-time">Time</Label>
              <Input
                id="edit-time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-operationId">Operation ID / Via</Label>
              <Input
                id="edit-operationId"
                placeholder="e.g., Card, Cash, Transfer"
                value={formData.operationId}
                onChange={(e) => setFormData({ ...formData, operationId: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount (DA)</Label>
              <Input
                id="edit-amount"
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
                  id="edit-forUser1"
                  checked={formData.forUser1}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, forUser1: !!checked })
                  }
                />
                <Label htmlFor="edit-forUser1">User 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-forUser2"
                  checked={formData.forUser2}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, forUser2: !!checked })
                  }
                />
                <Label htmlFor="edit-forUser2">User 2</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-brand-green hover:bg-brand-green-dark">
              Update Recharge
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
