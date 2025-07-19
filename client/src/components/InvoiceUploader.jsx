import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, Loader2, CheckCircle2, XCircle, FileText } from 'lucide-react';

function InvoiceUploader() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setUploadStatus('');
      setAnalysis(null);
    } else {
      setUploadStatus('Only PDF files are allowed.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

 const handleUpload = async () => {
  if (!file) {
    setUploadStatus('Please select a PDF file.');
    return;
  }

  const formData = new FormData();
  formData.append('invoice', file);

  try {
    setIsUploading(true);
    setUploadStatus('Uploading...');
    const response = await axios.post('http://localhost:3000/api/invoice/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const currentAnalysis = response.data.aiAnalysis;
    setUploadStatus('Upload successful!');
    setAnalysis(currentAnalysis);

    const existing = JSON.parse(localStorage.getItem('invoiceAnalysis')) || [];
    const updated = [...existing, currentAnalysis];
    localStorage.setItem('invoiceAnalysis', JSON.stringify(updated));
    
  } catch (error) {
    console.error('Upload failed:', error);
    setUploadStatus('Upload failed.');
  } finally {
    setIsUploading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4 py-8">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-3xl p-8 space-y-6 transition-all">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <UploadCloud className="w-6 h-6 text-blue-600" />
          Upload Invoice (PDF)
        </h2>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center border-2 ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-dashed border-blue-300'
          } rounded-xl p-6 cursor-pointer transition-colors`}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={handleInputChange}
            className="hidden"
            id="fileInput"
          />

          {file ? (
            <div className="flex items-center gap-2 text-blue-700 font-medium">
              <FileText className="w-5 h-5" />
              {file.name}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p className="font-medium text-gray-600">Click or drag PDF here to upload</p>
              <p className="text-sm mt-1">Only PDF files are supported.</p>
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`w-full py-3 text-white font-semibold rounded-xl transition ${
            isUploading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading and Analyzing....
            </span>
          ) : (
            'Upload & Analyze'
          )}
        </button>

        {uploadStatus && (
          <p
            className={`text-sm ${
              uploadStatus.includes('successful')
                ? 'text-green-600'
                : uploadStatus.includes('failed') || uploadStatus.includes('PDF')
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          >
            {uploadStatus}
          </p>
        )}

        {analysis && (
          <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Invoice Analysis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Merchant Name</span>
                <p className="text-gray-800 font-medium">{analysis.merchantName}</p>
              </div>
              <div>
                <span className="text-gray-500">Total Amount</span>
                <p className="text-gray-800 font-medium">₹{analysis.totalAmount}</p>
              </div>
              <div>
                <span className="text-gray-500">Date of Spend</span>
                <p className="text-gray-800 font-medium">{analysis.dateOfSpend}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Authentic</span>
                <span className={`font-semibold flex items-center gap-1 ${analysis.isAuthentic ? "text-green-600" : "text-red-600"}`}>
                  {analysis.isAuthentic ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Yes
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      No
                    </>
                  )}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-gray-500 block mb-1 font-medium">Reason</span>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{analysis.reason}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvoiceUploader;
