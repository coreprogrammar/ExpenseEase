import React, { useState } from 'react';

function PDFUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [finalizing, setFinalizing] = useState(false);

  // 1) File selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setParsedData([]);
    setErrorMessage('');
  };

  // 2) Upload to parse PDF
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('statement', selectedFile);

      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('You must be logged in to upload PDFs.');
        setUploading(false);
        return;
      }

      const res = await fetch('http://localhost:5000/api/pdf/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        setErrorMessage(errData.error || 'Error parsing PDF');
      } else {
        const data = await res.json();
        setParsedData(data.transactions || []);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not upload or parse PDF');
    } finally {
      setUploading(false);
    }
  };

  // 3) Inline editing for each transaction row
  const handleInputChange = (idx, field, value) => {
    const updated = [...parsedData];
    updated[idx] = {
      ...updated[idx],
      [field]: value,
    };
    setParsedData(updated);
  };

  // 4) Remove a single transaction row
  const handleRemove = (idx) => {
    const updated = parsedData.filter((_, i) => i !== idx);
    setParsedData(updated);
  };

  // 5) Confirm all => finalize in DB
  const handleConfirmAll = async () => {
    if (!parsedData.length) return;
    setFinalizing(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Please log in to finalize transactions.');
        setFinalizing(false);
        return;
      }

      const res = await fetch('http://localhost:5000/api/pdf/finalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ transactions: parsedData }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setErrorMessage(errData.error || 'Error finalizing transactions');
      } else {
        alert('Transactions finalized successfully!');
        setParsedData([]);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not finalize transactions');
    } finally {
      setFinalizing(false);
    }
  };

  // 6) Cancel all => discard parsed data
  const handleCancelAll = () => {
    setParsedData([]);
    setErrorMessage('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Upload PDF Statement (Inline Edit + Confirm)
      </h2>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="file:mr-2 file:py-1 file:px-3 file:border-0 file:bg-gray-200 file:text-sm file:cursor-pointer
                     text-sm rounded-md block
                     focus:ring-2 focus:ring-indigo-300"
        />
        {selectedFile && (
          <p className="text-sm text-gray-600">File: {selectedFile.name}</p>
        )}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className={`px-4 py-2 mt-2 sm:mt-0 rounded-md text-white font-semibold 
                      ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {uploading ? 'Processing...' : 'Submit PDF'}
        </button>
      </div>

      {uploading && (
        <div className="flex items-center justify-center mb-4">
          <div className="inline-block w-5 h-5 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
          <span className="text-indigo-600 font-semibold text-sm">Parsing PDF...</span>
        </div>
      )}

      {errorMessage && (
        <p className="text-red-600 text-center mb-4">{errorMessage}</p>
      )}

      {parsedData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-center">
            Review &amp; Edit Transactions
          </h3>
          <table className="table-auto w-auto mx-auto border border-gray-300 divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Post Date</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {parsedData.map((tx, idx) => (
                <tr key={idx} className="whitespace-normal">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={tx.transDate || ''}
                      onChange={(e) => handleInputChange(idx, 'transDate', e.target.value)}
                      className="border border-gray-300 rounded-md text-sm px-2 py-1
                                 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-24"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={tx.postDate || ''}
                      onChange={(e) => handleInputChange(idx, 'postDate', e.target.value)}
                      className="border border-gray-300 rounded-md text-sm px-2 py-1
                                 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-24"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={tx.description || ''}
                      onChange={(e) => handleInputChange(idx, 'description', e.target.value)}
                      className="border border-gray-300 rounded-md text-sm px-2 py-1
                                 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-48"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={tx.category || ''}
                      onChange={(e) => handleInputChange(idx, 'category', e.target.value)}
                      className="border border-gray-300 rounded-md text-sm px-2 py-1
                                 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-36"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={tx.amount || ''}
                      onChange={(e) => handleInputChange(idx, 'amount', parseFloat(e.target.value) || 0)}
                      className="border border-gray-300 rounded-md text-sm px-2 py-1
                                 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-24"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleRemove(idx)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Button Row: Confirm All + Cancel side by side */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleConfirmAll}
              disabled={finalizing}
              className={`px-4 py-2 rounded-md text-white font-semibold
                          ${finalizing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {finalizing ? 'Finalizing...' : 'Confirm All'}
            </button>

            {/* Cancel discards all parsed data before finalizing */}
            <button
              onClick={handleCancelAll}
              disabled={finalizing}
              className={`px-4 py-2 rounded-md text-white font-semibold
                          ${finalizing ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PDFUpload;
