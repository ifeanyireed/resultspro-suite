import SharedLoginPage from '@/components/auth/SharedLoginPage';

export default function PortalPage() {
  return (
    <SharedLoginPage 
      brandTitle="SchoolHub"
      brandSubtitle="RESULTSPRO EDU SUITE"
      appName="SchoolHub"
      appDescription="The Unified Portal for Students, Parents, Teachers, and Admins"
      redirectPath="/portal/dashboard"
    />
  );
}
