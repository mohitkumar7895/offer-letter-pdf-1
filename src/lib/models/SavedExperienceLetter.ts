import mongoose, { Schema } from "mongoose";

const SavedExperienceLetterSchema = new Schema(
  {
    refNo: { type: String, default: "" },
    employeeName: { type: String, default: "" },
    companyName: { type: String, default: "" },
    role: { type: String, default: "" },
    joiningDate: { type: String, default: "" },
    endingDate: { type: String, default: "" },
    performance: { type: String, default: "" },
    remarks: { type: String, default: "" },
    template: { type: String, default: "professional" },
    logo: { type: String, default: "" },
    signature: { type: String, default: "" },
    email: { type: String, default: "" },
    pdfBuffer: { type: Buffer },
  },
  { timestamps: true }
);

const SavedExperienceLetter =
  mongoose.models.SavedExperienceLetter ||
  mongoose.model("SavedExperienceLetter", SavedExperienceLetterSchema);

export default SavedExperienceLetter;
