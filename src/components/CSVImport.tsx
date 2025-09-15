"use client";

import { useState } from "react";
import Papa from "papaparse";

export default function CSVImport() {
  const [errors, setErrors] = useState<any[]>([]);
  const [success, setSuccess] = useState<number | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results: any) {
        const response = await fetch("/api/buyers/import", {
          method: "POST",
          body: JSON.stringify(results.data),
          headers: { "Content-Type": "application/json" },
        });
        const res = await response.json();
        if (response.ok) {
          setSuccess(res.inserted);
          setErrors([]);
        } else {
          setErrors(res.errors || [{ row: "-", message: res.error }]);
        }
      },
    });
  };

  return (
    <div className="mb-6  w-xs p-4 border-2 border-dotted  rounded bg-gray-100 ">
      <h2 className="text-s font-bold mb-2">Import CSV</h2>
      <input type="file" accept=".csv" onChange={handleFile} className="mb-2" />
      {success && <p className="text-green-600">{success} rows imported successfully!</p>}
      {errors.length > 0 && (
        <div className="mt-2 max-h-64 overflow-auto border p-2 rounded bg-red-50">
          <h3 className="font-semibold text-red-600">Errors:</h3>
          <ul className="text-red-600">
            {errors.map((err) => (
              <li key={err.row}>
                Row {err.row}: {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
