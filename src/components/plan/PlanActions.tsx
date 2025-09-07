"use client";

import React from 'react';
import { Button } from '../ui/button';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

type PlanActionsProps = {
  currentStepIndex: number; // Use index for easier logic
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  nextButtonText: string;
};

export const PlanActions = ({ currentStepIndex, totalSteps, onNext, onBack, onSkip, nextButtonText }: PlanActionsProps) => {
  const isFirstStep = currentStepIndex === 0;
  
    return (
        <div className="sticky bottom-0 left-0 w-full p-4 bg-white border-t z-20">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Back Button: Shows on all steps except the first */}
                {!isFirstStep && (
                    <Button variant="outline" className="rounded-full flex items-center gap-2" onClick={onBack}>
                        <ArrowLeftIcon className="h-5 w-5" />
                        Back
                    </Button>
                )}
                <div>
                    <span className="font-semibold">Step {currentStepIndex + 1}</span>
                    <span className="text-slate-500"> / {totalSteps}</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {/* Skip Button: Shows on all steps except the first */}
                {!isFirstStep && (
                    <Button variant="ghost" onClick={onSkip} className="font-semibold">Skip for now</Button>
                )}
                                <Button
                                    size="lg"
                                    className="rounded-full inline-flex items-center gap-2 whitespace-nowrap px-6"
                                    onClick={onNext}
                                >
                                    <span className="truncate max-w-[16rem]">{nextButtonText}</span>
                                    <ArrowRightIcon className="h-5 w-5 shrink-0" />
                                </Button>
            </div>
        </div>
    </div>
  );
};