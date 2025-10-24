"use client"
import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";

// 💡 A type alias for product content is helpful, even if it's 'any' for now.
// Replace 'any' with your actual Product type if you have one.
type ProductContent = any | null; 

interface ModalContextType {
  isModalOpen: boolean;
  modalContent: ProductContent; // <-- 1. Add content state to the type
  openModal: () => void;
  closeModal: () => void;
  setModalContent: (item: ProductContent) => void; // <-- 2. Add the setter function
}

// Set initial content to null/undefined
const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a QuickViewModalProvider");
  }
  return context;
};

// 💡 Renamed to QuickViewModalProvider for clarity/consistency
export const QuickViewModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 3. Define state for the actual product content
  const [modalContent, setModalContent] = useState<ProductContent>(null); 

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Optional: Reset content on close to ensure next open is fresh
    setModalContent(null); 
  };
  
  // Use useMemo to prevent unnecessary re-renders
  const value = useMemo(() => ({
    isModalOpen,
    modalContent,
    openModal,
    closeModal,
    setModalContent, // <-- 4. Pass the setter function in the context value
  }), [isModalOpen, modalContent]);

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};