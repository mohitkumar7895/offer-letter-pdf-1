import mongoose, { Schema } from "mongoose";

const CompanySettingsSchema = new Schema(
  {
    companyName: { type: String, default: "" },
    companyEmail: { type: String, default: "" },
    companyMobile: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    companyAddress: { type: String, default: "" },
    companyLogo: {
      url: { type: String, default: "" },
      fileName: { type: String, default: "" },
    },
    directorSignature: {
      url: { type: String, default: "" },
      fileName: { type: String, default: "" },
    },
    seniorHrSignature: {
      url: { type: String, default: "" },
      fileName: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const CompanySettings =
  mongoose.models.CompanySettings ||
  mongoose.model("CompanySettings", CompanySettingsSchema);

export default CompanySettings;
