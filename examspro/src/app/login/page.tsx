import SharedLoginPage from '@/components/auth/SharedLoginPage';
import { USERS_API } from '@/lib/api';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function LoginPage() {
  return (
    <MotionRise>
      <SharedLoginPage 
        brandTitle="ExamsPRO"
        brandSubtitle="RESULTSPRO EDU SUITE"
        appName="ExamsPRO"
        appId="examspro-app-id"
        appDescription="The Ultimate CBT Practice Platform for Nigerian Students"
        redirectPath="/dashboard"
        loginEndpoint={`${USERS_API}/api/v1/auth/login`}
      />
    </MotionRise>
  );
}
