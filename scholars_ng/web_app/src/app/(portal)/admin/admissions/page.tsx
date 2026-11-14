import { redirect } from 'next/navigation';

export default function AdminAdmissionsRedirect() {
  redirect('/admin/campus-os?tab=admission&subtab=overview');
}
