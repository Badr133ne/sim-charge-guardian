
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";
import useStore from "@/lib/store";

export default function SimAccessFeature() {
  const { fetchRealSimBalance, currentSimId } = useStore();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Real SIM</CardTitle>
        <CardDescription>Read actual SIM card balance</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This feature attempts to read the actual balance from your physical SIM card.
          It requires a mobile device with appropriate permissions.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => fetchRealSimBalance()} 
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
