"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-6 text-red-600">
      <h2 className="font-bold">Something went wrong</h2>
      <p>{error.message}</p>
      <button
        onClick={reset}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
