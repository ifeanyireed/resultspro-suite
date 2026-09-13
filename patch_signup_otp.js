const fs = require('fs');
const path = 'coursespro/src/app/[tenant]/signup/SignupForm.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add states and axios
const imports = `import axios from 'axios';
import { Mail, Lock, ArrowRight, Loader2, Sparkles, Building2, Users, ShieldCheck, User } from 'lucide-react';`;

content = content.replace(/import \{ Mail, Lock, ArrowRight, Loader2, Sparkles, Building2, Users, ShieldCheck \} from 'lucide-react';/, imports);

const statesCode = `  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [name, setName] = useState('');`;

content = content.replace("  const [email, setEmail] = useState('');", statesCode + "\n  const [email, setEmail] = useState('');");

// 2. Implement handleSignup
const handleSignupCode = `  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const USERS_API = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
      await axios.post(\`\${USERS_API}/api/v1/auth/register\`, {
        email,
        password,
        first_name: name.split(' ')[0] || '',
        last_name: name.split(' ').slice(1).join(' ') || '',
        tenant_slug: tenant?.slug
      });
      // Signup success -> requires verification
      setShowOTP(true);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };`;

content = content.replace(/  const handleLogin = async \(e: React\.FormEvent\) => \{[\s\S]*?\}, 1500\);\n  \};/, handleSignupCode);

// 3. Add OTP form
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
                  
                  // Now login automatically
                  const res = await axios.post(\`\${USERS_API}/api/v1/auth/login\`, { 
                    email, 
                    password,
                    tenant_slug: tenant?.slug 
                  });
                  const token = res.data.access_token || res.data.token;
                  if (token) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    router.push('/dashboard');
                  }
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
                  {verificationLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-10">`;

content = content.replace(/        <div className="w-full max-w-md">\s*\{\/\* Header \*\/\}\s*<div className="mb-10">/, otpForm);

// 4. Close ternary
const closeTernary = `              <p className="text-center text-sm text-slate-500 mt-8">
                Already have an account?{' '}
                <Link href={\`/\${tenant?.slug}/login\`} className="text-blue-600 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}`;

content = content.replace(/              <p className="text-center text-sm text-slate-500 mt-8">\s*Already have an account\?\{' '\}\s*<Link href=\{`\/\$\{tenant\?\.slug\}\/login`\} className="text-blue-600 font-semibold hover:underline">\s*Sign in\s*<\/Link>\s*<\/p>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/, closeTernary);

// 5. Add name input field and error display
const formTop = `              {error && <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-6">{error}</div>}
              
              <div className="space-y-4 mb-8">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 pl-11 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none" 
                      placeholder="Jane Doe" 
                    />
                  </div>
                </div>

                {/* Email address */}`;

content = content.replace(/              <div className="space-y-4 mb-8">\s*\{\/\* Email address \*\/\}/, formTop);

fs.writeFileSync(path, content);
