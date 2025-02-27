import { redirect } from "next/navigation";

export default function BlockAccess() {
    // DISABLE BUSINESS TYPE SECTION
    redirect('/admin/');
}