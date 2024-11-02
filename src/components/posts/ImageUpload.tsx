import React, { useState } from 'react';

interface ImageUploadProps {
  onUpload: (file: File) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Limit to 5MB
        setError('File size must be less than 5MB.');
        return;
      }
      setError(null);
      onUpload(file);
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700" htmlFor="imageUpload">
        Upload Image
      </label>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
