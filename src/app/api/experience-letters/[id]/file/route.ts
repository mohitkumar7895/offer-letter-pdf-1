import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import SavedExperienceLetter from "@/lib/models/SavedExperienceLetter";
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
    const doc = await SavedExperienceLetter.findById(id)
      .select("pdfBuffer employeeName refNo")
      .lean();
    if (!doc?.pdfBuffer) {
      return new NextResponse("Not found", { status: 404 });
    }

    const buf = documentPdfToBuffer(doc.pdfBuffer);
    const name = `Experience_Letter_${(doc.employeeName || "document").replace(/[^\w\s.-]+/g, "_").slice(0, 80)}.pdf`;

    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(name)}"`,
      },
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}

export async function GET_DATA(_req: Request, ctx: RouteCtx) {
  const { id } = await ctx.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await connectDB();
    const doc = await SavedExperienceLetter.findById(id)
      .select("-pdfBuffer")
      .lean();
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
