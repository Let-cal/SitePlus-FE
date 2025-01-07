import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import AdminService from "@/services/client-role/client.service";
import axios from "axios";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useState } from "react";
interface EditProfileDialogProps {
  initialName: string;
  initialEmail: string;
  userId: number;
  onProfileUpdate: () => void;
  asTrigger: boolean;
  children?: React.ReactNode;
}

export function EditProfileDialog({
  initialName,
  initialEmail,
  userId,
  onProfileUpdate,
  asTrigger,
  children,
}: EditProfileDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await AdminService.updateUserProfile({
        id: userId,
        name,
        email,
      });
      enqueueSnackbar("Your profile have edited !!!", {
        variant: "success",
        preventDuplicate: true,
        anchorOrigin: {
          horizontal: "left",
          vertical: "bottom",
        },
      });
      onProfileUpdate();
      setIsOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific error
        const errorMessages = error.response?.data?.["error-messages"] || [
          "An error occurred. Please try again.",
        ];
        errorMessages.forEach((message) => {
          enqueueSnackbar(`Error: ${message}`, {
            variant: "error",
            anchorOrigin: { horizontal: "left", vertical: "bottom" },
            preventDuplicate: true,
          });
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {asTrigger ? (
        <DialogTrigger asChild>
          {children || (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Edit Profile
            </Button>
          )}
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
