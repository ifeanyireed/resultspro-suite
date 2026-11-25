import { redirect } from 'next/navigation';
export default function RedirectToCampusOS() {
  redirect('/parent/campus-os?subtab=bursary');
}
