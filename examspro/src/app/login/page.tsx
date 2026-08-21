import SharedLoginPage from '@/components/auth/SharedLoginPage';

export default function LoginPage() {
  return (
    <SharedLoginPage 
      brandTitle="ExamsPRO"
      brandSubtitle="RESULTSPRO EDU SUITE"
      appName="ExamsPRO"
      appDescription="The Ultimate CBT Practice Platform for Nigerian Students"
      redirectPath="/dashboard"
    />
  );
}
