import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import Client from "@/models/Client";
import { handleApiError, jsonError } from "@/lib/apiResponse";

const nullableDateField = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return value;
}, z.coerce.date().optional());

export async function GET(_request: Request, ctx: RouteContext<"/api/clients/[id]">) {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const client = await Client.findById(id).lean();
    if (!client) {
      return jsonError("Client not found", 404);
    }
    return NextResponse.json(client);
  } catch (error) {
    return handleApiError(error);
  }
}

const updateClientSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    mobileNumber: z.string().trim().min(1).optional(),
    email: z.string().trim().email().optional().or(z.literal("")).nullable(),
    address: z.string().trim().optional().or(z.literal("")).nullable(),
    city: z.string().trim().optional().or(z.literal("")).nullable(),
    state: z.string().trim().optional().or(z.literal("")).nullable(),
    status: z
      .enum(["Work in Progress", "Pending", "Completed (Live)", "Expired / Not Working"])
      .optional(),
    domainDetails: z
      .object({
        domainName: z.string().trim().optional().or(z.literal("")).nullable(),
        businessName: z.string().trim().optional().or(z.literal("")).nullable(),
        category: z.string().trim().optional().or(z.literal("")).nullable(),
        renewalDate: nullableDateField,
        domainRegistrar: z.string().trim().optional().or(z.literal("")).nullable(),
        hostingExpiryDate: nullableDateField,
        hostingCompany: z.string().trim().optional().or(z.literal("")).nullable(),
        hostingProvider: z.enum(["Provider", "Others"]).optional().nullable(),
        remarks: z.string().trim().optional().or(z.literal("")).nullable(),
      })
      .optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required.",
  });

export async function PUT(request: Request, ctx: RouteContext<"/api/clients/[id]">) {
  try {
    const data = await request.json();
    const parsed = updateClientSchema.safeParse(data);
    if (!parsed.success) {
      return jsonError("Invalid client update data", 400);
    }

    const { id } = await ctx.params;
    await connectDB();
    const updatedClient = await Client.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
      lean: true,
    });
    if (!updatedClient) {
      return jsonError("Client not found", 404);
    }
    return NextResponse.json(updatedClient);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/clients/[id]">) {
  try {
    const { id } = await ctx.params;
    await connectDB();
    const deletedClient = await Client.findByIdAndDelete(id).lean();
    if (!deletedClient) {
      return jsonError("Client not found", 404);
    }
    return NextResponse.json({ message: "Client deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
