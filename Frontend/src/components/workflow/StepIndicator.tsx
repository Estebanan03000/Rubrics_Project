import React from "react";

export interface StepItem {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: StepItem[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="mb-6 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center gap-4">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <div key={step.number} className="flex flex-1 items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  isActive || isCompleted
                    ? "bg-primary text-white"
                    : "bg-gray-2 text-gray-500 dark:bg-meta-4"
                }`}
              >
                {step.number}
              </div>

              <span
                className={`text-sm font-medium ${
                  isActive ? "text-primary" : "text-black dark:text-white"
                }`}
              >
                {step.label}
              </span>

              {index < steps.length - 1 && (
                <div className="hidden h-[1px] flex-1 bg-stroke dark:bg-strokedark md:block" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;