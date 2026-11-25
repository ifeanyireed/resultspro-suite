import { redirect } from 'next/navigation';
export default function RedirectToCampusOS() {
  redirect('/teacher/campus-os?subtab=roster');
}
