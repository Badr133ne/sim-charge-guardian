
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Edit, Trash, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useStore from "@/lib/store";
import { toast } from "sonner";
import { Recharge } from "@/types";

export default function RechargeHistory() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentRecharge, setCurrentRecharge] = useState<Recharge | null>(null);

  const { currentSimId, getRechargesBySimAndDate, getTotalsByDate, addRecharge, updateRecharge, deleteRecharge } = useStore();
  
  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
  const recharges = currentSimId ? getRechargesBySimAndDate(currentSimId, formattedDate) : [];
  const { total, user1Total, user2Total } = currentSimId ? getTotalsByDate(currentSimId, formattedDate) : { total: 0, user1Total: 0, user2Total: 0 };

  const [formData, setFormData] = useState({
    time: "",
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

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentSimId || !selectedDate) {
      toast.error("Please select a SIM card and date first");
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
      setAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to add recharge");
      console.error(error);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
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
      setEditDialogOpen(false);
      setCurrentRecharge(null);
    } catch (error) {
      toast.error("Failed to update recharge");
      console.error(error);
    }
  };

  const handleEditClick = (recharge: Recharge) => {
    setCurrentRecharge(recharge);
    setFormData({
      time: recharge.time,
      operationId: recharge.operationId,
      amount: recharge.amount.toString(),
      forUser1: recharge.forUser1,
      forUser2: recharge.forUser2,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteRecharge = (id: string) => {
    if (confirm("Are you sure you want to delete this recharge?")) {
      deleteRecharge(id);
      toast.success("Recharge deleted successfully");
    }
  };

  const handleAddClick = () => {
    resetForm();
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Operation ID / Via</TableHead>
              <TableHead className="text-right">Amount (DA)</TableHead>
              <TableHead>User 1</TableHead>
              <TableHead>User 2</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recharges.length > 0 ? (
              recharges.map((recharge) => (
                <TableRow key={recharge.id}>
                  <TableCell>{recharge.time}</TableCell>
                  <TableCell>{recharge.operationId}</TableCell>
                  <TableCell className="text-right font-medium">{recharge.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Checkbox checked={recharge.forUser1} disabled />
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={recharge.forUser2} disabled />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(recharge)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRecharge(recharge.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No recharges found for this date
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex justify-between w-full">
          <span className="font-medium">User 1 Total:</span>
          <span>{user1Total.toFixed(2)} DA</span>
        </div>
        <div className="flex justify-between w-full">
          <span className="font-medium">User 2 Total:</span>
          <span>{user2Total.toFixed(2)} DA</span>
        </div>
        <div className="flex justify-between w-full">
          <span className="font-medium">Total Recharged:</span>
          <span className="font-semibold">{total.toFixed(2)} DA</span>
        </div>
      </CardFooter>

      {/* Add Recharge Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Recharge</DialogTitle>
            <DialogDescription>
              Enter the details for the recharge transaction
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
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

      {/* Edit Recharge Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Recharge</DialogTitle>
            <DialogDescription>
              Update the details for this recharge
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
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
    </Card>
  );
}
