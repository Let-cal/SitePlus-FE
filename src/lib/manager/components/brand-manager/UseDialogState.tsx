"use client";

import { useCallback, useEffect, useState } from "react";

export function useDialogState(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  // Hàm mở dialog
  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Hàm đóng dialog với xử lý đặc biệt cho body styles
  const closeDialog = useCallback(() => {
    // Đặt timeout để đảm bảo các styles được reset sau khi dialog đóng
    setTimeout(() => {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    }, 10);

    setIsOpen(false);
  }, []);

  // Hàm toggle dialog
  const toggleDialog = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Hàm xử lý onOpenChange từ Dialog component
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        closeDialog();
      } else {
        openDialog();
      }
    },
    [closeDialog, openDialog]
  );

  // Đảm bảo reset body styles khi component unmount
  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  return {
    isOpen,
    openDialog,
    closeDialog,
    toggleDialog,
    handleOpenChange,
  };
}
