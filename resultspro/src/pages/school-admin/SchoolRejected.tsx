import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Mail, ArrowRight, Info, CheckCircle } from 'lucide-react';

const SchoolRejected: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If user tries to access this page without being rejected, redirect to login
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      navigate('/auth/login', { replace: true });
      return;
    }

    try {
      const user = JSON.parse(userJson);
      if (user.school?.status !== 'REJECTED') {
        navigate('/school-admin/overview', { replace: true });
      }
    } catch (error) {
      navigate('/auth/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/auth/login', { replace: true });
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@resultspro.ng?subject=School Account Rejection Appeal';
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="max-w-2xl w-full z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-red-500/20 p-6 rounded-full border border-red-500/30">
              <AlertCircle size={48} className="text-red-400" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">Application Rejected</h1>
          <p className="text-gray-400 text-lg">
            We regret to inform you that your school's application has been rejected.
          </p>
        </div>

        {/* Details Box */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 mb-8 backdrop-blur">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-3">
                <AlertCircle size={24} className="text-red-400" />
                What This Means
              </h3>
              <p className="text-gray-300 ml-11">
                Your school account has been reviewed and determined to not meet our current requirements. You will not have access to the Results Pro platform features.
              </p>
            </div>

            <div className="border-t border-gray-700/30 pt-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-3">
                <Info size={24} className="text-blue-400" />
                Next Steps
              </h3>
              <ul className="text-gray-300 ml-11 space-y-2">
                <li className="flex gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Contact our support team to understand the reasons for rejection</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Provide additional documentation or corrections if applicable</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Submit an appeal if you believe this decision was made in error</span>
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-700/30 pt-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-3">
                <CheckCircle size={24} className="text-green-400" />
                Your Account
              </h3>
              <p className="text-gray-300 ml-11">
                Your account and data are preserved. If your application is reconsidered and approved in the future, you'll be able to access the platform again.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleContactSupport}
            className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Mail size={20} />
            <span>Contact Support</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-gray-700 hover:border-gray-600"
          >
            Logout
          </button>
        </div>

        {/* Support Info */}
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm">
            For assistance, please email{' '}
            <a
              href="mailto:support@resultspro.ng"
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              support@resultspro.ng
            </a>{' '}
            or contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SchoolRejected;
