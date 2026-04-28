import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Department from "@/models/Department";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const departments = await Department.find().sort({ order: 1 }).lean();
    return NextResponse.json(departments);
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
    
    // Get highest order
    const lastDept = await Department.findOne().sort({ order: -1 });
    const nextOrder = lastDept ? lastDept.order + 1 : 0;

    const department = await Department.create({
      ...body,
      order: nextOrder
    });
    
    return NextResponse.json(department, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// For bulk updates like reordering
export async function PATCH(req: Request) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth || (auth.role !== "Admin" && auth.role !== "HR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { items } = await req.json(); // Array of { _id, order }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const updates = items.map((item: any) => 
      Department.findByIdAndUpdate(item._id, { order: item.order })
    );

    await Promise.all(updates);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
