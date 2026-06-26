import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import Client from "@/models/Client";
import { handleApiError, jsonError } from "@/lib/apiResponse";

const nullableDateField = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return value;
}, z.coerce.date().optional());

const clientPayloadSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  mobileNumber: z.string().trim().min(1, "Mobile number is required"),
  email: z.string().trim().email().optional().or(z.literal("")).nullable(),
  address: z.string().trim().optional().or(z.literal("")).nullable(),
  city: z.string().trim().optional().or(z.literal("")).nullable(),
  state: z.string().trim().optional().or(z.literal("")).nullable(),
  status: z
    .enum(["Work in Progress", "Pending", "Completed (Live)", "Expired / Not Working"])
    .default("Pending"),
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
});

export async function GET() {
  try {
    await connectDB();
    const clients = await Client.find({})
      .select("name mobileNumber email address city state status domainDetails createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(clients);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = clientPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      return jsonError("Invalid client data", 400);
    }

    await connectDB();
    const newClient = await Client.create(parsed.data);
    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
