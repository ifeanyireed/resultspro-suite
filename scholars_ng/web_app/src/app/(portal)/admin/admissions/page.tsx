import { redirect } from 'next/navigation';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function AdminAdmissionsRedirect() {
  redirect('/admin/campus-os?tab=admission&subtab=overview');
  return <MotionRise><div /></MotionRise>;
}
