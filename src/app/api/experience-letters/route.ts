import { NextResponse } from "next/server";
import connectDB, { getMongoIssue } from "@/lib/mongodb";
import SavedExperienceLetter from "@/lib/models/SavedExperienceLetter";

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
      refNo,
      employeeName,
      companyName,
      role,
      joiningDate,
      endingDate,
      performance,
      remarks,
      template,
      logo,
      signature,
      email,
      pdfBase64,
    } = body;

    if (!employeeName) {
      return NextResponse.json(
        { error: "Employee name is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const doc = await SavedExperienceLetter.create({
      refNo: refNo || `EXP-${Date.now().toString(36).toUpperCase()}`,
      employeeName,
      companyName,
      role,
      joiningDate,
      endingDate,
      performance,
      remarks,
      template,
      logo,
      signature,
      email,
      pdfBuffer: pdfBase64 ? Buffer.from(pdfBase64, "base64") : undefined,
    });

    return NextResponse.json({
      id: String(doc._id),
      refNo: doc.refNo,
      message: "Experience letter saved successfully",
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
    const rows = await SavedExperienceLetter.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .select("-pdfBuffer")
      .lean();

    return NextResponse.json({
      items: rows.map((r: Record<string, unknown>) => ({
        id: String(r._id),
        refNo: r.refNo,
        employeeName: r.employeeName,
        companyName: r.companyName,
        role: r.role,
        joiningDate: r.joiningDate,
        endingDate: r.endingDate,
        performance: r.performance,
        remarks: r.remarks,
        template: r.template,
        logo: r.logo,
        signature: r.signature,
        email: r.email,
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
