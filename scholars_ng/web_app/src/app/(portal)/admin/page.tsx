import PrincipalDashboard from '@/components/Dashboard/PrincipalDashboard';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function AdminRootPage() {
  return (
    <MotionRise>
      <PrincipalDashboard />
    </MotionRise>
  );
}
