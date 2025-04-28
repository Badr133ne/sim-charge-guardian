
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";
import useStore from "@/lib/store";
import { toast } from "sonner";

export default function SimAccessFeature() {
  const { fetchRealSimBalance, currentSimId } = useStore();
  
  const handleReadBalance = async () => {
    if (!currentSimId) {
      toast.error("Please select a SIM card first");
      return;
    }

    // Check if we're running in a mobile environment
    if (typeof window !== 'undefined' && !window.matchMedia('(max-width: 768px)').matches) {
      toast.error("This feature only works on mobile devices");
      return;
    }

    try {
      await fetchRealSimBalance();
    } catch (error) {
      toast.error("Failed to read SIM balance. Make sure you're on a mobile device with proper permissions.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Real SIM</CardTitle>
        <CardDescription>Read actual SIM card balance</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This feature reads the actual balance from your physical SIM card.
          It requires a mobile device with appropriate permissions.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleReadBalance} 
          className="w-full" 
          variant="outline"
          disabled={!currentSimId}
        >
          <Smartphone className="mr-2 h-4 w-4" />
          Read SIM Balance
        </Button>
      </CardFooter>
    </Card>
  );
}
