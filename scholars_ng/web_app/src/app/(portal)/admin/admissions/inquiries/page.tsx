import { redirect } from 'next/navigation';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function AdminAdmissionsInquiriesRedirect() {
  redirect('/admin/campus-os?tab=admission&subtab=inquiries');
  return <MotionRise><div /></MotionRise>;
}
