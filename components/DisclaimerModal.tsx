'use client'
import React from 'react';
import { AlertTriangle, HandCoins } from 'lucide-react';
import { motion } from "framer-motion";
import Portal from "./Portal";

interface WaitlistModalProps {
 text: React.ReactNode;
  onClose: () => void;
}
const DisclaimerModal = ({ onClose,text }: WaitlistModalProps) => {
  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="bg-white rounded-lg p-8 w-full container relative z-60"
          onClick={(e) => e.stopPropagation()}
        ><div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 mb-4">
          <AlertTriangle className="w-6 h-6" />
          <h2 className="text-xl sm:text-2xl font-bold">Important Notice</h2>
        </div>

          <div className="text-center text-sm sm:text-base leading-relaxed mb-6">
          {text}
        </div>

        {/* Footer */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
          >
            <HandCoins className="w-5 h-5" />
            I Understand
          </button>
        </div>
        </motion.div>
      </motion.div>
    </Portal>
  );
};

export default DisclaimerModal;
