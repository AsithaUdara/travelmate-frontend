"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/solid';

export const WelcomeAIPrompt = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="absolute top-6 right-6 z-20"
    >
      <div className="p-4 bg-white rounded-xl shadow-2xl max-w-sm border">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
                <SparklesIcon className="h-6 w-6 text-blue-600"/>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Your AI-Powered Outline is Ready!</h3>
            <p className="text-sm text-slate-600 mt-1">
              We've created a balanced route for you. **Click any day in the sidebar** to see details and discover more AI recommendations for that location.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};