import SharedSignupPage from '@/components/auth/SharedSignupPage';
import { MotionRise } from '@/components/ScrollRiseProvider';
import { USERS_API } from '@/lib/api';

export default function SignupPage() {
  return (
    <MotionRise>
      <SharedSignupPage 
        brandTitle="TutorsPRO"
        brandSubtitle="RESULTSPRO EDU SUITE"
        appName="TutorsPRO"
        appDescription="Join the Ultimate Platform for Tutors and Students"
        redirectPath="/dashboard"
        signupEndpoint={`${USERS_API}/api/v1/auth/signup`}
      />
    </MotionRise>
  );
}
