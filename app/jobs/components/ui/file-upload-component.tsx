"use client";

import { ChangeEvent, useState } from "react";

interface FileUploadProps {
  name: string;
  label: string;
  required?: boolean;
  accept?: string;
  value: File | null;
  onChange: (file: File | null) => void;
}

export function FileUpload({
  name,
  label,
  required = false,
  accept = ".pdf,.doc,.docx",
  value,
  onChange,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm text-gray-900 mb-2 font-medium">
        {label} {required && <span className="text-blue-600">*</span>}
      </label>
      <div
        className="relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          name={name}
          accept={accept}
          required={required}
          onChange={handleFileChange}
          className="absolute opacity-0 w-full h-full cursor-pointer z-10"
        />
        <div
          className={`flex flex-col items-center justify-center p-8 border rounded cursor-pointer transition-all text-center ${
            value
              ? "bg-blue-50 border-blue-600"
              : isDragging
              ? "bg-blue-50 border-blue-600"
              : "bg-gray-50 border-gray-200 hover:border-blue-600 hover:bg-blue-50"
          }`}
        >
          {value ? (
            <>
              <div className="text-sm text-gray-900 font-semibold mb-1">
                ✓ {value.name}
              </div>
              <span className="text-sm text-gray-600">
                File selected ({(value.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </>
          ) : (
            <>
              <div className="text-sm text-gray-900 font-semibold mb-1">
                {isDragging ? "Drop file here" : `Drop your ${label.toLowerCase()} here or click to browse`}
              </div>
              <span className="text-sm text-gray-600">
                {accept.toUpperCase().replace(/\./g, "").replace(/,/g, ", ")} (max 10MB)
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}