import { redirect } from "next/navigation";

export default function RedirectOfflineToDownloads() {
  redirect("/dashboard/downloads");
}
