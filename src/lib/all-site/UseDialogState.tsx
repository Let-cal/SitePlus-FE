"use client";
import { useCallback, useEffect, useState } from "react";

// Biến toàn cục để đếm số lượng dialog đang mở
let openDialogCount = 0;

export function useDialogState(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const openDialog = useCallback(() => {
    setIsOpen(true);
    openDialogCount += 1;
    if (openDialogCount === 1) {
      document.body.style.pointerEvents = "auto"; // Vẫn cho phép tương tác
      document.body.style.overflow = "hidden"; // Chỉ khóa scroll
    }
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    openDialogCount = Math.max(0, openDialogCount - 1);
    if (openDialogCount === 0) {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    }
  }, []);

  const toggleDialog = useCallback(() => {
    if (isOpen) {
      closeDialog();
    } else {
      openDialog();
    }
  }, [isOpen, openDialog, closeDialog]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        openDialog();
      } else {
        closeDialog();
      }
    },
    [openDialog, closeDialog]
  );

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (isOpen) {
        openDialogCount = Math.max(0, openDialogCount - 1);
        if (openDialogCount === 0) {
          document.body.style.pointerEvents = "auto";
          document.body.style.overflow = "auto";
        }
      }
    };
  }, [isOpen]);

  return {
    isOpen,
    openDialog,
    closeDialog,
    toggleDialog,
    handleOpenChange,
  };
}
