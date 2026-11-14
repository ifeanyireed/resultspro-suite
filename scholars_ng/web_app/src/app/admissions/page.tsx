import { redirect } from 'next/navigation';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function AdmissionsRouteRedirect() {
  redirect('/#admissions');
}
