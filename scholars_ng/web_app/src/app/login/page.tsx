import SharedLoginPage from '@/components/auth/SharedLoginPage';

export default function PortalPage() {
  return (
    <SharedLoginPage 
      brandTitle="scholars_ng"
      brandSubtitle="RESULTSPRO EDU SUITE"
      appName="scholars_ng"
      appDescription="The Unified Portal for Students, Parents, Teachers, and Admins"
      redirectPath="/portal/dashboard"
    />
  );
}
