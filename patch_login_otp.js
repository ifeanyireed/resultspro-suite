const fs = require('fs');
const path = 'coursespro/src/app/[tenant]/login/LoginForm.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add states
const statesCode = `  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);`;

content = content.replace("  const [error, setError] = useState('');", statesCode);

// 2. Update handleLogin catch block
const handleLoginCatch = `    } catch (err: any) {
      console.error("Login failed", err);
      if (err.response?.status === 403 && err.response?.data?.error === "unverified") {
        setShowOTP(true);
        setError('');
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Login failed');
      }
    } finally {`;

content = content.replace(/    \} catch \(err: any\) \{[\s\S]*?\} finally \{/, handleLoginCatch);

// 3. Add OTP Form rendering
const otpForm = `        <div className="w-full max-w-md">
          {showOTP ? (
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Verify Your Email</h2>
                <p className="text-slate-500 text-sm">
                  We've sent a 6-digit verification code to <span className="font-semibold text-slate-700">{email}</span>.
                </p>
              </div>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                setVerificationLoading(true);
                setError('');
                try {
                  const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
                  await axios.post(\`\${USERS_API}/api/v1/auth/verify-email\`, { token: otp });
                  // Automatically log them in now
                  handleLogin(new Event('submit') as any);
                } catch (err: any) {
                  setError(err.response?.data?.error || "Invalid OTP");
                  setVerificationLoading(false);
                }
              }} className="space-y-6">
                {error && <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Verification Code</label>
                  <input 
                    type="text" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-center text-2xl tracking-[0.5em] px-4 py-4 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none" 
                    placeholder="------" 
                    maxLength={6}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={verificationLoading || otp.length < 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                >
                  {verificationLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-10">`;

content = content.replace(/        <div className="w-full max-w-md">\s*\{\/\* Header \*\/\}\s*<div className="mb-10">/, otpForm);

// 4. Close the showOTP ternary at the bottom
const closeTernary = `              <p className="text-center text-sm text-slate-500 mt-8">
                Don't have an account?{' '}
                <Link href={\`/\${tenant?.slug}/signup\`} className="text-blue-600 font-semibold hover:underline">
                  Create Account
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}`;

content = content.replace(/              <p className="text-center text-sm text-slate-500 mt-8">\s*Don't have an account\?\{' '\}\s*<Link href=\{`\/\$\{tenant\?\.slug\}\/signup`\} className="text-blue-600 font-semibold hover:underline">\s*Create Account\s*<\/Link>\s*<\/p>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/, closeTernary);

fs.writeFileSync(path, content);
