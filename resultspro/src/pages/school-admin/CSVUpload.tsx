import React, { useState } from 'react';
import { Upload01, File, AlertCircle } from '@/lib/hugeicons-compat';

const CSVUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0].name);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">CSV Upload</h2>
        <p className="text-gray-400 text-sm mt-1">Upload result files in CSV format for bulk import</p>
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`bg-[rgba(255,255,255,0.02)] rounded-[30px] border-2 border-dashed transition-all ${
          dragActive
            ? 'border-blue-400 bg-blue-500/5'
            : 'border-[rgba(255,255,255,0.1)]'
        } p-12`}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <Upload01 className="w-12 h-12 text-blue-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Drag & Drop Your CSV File</h3>
          <p className="text-gray-400 text-sm mb-6">or click to browse</p>
          <button className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-blue-400 font-medium transition-colors">
            Select File
          </button>
          <p className="text-gray-500 text-xs mt-6">Supported format: .csv (Maximum 10MB)</p>
        </div>
      </div>

      {uploadedFile && (
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-green-400/20 p-6">
          <div className="flex items-center gap-4">
            <File className="w-8 h-8 text-green-400" />
            <div className="flex-1">
              <p className="text-white font-medium">{uploadedFile}</p>
              <p className="text-gray-400 text-sm">Ready for preview and validation</p>
            </div>
            <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded-lg text-green-400 font-medium transition-colors">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Templates and Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
          <h3 className="text-lg font-semibold text-white mb-6">CSV Format Guide</h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-blue-400 font-semibold">1.</span>
              <span className="text-gray-400">Include headers: Student ID, Name, Class, Subject, Score</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400 font-semibold">2.</span>
              <span className="text-gray-400">One result per row</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400 font-semibold">3.</span>
              <span className="text-gray-400">Scores must be numeric (0-100)</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400 font-semibold">4.</span>
              <span className="text-gray-400">Save as UTF-8 encoding</span>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
          <h3 className="text-lg font-semibold text-white mb-6">Download Template</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
              <File className="w-5 h-5 text-blue-400" />
              <div className="text-left flex-1">
                <p className="text-white text-sm font-medium">Results Template</p>
                <p className="text-gray-500 text-xs">results_template.csv</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="bg-[rgba(255,255,255,0.02)] rounded-[30px] border border-[rgba(255,255,255,0.07)] p-8">
        <h3 className="text-lg font-semibold text-white mb-6">Recent Uploads</h3>
        <div className="space-y-3">
          {[
            { name: 'SS3A_Results_2025.csv', date: '2 hours ago', rows: 42, status: 'success' },
            { name: 'SS2B_Results_2025.csv', date: '1 day ago', rows: 40, status: 'success' },
          ].map((upload, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-white/5 hover:bg-white/5">
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white text-sm font-medium">{upload.name}</p>
                  <p className="text-gray-500 text-xs">{upload.date}</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">{upload.rows} rows</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CSVUpload;
