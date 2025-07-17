"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TriangleAlert } from "lucide-react";

export function DeleteAccountDialog() {
  const { user, deleteAccount } = useAuth();
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const isConfirmationMatch = confirmationText === user?.email;

  const handleDelete = async () => {
    if (!isConfirmationMatch) return;
    
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast({
        title: "Account Deleted",
        description: "Your account and all associated data have been permanently removed.",
      });
      // The auth provider will redirect the user upon successful deletion.
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error.message || "Could not delete your account. Please try again.",
      });
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <TriangleAlert className="h-6 w-6 text-destructive" />
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-2">
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-2">
            <Label htmlFor="email-confirmation">Please type <span className="font-bold text-foreground">{user?.email}</span> to confirm.</Label>
            <Input 
                id="email-confirmation" 
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Enter your email"
            />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            asChild
            className="bg-destructive hover:bg-destructive/90"
          >
            <Button
              onClick={handleDelete}
              disabled={!isConfirmationMatch || isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              I understand, delete my account
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
