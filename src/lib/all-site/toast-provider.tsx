// src/components/ui/toast-provider.tsx
import * as React from "react";
import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#333",
          color: "#fff",
        },
        success: {
          style: {
            background: "green",
          },
          iconTheme: {
            primary: "white",
            secondary: "green",
          },
        },
        error: {
          style: {
            background: "red",
          },
          iconTheme: {
            primary: "white",
            secondary: "red",
          },
        },
        duration: 4000,
        className: "toast-message",
      }}
    />
  );
};

// src/lib/utils/toast.ts
import toast from "react-hot-toast";

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 5000,
    });
  },
  error: (message: string) => {
    toast.error(message);
  },
  loading: (message: string) => {
    return toast.loading(message);
  },
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },
};
