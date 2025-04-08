
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SimCard as SimCardType } from "@/types";
import useStore from "@/lib/store";
import { toast } from "sonner";
import { Smartphone } from "lucide-react";

export default function SimCardSetup() {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const { addSimCard, simCards } = useStore();

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
    } catch (error) {
      toast.error("Failed to add SIM card");
      console.error(error);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="h-6 w-6 text-brand-green" />
          <CardTitle>Welcome to SIM Recharge Manager</CardTitle>
        </div>
        <CardDescription>
          Get started by adding your first SIM card
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sim-number">SIM Card Number</Label>
            <Input 
              id="sim-number" 
              placeholder="e.g., 056XXXXXXX" 
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sim-name">SIM Name (Optional)</Label>
            <Input
              id="sim-name"
              placeholder="e.g., Personal SIM"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-brand-green hover:bg-brand-green-dark">
            Add SIM Card
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
