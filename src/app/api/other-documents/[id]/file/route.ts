import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import SavedOtherDocument from "@/lib/models/SavedOtherDocument";
import { documentPdfToBuffer } from "@/lib/pdfBuffer";

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: RouteCtx) {
  const { id } = await ctx.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (!process.env.MONGODB_URI) {
    return new NextResponse("Database not configured", { status: 503 });
  }

  try {
    await connectDB();
    const doc = await SavedOtherDocument.findById(id)
      .select("pdfBuffer title issuedToName")
      .lean();
    if (!doc?.pdfBuffer) {
      return new NextResponse("Not found", { status: 404 });
    }

    const buf = documentPdfToBuffer(doc.pdfBuffer);
    const fileName = (doc.issuedToName || doc.title || "document").replace(/[^\w\s.-]+/g, "_");

    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}.pdf"`,
      },
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}
