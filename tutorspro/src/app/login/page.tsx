import SharedLoginPage from '@/components/auth/SharedLoginPage';
import { MotionRise } from '@/components/ScrollRiseProvider';
import { USERS_API } from '@/lib/api';

export default function LoginPage() {
  return (
    <MotionRise>
      <SharedLoginPage 
        brandTitle="TutorsPRO"
        brandSubtitle="RESULTSPRO EDU SUITE"
        appName="TutorsPRO"
        appId="tutorspro-app-id"
        appDescription="The Ultimate Platform for Tutors and Students"
        redirectPath="/dashboard"
        loginEndpoint={`${USERS_API}/api/v1/auth/login`}
      />
    </MotionRise>
  );
}
