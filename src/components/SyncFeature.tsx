
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sync } from "lucide-react";
import { toast } from "sonner";

export default function SyncFeature() {
  const handleSync = () => {
    toast.info("Sync feature is in development. This will import recharge records from SMS or connect to an API in the future.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync Data</CardTitle>
        <CardDescription>Import recharge data from SMS messages or API</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Coming soon: Automatically import your recharge history from SMS messages or connect to your telecom provider's API.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSync} className="w-full" variant="outline">
          <Sync className="mr-2 h-4 w-4" />
          Sync Recharge Data
        </Button>
      </CardFooter>
    </Card>
  );
}
