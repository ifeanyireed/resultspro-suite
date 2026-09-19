import SharedSignupPage from '@/components/auth/SharedSignupPage';
import { USERS_API } from '@/lib/api';

export default function SignupPage() {
  return (
    <SharedSignupPage 
      brandTitle="TutorsPRO"
      brandSubtitle="RESULTSPRO EDU SUITE"
      appName="TutorsPRO"
      appDescription="Join the Ultimate Platform for Tutors and Students"
      redirectPath="/dashboard"
      signupEndpoint={`${USERS_API}/api/v1/auth/signup`}
    />
  );
}
