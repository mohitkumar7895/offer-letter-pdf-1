import mongoose, { Schema } from "mongoose";

const DepartmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    roles: [{ type: String, trim: true }],
    workingLocations: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

const Department =
  mongoose.models.Department || mongoose.model("Department", DepartmentSchema);

export default Department;
