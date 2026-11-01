import SharedLoginPage from '@/components/auth/SharedLoginPage';

export default function PortalPage() {
  return (
    <SharedLoginPage 
      brandTitle="ScholarsNG"
      brandSubtitle="RESULTSPRO EDU SUITE"
      appName="ScholarsNG"
      appDescription="The Unified Portal for Students, Parents, Teachers, and Admins"
      redirectPath="/portal/dashboard"
    />
  );
}
