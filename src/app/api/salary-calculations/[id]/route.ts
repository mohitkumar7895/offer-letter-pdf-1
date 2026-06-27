import SalaryCalculation from "@/models/modules/SalaryCalculation";
import { createModuleIdHandlers } from "@/lib/modules/crudHandlers";

const handlers = createModuleIdHandlers({
  module: "salary",
  Model: SalaryCalculation,
});

export const DELETE = handlers.DELETE;
