
import React from "react";
import { Check, Plus, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useStore from "@/lib/store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SimSelector() {
  const { simCards, currentSimId, setCurrentSim, addSimCard } = useStore();
  const [open, setOpen] = React.useState(false);
  const [number, setNumber] = React.useState("");
  const [name, setName] = React.useState("");

  const currentSim = simCards.find((sim) => sim.id === currentSimId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!number.trim()) {
      toast.error("Please enter a SIM card number");
      return;
    }

    try {
      const simName = name.trim() || `SIM ${simCards.length + 1}`;
      addSimCard(number.trim(), simName);
      toast.success(`Added SIM card: ${simName}`);
      setNumber("");
      setName("");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to add SIM card");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            {currentSim ? currentSim.name : "Select SIM"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>SIM Cards</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {simCards.map((sim) => (
            <DropdownMenuItem
              key={sim.id}
              onClick={() => setCurrentSim(sim.id)}
              className="flex items-center justify-between"
            >
              <span>{sim.name} ({sim.number})</span>
              {sim.id === currentSimId && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => {
                e.preventDefault();
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add New SIM
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New SIM</DialogTitle>
                <DialogDescription>
                  Enter the details for your new SIM card
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-sim-number">SIM Card Number</Label>
                    <Input
                      id="new-sim-number"
                      placeholder="e.g., 056XXXXXXX"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-sim-name">SIM Name (Optional)</Label>
                    <Input
                      id="new-sim-name"
                      placeholder="e.g., Personal SIM"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-brand-green hover:bg-brand-green-dark">
                    Add SIM Card
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
