import { redirect } from "next/navigation";

// The personal page now lives on the home page. Old links keep working.
export default function Leo() { redirect("/#inicio"); }
