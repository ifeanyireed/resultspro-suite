import { redirect } from 'next/navigation';

export default function AdminAdmissionsInquiriesRedirect() {
  redirect('/admin/campus-os?tab=admission&subtab=inquiries');
}
