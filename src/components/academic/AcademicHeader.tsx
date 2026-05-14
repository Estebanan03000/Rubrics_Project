import React from "react";

interface AcademicHeaderProps {
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const AcademicHeader: React.FC<AcademicHeaderProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>

      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default AcademicHeader;