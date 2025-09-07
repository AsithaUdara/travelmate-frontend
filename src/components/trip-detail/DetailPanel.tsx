"use client";
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';

type DetailPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export const DetailPanel = ({ isOpen, onClose, title, children }: DetailPanelProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 right-0 h-full w-[450px] bg-white border-l shadow-2xl z-20 flex flex-col"
        >
          <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
            <h2 className="font-bold text-lg truncate pr-4">{title}</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100"><XMarkIcon className="h-5 w-5"/></button>
          </div>
          <div className="flex-grow overflow-y-auto p-6">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
