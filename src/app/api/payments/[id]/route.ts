import MarketingPayment from "@/models/modules/MarketingPayment";
import { createModuleIdHandlers } from "@/lib/modules/crudHandlers";
import { paymentSchema } from "@/lib/modules/schemas";

const handlers = createModuleIdHandlers({
  module: "payment",
  Model: MarketingPayment,
  updateSchema: paymentSchema.partial(),
});

export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
