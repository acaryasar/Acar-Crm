import { requireRole } from "@/lib/auth-guard";
import { PremiumPaymentsPage } from "@/features/premium-payments/components/premium-payments-page";

export default async function CommissionPaymentPage() {
  await requireRole(["ADMIN", "SUPERVISOR"]);

  return <PremiumPaymentsPage />;
}
