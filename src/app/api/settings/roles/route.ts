import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import JobRole from "@/models/JobRole";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const roles = await JobRole.find().sort({ order: 1 }).lean();
    return NextResponse.json(roles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || (auth.role !== "Admin" && auth.role !== "HR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    
    const lastRole = await JobRole.findOne().sort({ order: -1 });
    const nextOrder = lastRole ? lastRole.order + 1 : 0;

    const role = await JobRole.create({
      ...body,
      order: nextOrder
    });
    
    return NextResponse.json(role, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || (auth.role !== "Admin" && auth.role !== "HR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const updates = items.map((item: any) => 
      JobRole.findByIdAndUpdate(item._id, { order: item.order })
    );

    await Promise.all(updates);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
