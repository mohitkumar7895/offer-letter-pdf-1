import mongoose, { Schema } from "mongoose";

const SavedOtherDocumentSchema = new Schema(
  {
    refNo: { type: String, default: "" },
    title: { type: String, default: "" },
    issuedToName: { type: String, default: "" },
    issuedToEmail: { type: String, default: "" },
    content: { type: String, default: "" },
    letterheadImage: { type: String, default: "" },
    pdfBuffer: { type: Buffer },
  },
  { timestamps: true }
);

const SavedOtherDocument =
  mongoose.models.SavedOtherDocument ||
  mongoose.model("SavedOtherDocument", SavedOtherDocumentSchema);

export default SavedOtherDocument;
