import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload01, CheckCircle } from '@/lib/hugeicons-compat';
import { InlineLoadingSpinner } from '@/components/LoadingSpinner';
import Navigation from '@/components/Navigation';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

interface LocationState {
  schoolId?: string;
  schoolName?: string;
  documentsSubmitted?: boolean;
}

const SchoolVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [documentType, setDocumentType] = useState<'CAC' | 'UTILITY_BILL'>('CAC');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const schoolId = state?.schoolId || localStorage.getItem('schoolId') || '';
  const schoolName = state?.schoolName || localStorage.getItem('schoolName') || 'Your School';

  // Check if documents have already been submitted (from login response or localStorage)
  useEffect(() => {
    if (state?.documentsSubmitted) {
      // Documents already submitted, redirect to pending verification
      navigate('/auth/pending-verification', {
        state: {
          schoolId,
          schoolName,
        },
      });
    }
  }, [state?.documentsSubmitted, schoolId, schoolName, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/png', 'image/jpeg', 'application/pdf'].includes(file.type)) {
        setError('Please upload a PNG, JPEG, or PDF file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setDocumentFile(file);
      setError('');

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview('📄');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!documentFile) {
      setError('Please upload a document');
      return;
    }

    if (!schoolId) {
      setError('School ID not found. Please login again.');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload document to S3 via backend
      const uploadFormData = new FormData();
      uploadFormData.append('document', documentFile);
      uploadFormData.append('schoolId', schoolId);
      uploadFormData.append('documentType', documentType);

      const uploadResponse = await axios.post(`${API_BASE}/auth/upload-document`, uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!uploadResponse.data.success) {
        setError('Failed to upload document');
        setLoading(false);
        return;
      }

      const documentUrl = uploadResponse.data.data.documentUrl;

      // Step 2: Submit verification with the S3 URL
      const submitResponse = await axios.post(`${API_BASE}/auth/submit-verification-documents`, {
        schoolId,
        documentType,
        documentUrl,
      });

      if (submitResponse.data.success) {
        setSuccess(true);
        // Store verification submission for the pending page
        localStorage.setItem('verificationSubmitted', 'true');
        localStorage.setItem('verificationSubmittedTime', new Date().toISOString());

        // Redirect to pending verification page after 2 seconds
        setTimeout(() => {
          navigate('/auth/pending-verification', {
            state: {
              schoolId,
              schoolName,
              documentType,
            },
          });
        }, 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorCode = err.response?.data?.code;
        const errorMessage = err.response?.data?.message || 'Failed to submit verification documents';

        // If school status is still PENDING_VERIFICATION, email may not be verified yet
        if (errorCode === 'INVALID_STATUS' && errorMessage.includes('PENDING_VERIFICATION')) {
          // Redirect to email verification
          navigate('/auth/verify-email', {
            state: { email: schoolId, fromLogin: true },
          });
          return;
        }

        setError(errorMessage);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col">
      <Navigation />

      {/* Verification Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-12 lg:px-20 overflow-hidden bg-black pt-20 pb-20">
          {/* Background Image */}
          <img
            src="/Hero.png"
            className="absolute h-full w-full object-cover inset-0"
            alt="Background"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

          <div className="relative z-10 max-w-md mx-auto text-center w-full">
            <h1 className="text-5xl md:text-6xl font-bold mb-2 tracking-tight leading-tight text-white">
              School Verification
            </h1>
            <p className="text-gray-400 text-sm mb-12">
              Submit documents to verify <span className="text-blue-400 font-semibold">{schoolName}</span>
            </p>

            {/* Verification Card */}
            <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-8 shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)]">
              {success ? (
                <div className="space-y-4 py-12">
                  <div className="flex justify-center">
                    <CheckCircle className="w-16 h-16 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Documents Submitted!</h2>
                  <p className="text-gray-400 text-sm">
                    Redirecting to verification status...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Document Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3 text-left">
                      Document Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'CAC' as const, label: 'CAC' },
                        { value: 'UTILITY_BILL' as const, label: 'Utility Bill' }
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setDocumentType(value)}
                          className={`py-3 px-4 rounded-[12px] font-medium transition-all duration-200 text-sm ${
                            documentType === value
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-left">
                      {documentType === 'CAC'
                        ? 'Upload your Certificate of Incorporation or Registration'
                        : 'Upload a recent utility bill with your school address'}
                    </p>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label htmlFor="document" className="block text-sm font-medium text-gray-300 mb-3 text-left">
                      Upload Document
                    </label>
                    <div className="relative">
                      <input
                        id="document"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/png,image/jpeg,application/pdf"
                        className="hidden"
                        disabled={loading}
                      />
                      <label
                        htmlFor="document"
                        className={`flex flex-col items-center justify-center w-full p-6 rounded-[15px] border-2 border-dashed transition-all cursor-pointer ${
                          documentFile
                            ? 'border-green-500/50 bg-green-500/5'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="text-center">
                          {preview ? (
                            <>
                              {preview.startsWith('data:') ? (
                                <img
                                  src={preview}
                                  alt="Preview"
                                  className="w-16 h-16 mx-auto mb-2 rounded object-cover"
                                />
                              ) : (
                                <div className="text-4xl mx-auto mb-2">{preview}</div>
                              )}
                              <p className="text-sm text-gray-300 font-medium truncate">
                                {documentFile?.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {(documentFile!.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </>
                          ) : (
                            <>
                              <Upload01 className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                              <p className="text-sm text-gray-300 font-medium">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PNG, JPEG or PDF (max 5MB)
                              </p>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 rounded-[12px] bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Info Box */}
                  <div className="p-4 rounded-[12px] bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm">
                    ℹ️ Your documents will be reviewed within 60 minutes
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !documentFile}
                    className="w-full py-4 rounded-[15px] font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 border shadow-[0_1px_3px_0_rgba(199,220,255,0.35)_inset,0_0_20px_0_rgba(198,204,255,0.20)_inset,0_1px_22px_0_rgba(255,255,255,0.10),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] hover:bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <InlineLoadingSpinner size="sm" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Documents</span>
                        <Upload01 className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
    </div>
  );
};

export default SchoolVerification;
