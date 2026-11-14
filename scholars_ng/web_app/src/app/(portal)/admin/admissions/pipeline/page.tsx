import { redirect } from 'next/navigation';
import { MotionRise } from '@/components/ScrollRiseProvider';

export default function AdminAdmissionsPipelineRedirect() {
  redirect('/admin/campus-os/admission?subtab=pipeline');
  return <MotionRise><div /></MotionRise>;
}
