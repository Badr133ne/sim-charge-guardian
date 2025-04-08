
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, MessageSquare, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import useStore from "@/lib/store";
import { parseRechargeSms } from "@/utils/smsParser";

export default function SyncFeature() {
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentSimId, addRecharge } = useStore();

  const handleSmsPermission = async () => {
    // Check if running on a browser environment
    if (typeof navigator === "undefined" || !navigator.permissions) {
      toast.error("SMS permissions are only available on mobile devices");
      return false;
    }

    try {
      // Check if we're on Android (SMS permissions not available on iOS)
      const isAndroid = /android/i.test(navigator.userAgent);
      
      if (!isAndroid) {
        toast("SMS auto-detection only works on Android devices", {
          icon: <AlertCircle className="h-4 w-4" />
        });
        return false;
      }

      // This is a placeholder for actual permission request
      // In a real implementation, you would use Capacitor/Cordova plugins
      toast.info("This would request SMS permissions on a real Android device");
      return true;
    } catch (error) {
      console.error("Error requesting permissions:", error);
      toast.error("Could not request SMS permissions");
      return false;
    }
  };

  const handleAutoSyncToggle = async (enabled: boolean) => {
    if (enabled) {
      const hasPermission = await handleSmsPermission();
      if (hasPermission) {
        setAutoSyncEnabled(true);
        toast.success("Auto-sync enabled. The app will now monitor for recharge SMS");
      } else {
        setAutoSyncEnabled(false);
      }
    } else {
      setAutoSyncEnabled(false);
      toast.info("Auto-sync disabled");
    }
  };

  const handleSync = async () => {
    if (!currentSimId) {
      toast.error("Please select a SIM card first");
      return;
    }

    setIsLoading(true);
    toast.info("Scanning for recharge SMS messages...");

    setTimeout(() => {
      // This is a demo implementation
      // In a real app, this would use Capacitor/Cordova plugins to read SMS
      
      const mockSms = "Vous avez reçu une recharge de 1,800 DA. ID: 240191615748. Merci pour votre fidélité.";
      
      try {
        const parsedData = parseRechargeSms(mockSms);
        
        if (parsedData.amount && parsedData.operationId) {
          // Get current date in YYYY-MM-DD format
          const today = new Date().toISOString().split('T')[0];
          const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
          
          // Add the recharge to history
          addRecharge({
            simId: currentSimId,
            amount: parsedData.amount,
            operationId: parsedData.operationId,
            time: currentTime,
            date: today,
            forUser1: false,
            forUser2: false,
          });
          
          toast.success(`Imported recharge: ${parsedData.amount} DA`);
        } else {
          toast.info("No recharge data detected in recent messages");
        }
      } catch (error) {
        console.error("Error parsing SMS:", error);
        toast.error("Could not process SMS data");
      } finally {
        setIsLoading(false);
      }
    }, 2000); // Simulate processing time
  };

  const handlePasteSms = () => {
    // Implementation for iOS where direct SMS reading isn't possible
    const smsText = prompt("Paste your recharge SMS here:");
    
    if (!smsText) return;
    if (!currentSimId) {
      toast.error("Please select a SIM card first");
      return;
    }

    try {
      const parsedData = parseRechargeSms(smsText);
      
      if (parsedData.amount && parsedData.operationId) {
        // Get current date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        
        // Add the recharge to history
        addRecharge({
          simId: currentSimId,
          amount: parsedData.amount,
          operationId: parsedData.operationId,
          time: currentTime,
          date: today,
          forUser1: false,
          forUser2: false,
        });
        
        toast.success(`Extracted recharge: ${parsedData.amount} DA`);
      } else {
        toast.error("Could not extract recharge data from SMS text");
      }
    } catch (error) {
      console.error("Error parsing SMS:", error);
      toast.error("Could not process SMS text");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync Data</CardTitle>
        <CardDescription>Import recharge data from SMS messages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-sync"
            checked={autoSyncEnabled}
            onCheckedChange={handleAutoSyncToggle}
          />
          <Label htmlFor="auto-sync">Auto-detect recharge SMS</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          {autoSyncEnabled 
            ? "The app will automatically detect and import recharge data from incoming SMS messages" 
            : "Enable auto-sync to automatically detect recharge SMS messages"}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          onClick={handleSync} 
          className="w-full" 
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Scanning SMS..." : "Sync Recharge Data"}
        </Button>
        <Button onClick={handlePasteSms} className="w-full" variant="outline">
          <MessageSquare className="mr-2 h-4 w-4" />
          Paste SMS Text
        </Button>
      </CardFooter>
    </Card>
  );
}
