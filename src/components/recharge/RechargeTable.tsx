
import React from "react";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Recharge } from "@/types";
import useStore from "@/lib/store";
import { toast } from "sonner";

interface RechargeTableProps {
  recharges: Recharge[];
  onEdit: (recharge: Recharge) => void;
}

export default function RechargeTable({ recharges, onEdit }: RechargeTableProps) {
  const { deleteRecharge } = useStore();

  const handleDeleteRecharge = (id: string) => {
    if (confirm("Are you sure you want to delete this recharge?")) {
      deleteRecharge(id);
      toast.success("Recharge deleted successfully");
    }
  };

  return (
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
                    onClick={() => onEdit(recharge)}
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
  );
}
