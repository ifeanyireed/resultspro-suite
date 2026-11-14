import SharedLoginPage from '@/components/public/SharedLoginPage';
import { MotionRise, MotionStagger } from '@/components/ScrollRiseProvider';

export default function LoginPage() {
  const usersApi = process.env.NEXT_PUBLIC_USERS_API || '';
  
  return (
    <MotionStagger className="w-full">
      <MotionRise>
        <SharedLoginPage 
          appName="Edu Suite"
          appDescription="The Engine Powering Modern Education."
          redirectPath="/overview"
          loginEndpoint={`${usersApi}/api/v1/auth/admin-login`}
        />
      </MotionRise>
    </MotionStagger>
  );
}
