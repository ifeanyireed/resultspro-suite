import { redirect } from 'next/navigation';
export default function RedirectToCampusOS() {
  redirect('/student/campus-os?subtab=schedule');
}
