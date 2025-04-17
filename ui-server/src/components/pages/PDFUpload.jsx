// src/pages/PDFUpload.jsx
import React, { useState } from "react";

const PDFUpload = () => {
  /* ───────── state ───────── */
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading,    setUploading   ] = useState(false);
  const [parsedData,   setParsedData  ] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [finalizing,   setFinalizing  ] = useState(false);

  /* ───────── handlers ───────── */
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0] ?? null);
    setParsedData([]);
    setErrorMessage("");
  };

  /* ---------- 1. upload & parse ---------- */
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to upload PDFs.");

      const formData = new FormData();
      formData.append("statement", selectedFile);

      const res = await fetch("http://localhost:5000/api/pdf/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error parsing PDF");

      setParsedData(data.transactions || []);
    } catch (err) {
      setErrorMessage(err.message || "Could not upload or parse PDF.");
    } finally {
      setUploading(false);
    }
  };

  /* ---------- inline edit helpers ---------- */
  const handleInputChange = (idx, field, value) => {
    setParsedData((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleRemove = (idx) =>
    setParsedData((prev) => prev.filter((_, i) => i !== idx));

  /* ---------- 2. confirm / cancel ---------- */
  const handleConfirmAll = async () => {
    if (!parsedData.length) return;
    setFinalizing(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in to finalize transactions.");

      const res = await fetch("http://localhost:5000/api/pdf/finalize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transactions: parsedData }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error finalizing transactions");

      alert("Transactions finalized successfully!");
      setParsedData([]);
      setSelectedFile(null);
    } catch (err) {
      setErrorMessage(err.message || "Could not finalize transactions.");
    } finally {
      setFinalizing(false);
    }
  };

  const handleCancelAll = () => {
    setParsedData([]);
    setSelectedFile(null);
    setErrorMessage("");
  };

  /* ───────── UI ───────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-start justify-center py-10 font-sans">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-8">

        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-1">
          PDF Statement Uploader
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Upload, review &amp; import transactions seamlessly
        </p>

        {/* Upload box */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8
                        border-2 border-dashed border-indigo-300 rounded-xl p-6
                        hover:border-indigo-400 transition">
          <input
            id="fileInput"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="flex-1 cursor-pointer px-6 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg
                       border border-indigo-200 text-indigo-600 font-medium text-sm text-center transition"
          >
            {selectedFile ? "Change PDF" : "Select PDF"}
          </label>

          {selectedFile && (
            <span className="flex-1 text-sm truncate text-gray-700">
              {selectedFile.name}
            </span>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`px-6 py-3 rounded-lg text-white text-sm font-semibold shadow transition
                        ${uploading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {uploading ? "Processing…" : "Parse PDF"}
          </button>
        </div>

        {/* Spinner */}
        {uploading && (
          <div className="flex justify-center items-center mb-6">
            <span className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-indigo-600 font-medium">Reading file…</span>
          </div>
        )}

        {/* Error */}
        {errorMessage && (
          <p className="text-center text-red-600 mb-6">{errorMessage}</p>
        )}

        {/* Table */}
        {parsedData.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-center mb-4">
              Review &amp; Edit Transactions
            </h3>

            <div className="overflow-auto rounded-lg shadow-inner">
              <table className="min-w-full text-sm">
                <thead className="bg-indigo-50">
                  {["Date","Post Date","Description","Category","Amount",""]
                    .map((h)=>(<th key={h} className="px-4 py-3 font-semibold text-left text-indigo-700">{h}</th>))}
                </thead>
                <tbody>
                  {parsedData.map((tx, idx) => (
                    <tr key={idx} className="even:bg-gray-50">
                      {["transDate","postDate","description","category"].map((field)=>(
                        <td key={field} className="px-4 py-2">
                          <input
                            type="text"
                            value={tx[field] ?? ""}
                            onChange={(e)=>handleInputChange(idx, field, e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-2 py-1
                                       focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </td>
                      ))}
                      {/* amount */}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={tx.amount ?? ""}
                          onChange={(e)=>handleInputChange(idx,"amount",parseFloat(e.target.value)||0)}
                          className="w-28 border border-gray-300 rounded-md px-2 py-1
                                     focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={()=>handleRemove(idx)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm transition"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Confirm / Cancel */}
            <div className="flex justify-center gap-6 mt-6">
              <button
                onClick={handleConfirmAll}
                disabled={finalizing}
                className={`px-6 py-3 rounded-lg font-semibold text-white shadow transition
                            ${finalizing
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"}`}
              >
                {finalizing ? "Saving…" : "Confirm All"}
              </button>
              <button
                onClick={handleCancelAll}
                disabled={finalizing}
                className={`px-6 py-3 rounded-lg font-semibold text-white shadow transition
                            ${finalizing
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600"}`}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PDFUpload;
