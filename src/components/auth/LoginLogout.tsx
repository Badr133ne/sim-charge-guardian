
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, LogOut } from "lucide-react";
import useStore from "@/lib/store";
import { toast } from "sonner";

export default function LoginLogout() {
  const { user, login, logout, isLoggedIn } = useStore();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || username.trim().length < 2) {
      toast.error("Please enter a valid username (at least 2 characters)");
      return;
    }
    
    login(username.trim());
    setOpen(false);
    setUsername("");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {isLoggedIn() ? (
        <div className="flex items-center gap-2">
          <span className="text-sm mr-2">
            Hello, <span className="font-medium">{user?.username}</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setOpen(true)}
        >
          <LogIn className="h-4 w-4" />
          <span>Login</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              Enter your username to access the app
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="col-span-3"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Login</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
