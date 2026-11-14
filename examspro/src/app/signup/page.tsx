import SharedSignupPage from '@/components/auth/SharedSignupPage';
import { USERS_API } from '@/lib/api';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function SignupPage() {
  return (
    <MotionRise>
      <SharedSignupPage 
        brandTitle="ExamsPRO"
        brandSubtitle="RESULTSPRO EDU SUITE"
        appName="ExamsPRO"
        appDescription="Join the Ultimate CBT Practice Platform for Nigerian Students"
        redirectPath="/dashboard"
        signupEndpoint={`${USERS_API}/api/v1/auth/signup`}
      />
    </MotionRise>
  );
}
