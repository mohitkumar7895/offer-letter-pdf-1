import { getAuthFromCookies } from "@/lib/auth";
import { OfferLetterClient } from "@/components/OfferLetterClient";

export default async function OfferLetterPage() {
  const user = await getAuthFromCookies();
  return <OfferLetterClient userRole={user?.role ?? null} />;
}
