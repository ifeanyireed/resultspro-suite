import { redirect } from 'next/navigation';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function AdminAdmissionsApplicationsRedirect() {
  redirect('/admin/campus-os?tab=admission&subtab=applications');
  return <MotionRise><div /></MotionRise>;
}
