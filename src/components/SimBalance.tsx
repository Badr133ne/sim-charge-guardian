
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus, Save } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useStore from "@/lib/store";
import { SimBalance as SimBalanceType, SimService } from "@/types";
import { toast } from "sonner";

export default function SimBalance() {
  const [open, setOpen] = useState(false);
  const { currentSimId, getSimBalance, updateSimBalance, getTotalsByDate, getUndeclaredDifference } = useStore();
  
  const today = format(new Date(), "yyyy-MM-dd");
  const balance = currentSimId ? getSimBalance(currentSimId) : null;
  const undeclaredDifference = currentSimId ? getUndeclaredDifference(currentSimId, today) : null;
  
  const [formData, setFormData] = useState<{
    credit: string;
    validityDate: Date | undefined;
    services: SimService[];
  }>({
    credit: balance?.credit.toString() || "",
    validityDate: balance?.validityDate ? new Date(balance.validityDate) : undefined,
    services: balance?.services || [],
  });

  const [newService, setNewService] = useState<{
    name: string;
    minutes: string;
    data: string;
    sms: string;
    details: string;
    expiryDate: Date | undefined;
  }>({
    name: "",
    minutes: "",
    data: "",
    sms: "",
    details: "",
    expiryDate: undefined,
  });

  const handleOpenDialog = () => {
    if (balance) {
      setFormData({
        credit: balance.credit.toString(),
        validityDate: balance.validityDate ? new Date(balance.validityDate) : undefined,
        services: [...balance.services],
      });
    } else {
      setFormData({
        credit: "",
        validityDate: undefined,
        services: [],
      });
    }
    setOpen(true);
  };

  const handleAddService = () => {
    if (!newService.name || !newService.expiryDate) {
      toast.error("Service name and expiry date are required");
      return;
    }

    const service: SimService = {
      name: newService.name,
      minutes: newService.minutes ? parseInt(newService.minutes) : undefined,
      data: newService.data ? parseInt(newService.data) : undefined,
      sms: newService.sms ? parseInt(newService.sms) : undefined,
      details: newService.details,
      expiryDate: format(newService.expiryDate, "yyyy-MM-dd"),
    };

    setFormData({
      ...formData,
      services: [...formData.services, service],
    });

    // Reset new service form
    setNewService({
      name: "",
      minutes: "",
      data: "",
      sms: "",
      details: "",
      expiryDate: undefined,
    });

    toast.success("Service added");
  };

  const handleRemoveService = (index: number) => {
    const newServices = [...formData.services];
    newServices.splice(index, 1);
    setFormData({
      ...formData,
      services: newServices,
    });
    toast.success("Service removed");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentSimId) {
      toast.error("No SIM card selected");
      return;
    }

    try {
      const creditValue = parseFloat(formData.credit);
      if (isNaN(creditValue)) {
        toast.error("Please enter a valid credit amount");
        return;
      }

      if (!formData.validityDate) {
        toast.error("Please select a validity date");
        return;
      }

      const balanceData: SimBalanceType = {
        credit: creditValue,
        validityDate: format(formData.validityDate, "yyyy-MM-dd"),
        services: formData.services,
      };

      updateSimBalance(currentSimId, balanceData);
      toast.success("Balance updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update balance");
      console.error(error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>SIM Balance</CardTitle>
          <CardDescription>Current balance and available services</CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleOpenDialog}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Update Balance</span>
        </Button>
      </CardHeader>
      <CardContent>
        {balance ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Credit:</span>
              <span className="font-bold text-lg">{balance.credit.toFixed(2)} DA</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Valid until:</span>
              <span>{new Date(balance.validityDate).toLocaleDateString()}</span>
            </div>
            
            {balance.services.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Available Services:</h4>
                <div className="space-y-3">
                  {balance.services.map((service, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{service.name}</span>
                        <span className="text-sm text-muted-foreground">
                          until {new Date(service.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{service.details}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        {service.minutes !== undefined && (
                          <span>{service.minutes} min</span>
                        )}
                        {service.data !== undefined && (
                          <span>{service.data} GB</span>
                        )}
                        {service.sms !== undefined && (
                          <span>{service.sms} SMS</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No balance information available</p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={handleOpenDialog}
            >
              Add Balance Details
            </Button>
          </div>
        )}
      </CardContent>
      {undeclaredDifference !== null && (
        <CardFooter className="border-t pt-4">
          <div className="w-full flex justify-between items-center">
            <span className="font-medium">Undeclared Difference:</span>
            <span className={cn(
              "font-bold",
              undeclaredDifference < 0 ? "text-destructive" : "text-brand-green"
            )}>
              {undeclaredDifference.toFixed(2)} DA
            </span>
          </div>
        </CardFooter>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update SIM Balance</DialogTitle>
            <DialogDescription>
              Enter your current SIM balance and available services
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="credit">Credit Balance (DA)</Label>
                <Input
                  id="credit"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.credit}
                  onChange={(e) => setFormData({ ...formData, credit: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="validityDate">Valid Until</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="validityDate"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.validityDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.validityDate ? (
                        format(formData.validityDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.validityDate}
                      onSelect={(date) => setFormData({ ...formData, validityDate: date })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Services List */}
              <div className="space-y-4">
                <Label>Available Services</Label>
                {formData.services.length > 0 ? (
                  <div className="space-y-2">
                    {formData.services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between border p-3 rounded-md">
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {service.details}
                          </div>
                          <div className="flex gap-2 text-sm">
                            {service.minutes !== undefined && (
                              <span>{service.minutes} min</span>
                            )}
                            {service.data !== undefined && (
                              <span>{service.data} GB</span>
                            )}
                            {service.sms !== undefined && (
                              <span>{service.sms} SMS</span>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveService(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No services added yet</p>
                )}
              </div>

              {/* Add New Service */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2">Add New Service</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="serviceName">Service Name</Label>
                      <Input
                        id="serviceName"
                        placeholder="e.g., Dima"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceExpiryDate">Expiry Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="serviceExpiryDate"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newService.expiryDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newService.expiryDate ? (
                              format(newService.expiryDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={newService.expiryDate}
                            onSelect={(date) => setNewService({ ...newService, expiryDate: date })}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="serviceMinutes">Minutes</Label>
                      <Input
                        id="serviceMinutes"
                        type="number"
                        placeholder="e.g., 100"
                        value={newService.minutes}
                        onChange={(e) => setNewService({ ...newService, minutes: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceData">Data (GB)</Label>
                      <Input
                        id="serviceData"
                        type="number"
                        placeholder="e.g., 8"
                        value={newService.data}
                        onChange={(e) => setNewService({ ...newService, data: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceSms">SMS</Label>
                      <Input
                        id="serviceSms"
                        type="number"
                        placeholder="e.g., 120"
                        value={newService.sms}
                        onChange={(e) => setNewService({ ...newService, sms: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceDetails">Details</Label>
                    <Input
                      id="serviceDetails"
                      placeholder="e.g., illimité Ooredoo H24"
                      value={newService.details}
                      onChange={(e) => setNewService({ ...newService, details: e.target.value })}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleAddService}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-brand-green hover:bg-brand-green-dark">
                <Save className="mr-2 h-4 w-4" />
                Save Balance
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
