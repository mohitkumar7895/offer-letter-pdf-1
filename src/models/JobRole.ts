import mongoose, { Schema } from "mongoose";

const JobRoleSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const JobRole =
  mongoose.models.JobRole || mongoose.model("JobRole", JobRoleSchema);

export default JobRole;
