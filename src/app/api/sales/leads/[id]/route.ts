import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { handleApiError, jsonError } from "@/lib/apiResponse";
import { requireModuleAuth } from "@/lib/modules/apiHelpers";
import { leadUpdateSchema } from "@/lib/modules/schemas";
import { logAudit, getClientIp } from "@/lib/audit";
import Lead, { LeadFollowUp } from "@/models/modules/Lead";
import Client from "@/models/Client";
import { CustomerActivity } from "@/models/modules/CustomerActivity";

export async function GET(_req: Request, ctx: RouteContext<"/api/sales/leads/[id]">) {
  const auth = await requireModuleAuth("sales");
  if ("error" in auth) return auth.error;

  try {
    const { id } = await ctx.params;
    await connectDB();
    const item = await Lead.findOne({ _id: id, deletedAt: null }).lean();
    if (!item) return jsonError("Lead not found", 404);

    const followUps = await LeadFollowUp.find({ leadId: id }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      item: { ...item, _id: String(item._id) },
      followUps: followUps.map((f) => ({ ...f, _id: String(f._id), leadId: String(f.leadId) })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/sales/leads/[id]">) {
  const auth = await requireModuleAuth("sales");
  if ("error" in auth) return auth.error;

  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const parsed = leadUpdateSchema.safeParse(body);
    if (!parsed.success) return jsonError("Invalid update data", 400);

    await connectDB();
    const item = await Lead.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { ...parsed.data, updatedBy: auth.user.userId },
      { new: true, runValidators: true },
    ).lean();
    if (!item) return jsonError("Lead not found", 404);

    await logAudit({
      userId: auth.user.userId,
      userEmail: auth.user.email,
      action: "update",
      module: "sales",
      entityId: id,
      details: `Lead updated: ${item.name}`,
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({ item: { ...item, _id: String(item._id) } });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, ctx: RouteContext<"/api/sales/leads/[id]">) {
  const auth = await requireModuleAuth("sales");
  if ("error" in auth) return auth.error;

  try {
    const { id } = await ctx.params;
    await connectDB();
    const item = await Lead.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date(), deletedBy: auth.user.userId, isActive: false },
      { new: true },
    ).lean();
    if (!item) return jsonError("Lead not found", 404);

    await logAudit({
      userId: auth.user.userId,
      userEmail: auth.user.email,
      action: "delete",
      module: "sales",
      entityId: id,
      details: `Lead soft deleted: ${item.name}`,
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({ message: "Lead deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, ctx: RouteContext<"/api/sales/leads/[id]">) {
  const auth = await requireModuleAuth("sales");
  if ("error" in auth) return auth.error;

  try {
    const { id } = await ctx.params;
    const url = new URL(request.url);
    const action = url.searchParams.get("action");

    if (action === "restore") {
      await connectDB();
      const item = await Lead.findOneAndUpdate(
        { _id: id },
        { deletedAt: null, deletedBy: null, isActive: true, updatedBy: auth.user.userId },
        { new: true },
      ).lean();
      if (!item) return jsonError("Lead not found", 404);
      return NextResponse.json({ item: { ...item, _id: String(item._id) } });
    }

    if (action === "convert") {
      await connectDB();
      const lead = await Lead.findOne({ _id: id, deletedAt: null });
      if (!lead) return jsonError("Lead not found", 404);
      if (lead.status === "Converted") return jsonError("Lead already converted", 400);

      const client = await Client.create({
        name: lead.name,
        mobileNumber: lead.phone,
        email: lead.email || "",
        status: "Pending",
        leadId: lead._id,
        createdBy: auth.user.userId,
        updatedBy: auth.user.userId,
      });

      lead.status = "Converted";
      lead.convertedClientId = client._id;
      lead.convertedAt = new Date();
      lead.updatedBy = auth.user.userId;
      await lead.save();

      await CustomerActivity.create({
        clientId: client._id,
        action: "converted_from_lead",
        details: `Converted from lead: ${lead.name}`,
        module: "sales",
        entityId: String(lead._id),
        changedBy: auth.user.userId,
      });

      await logAudit({
        userId: auth.user.userId,
        userEmail: auth.user.email,
        action: "convert",
        module: "sales",
        entityId: id,
        details: `Lead converted to customer: ${lead.name}`,
        ipAddress: getClientIp(request),
      });

      return NextResponse.json({
        lead: { ...lead.toObject(), _id: String(lead._id) },
        client: { ...client.toObject(), _id: String(client._id) },
      });
    }

    return jsonError("Invalid action", 400);
  } catch (error) {
    return handleApiError(error);
  }
}
