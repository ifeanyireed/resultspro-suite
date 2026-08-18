import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '@/components/SuperAdminLayout';
import { CheckCircle, XClose, FileText, Phone01, Mail, MapPin, Calendar, ChevronDown, ChevronUp, AlertCircle } from '@/lib/hugeicons-compat';
import { Phone, XCircle } from '@/lib/hugeicons-compat';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

interface DocumentData {
  documentType: string;
  documentUrl: string;
  uploadedAt: string;
}

interface SchoolVerification {
  id: string;
  schoolName: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  documents: DocumentData[];
  status: 'PENDING_VERIFICATION';
}

const SchoolVerifications: React.FC = () => {
  const [schools, setSchools] = useState<SchoolVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSchoolId, setExpandedSchoolId] = useState<string | null>(null);
  const [approvalLoading, setApprovalLoading] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchPendingSchools();
  }, []);

  const fetchPendingSchools = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('❌ No authentication token found in localStorage');
        setLoading(false);
        return;
      }
      
      console.log('🔍 Fetching pending schools with token:', token?.substring(0, 20) + '...');
      
      const response = await axios.get(`${API_BASE}/super-admin/schools/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('📊 API Response:', response.data);
      
      if (response.data.success) {
        console.log('✅ Schools fetched:', response.data.data.length);
        
        // Log document URLs to see if they contain presigned signatures
        response.data.data.forEach((school: any) => {
          if (school.documents && school.documents.length > 0) {
            school.documents.forEach((doc: any) => {
              console.log(`   School: ${school.schoolName}`);
              console.log(`   Document Type: ${doc.documentType}`);
              console.log(`   URL length: ${doc.documentUrl.length}`);
              console.log(`   Has X-Amz-Signature: ${doc.documentUrl.includes('X-Amz-Signature')}`);
              console.log(`   URL preview: ${doc.documentUrl.substring(0, 100)}...`);
            });
          }
        });
        
        setSchools(response.data.data);
      }
    } catch (error: any) {
      console.error('❌ Error fetching pending schools:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (schoolId: string) => {
    try {
      setApprovalLoading(schoolId);
      const response = await axios.post(
        `${API_BASE}/super-admin/schools/${schoolId}/approve`,
        { remarks: 'Documents verified and approved' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (response.data.success) {
        setActionStatus({ ...actionStatus, [schoolId]: 'approved' });
        setTimeout(() => {
          setSchools(schools.filter(s => s.id !== schoolId));
          setActionStatus({ ...actionStatus, [schoolId]: '' });
        }, 1500);
      }
    } catch (error) {
      console.error('Error approving school:', error);
      setActionStatus({ ...actionStatus, [schoolId]: 'error' });
    } finally {
      setApprovalLoading(null);
    }
  };

  const handleReject = async (schoolId: string) => {
    try {
      setApprovalLoading(schoolId);
      const response = await axios.post(
        `${API_BASE}/super-admin/schools/${schoolId}/reject`,
        { reason: 'Documents verification failed' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      if (response.data.success) {
        setActionStatus({ ...actionStatus, [schoolId]: 'rejected' });
        setTimeout(() => {
          setSchools(schools.filter(s => s.id !== schoolId));
          setActionStatus({ ...actionStatus, [schoolId]: '' });
        }, 1500);
      }
    } catch (error) {
      console.error('Error rejecting school:', error);
      setActionStatus({ ...actionStatus, [schoolId]: 'error' });
    } finally {
      setApprovalLoading(null);
    }
  };

  const handleViewDocument = async (documentUrl: string) => {
    try {
      console.log('📄 handleViewDocument called');
      console.log('   URL length:', documentUrl.length);
      console.log('   URL starts with:', documentUrl.substring(0, 80));
      console.log('   Contains X-Amz-Signature:', documentUrl.includes('X-Amz-Signature'));
      console.log('   Contains X-Amz-Algorithm:', documentUrl.includes('X-Amz-Algorithm'));
      console.log('   Is S3 URL:', documentUrl.includes('s3') && documentUrl.includes('amazonaws'));
      
      // If it's an S3 URL (with or without presigning), open directly
      // S3 presigned URLs are self-contained and don't need backend intervention
      if ((documentUrl.includes('s3') && documentUrl.includes('amazonaws')) ||
          documentUrl.includes('X-Amz-Signature') || 
          documentUrl.includes('X-Amz-Algorithm')) {
        console.log('✓ URL appears to be valid S3/presigned URL, opening directly');
        window.open(documentUrl, '_blank');
        return;
      }

      // If URL doesn't look like an S3 URL, try to get presigned URL from backend
      console.log('⚠️ URL does not appear to be an S3 URL, calling backend endpoint');
      
      const response = await axios.get(`${API_BASE}/auth/document-url`, {
        params: {
          documentUrl,
        },
      });

      if (response.data.success && response.data.data.presignedUrl) {
        console.log('✓ Backend returned presigned URL, opening...');
        window.open(response.data.data.presignedUrl, '_blank');
      } else {
        console.log('⚠️ Backend response unexpected, trying original URL');
        window.open(documentUrl, '_blank');
      }
    } catch (error: any) {
      console.error('❌ Error viewing document:', error);
      console.error('   Error message:', error.message);
      console.error('   Response status:', error.response?.status);
      console.error('   Response data:', error.response?.data);
      
      // Show user-friendly error
      const errorMsg = error.response?.data?.message || error.message || 'Failed to view document';
      
      if (errorMsg.includes('Document not found') || errorMsg.includes('NoSuchKey')) {
        alert('❌ Document not found in storage. It may have been deleted or never uploaded successfully. Please ask the school to re-upload the document.');
      } else if (errorMsg.includes('presigned URL')) {
        alert('❌ Could not generate access link for this document. Please try again.');
      } else {
        alert(`❌ Error: ${errorMsg}`);
      }
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'CAC': 'Corporate Affairs Commission',
      'UTILITY_BILL': 'Utility Bill',
      'OTHER': 'Other Documents',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400">Loading pending schools...</div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">School Verifications</h1>
          <p className="text-gray-400">Review and approve pending school registrations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm font-medium">Pending Review</div>
                <div className="text-3xl font-bold text-white mt-2">{schools.length}</div>
              </div>
              <AlertCircle className="w-12 h-12 text-yellow-500/20" />
            </div>
          </div>

          <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm font-medium">Awaiting Documents</div>
                <div className="text-3xl font-bold text-white mt-2">0</div>
              </div>
              <FileText className="w-12 h-12 text-blue-500/20" />
            </div>
          </div>

          <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-400 text-sm font-medium">Action Required</div>
                <div className="text-3xl font-bold text-white mt-2">{schools.length}</div>
              </div>
              <AlertCircle className="w-12 h-12 text-red-500/20" />
            </div>
          </div>
        </div>

        {/* Schools List */}
        <div className="space-y-4">
          {schools.length === 0 ? (
            <div className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">All Schools Verified!</h3>
              <p className="text-gray-400">No pending verifications at this time</p>
            </div>
          ) : (
            schools.map(school => (
              <div
                key={school.id}
                className="relative rounded-[30px] border backdrop-blur-[10px] bg-[rgba(255,255,255,0.02)] border-solid border-[rgba(255,255,255,0.07)] overflow-hidden hover:bg-white/5 transition-all duration-300"
              >
                {/* Main Card */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* School Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3">{school.schoolName}</h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-3 text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{school.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{school.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{school.address}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">Registered: {new Date(school.registrationDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Verification Checklist */}
                      <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                        <h4 className="text-sm font-semibold text-white mb-3">Verification Checklist</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-300">Email verified</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-300">Documents submitted ({school.documents.length})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-300">Awaiting admin review</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expand Button */}
                    <button
                      onClick={() => setExpandedSchoolId(expandedSchoolId === school.id ? null : school.id)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      {expandedSchoolId === school.id ? (
                        <ChevronUp className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Documents Section */}
                {expandedSchoolId === school.id && (
                  <div>
                    <div className="border-t border-white/10" />
                    <div className="p-6 bg-white/5">
                      <h4 className="text-sm font-semibold text-white mb-4">Submitted Documents</h4>
                      
                      <div className="space-y-3 mb-6">
                        {school.documents.map((doc, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-blue-400" />
                              <div>
                                <div className="text-sm font-medium text-white">
                                  {getDocumentTypeLabel(doc.documentType)}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleViewDocument(doc.documentUrl)}
                              className="px-3 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
                            >
                              View
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(school.id)}
                          disabled={approvalLoading === school.id}
                          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                            actionStatus[school.id] === 'approved'
                              ? 'bg-green-500 text-white'
                              : actionStatus[school.id] === 'error'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                          } ${approvalLoading === school.id ? 'opacity-75' : ''}`}
                        >
                          {actionStatus[school.id] === 'approved' ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Approved
                            </>
                          ) : approvalLoading === school.id ? (
                            'Approving...'
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Approve School
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleReject(school.id)}
                          disabled={approvalLoading === school.id}
                          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                            actionStatus[school.id] === 'rejected'
                              ? 'bg-red-500 text-white'
                              : actionStatus[school.id] === 'error'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                          } ${approvalLoading === school.id ? 'opacity-75' : ''}`}
                        >
                          {actionStatus[school.id] === 'rejected' ? (
                            <>
                              <XCircle className="w-4 h-4" />
                              Rejected
                            </>
                          ) : approvalLoading === school.id ? (
                            'Rejecting...'
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              Reject School
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SchoolVerifications;
