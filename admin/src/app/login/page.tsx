import { SharedLoginPage } from '@resultspro/design-system';

export default function LoginPage() {
  const usersApi = process.env.NEXT_PUBLIC_USERS_API || "https://resultspro-service-users.onrender.com";
  
  return (
    <SharedLoginPage 
      appName="Edu Suite"
      appDescription="The Engine Powering Modern Education."
      redirectPath="/overview"
      loginEndpoint={`${usersApi}/api/v1/auth/login`}
    />
  );
}
