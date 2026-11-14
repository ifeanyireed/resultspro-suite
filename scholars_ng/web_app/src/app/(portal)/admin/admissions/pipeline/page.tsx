import { redirect } from 'next/navigation';

export default function AdminAdmissionsPipelineRedirect() {
  redirect('/admin/campus-os?tab=admission&subtab=pipeline');
}
