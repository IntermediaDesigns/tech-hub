import React, { useState } from 'react';

export default function VideoShare() {
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) {
      setError('Please enter a video URL.');
      return;
    }
    // Reset error if URL is valid
    setError(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Share a Video</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter video URL"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          type="submit"
          className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Share Video
        </button>
      </form>
    </div>
  );
}
