import { redirect } from 'next/navigation';

export default function AdminAdmissionsApplicationsRedirect() {
  redirect('/admin/campus-os?tab=admission&subtab=applications');
}
