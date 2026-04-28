import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import JobRole from "@/models/JobRole";
import { getAuthFromCookies } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || (auth.role !== "Admin" && auth.role !== "HR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const body = await req.json();
    
    const role = await JobRole.findByIdAndUpdate(id, body, { new: true });
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }
    
    return NextResponse.json(role);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || (auth.role !== "Admin" && auth.role !== "HR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    
    const role = await JobRole.findByIdAndDelete(id);
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
