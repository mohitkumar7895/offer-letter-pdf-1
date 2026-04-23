import { NextResponse } from "next/server";
import connectDB, { getMongoIssue } from "@/lib/mongodb";
import SavedOtherDocument from "@/lib/models/SavedOtherDocument";

export async function POST(req: Request) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "MONGODB_URI is not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();

    const {
      title,
      issuedToName,
      issuedToEmail,
      content,
      letterheadImage,
      pdfBase64,
    } = body;

    if (!title && !issuedToName) {
      return NextResponse.json(
        { error: "Title or Name is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const refNo = `DOC-${Date.now().toString(36).toUpperCase()}`;

    const doc = await SavedOtherDocument.create({
      refNo,
      title: title || "Custom Document",
      issuedToName,
      issuedToEmail,
      content,
      letterheadImage,
      pdfBuffer: pdfBase64 ? Buffer.from(pdfBase64, "base64") : undefined,
    });

    return NextResponse.json({
      id: String(doc._id),
      refNo: doc.refNo,
      message: "Document saved successfully",
    });
  } catch (e) {
    console.error(e);
    const issue = getMongoIssue(e);
    return NextResponse.json(
      { error: issue.message },
      { status: issue.status }
    );
  }
}

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: "MONGODB_URI is not configured" },
        { status: 503 }
      );
    }

    await connectDB();
    const rows = await SavedOtherDocument.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .select("-pdfBuffer")
      .lean();

    return NextResponse.json({
      items: rows.map((r: any) => ({
        id: String(r._id),
        refNo: r.refNo,
        title: r.title,
        issuedToName: r.issuedToName,
        issuedToEmail: r.issuedToEmail,
        createdAt: r.createdAt,
      })),
    });
  } catch (e) {
    console.error(e);
    const issue = getMongoIssue(e);
    return NextResponse.json(
      { error: issue.message },
      { status: issue.status }
    );
  }
}
