import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { handleApiError, jsonError } from "@/lib/apiResponse";
import { requireModuleAuth, mapDocs } from "@/lib/modules/apiHelpers";
import {
  parseListQuery,
  buildSoftDeleteFilter,
  buildSearchFilter,
  buildSort,
  paginated,
  skip,
} from "@/lib/modules/query";
import { projectCreateSchema } from "@/lib/modules/schemas";
import { logAudit, getClientIp } from "@/lib/audit";
import { createNotification } from "@/lib/notifications";
import Project from "@/models/modules/Project";
import { CustomerActivity } from "@/models/modules/CustomerActivity";
import Domain, { DomainHistory } from "@/models/modules/Domain";
import MarketingPayment from "@/models/modules/MarketingPayment";
import MaintenanceService, { ServiceHistory } from "@/models/modules/MaintenanceService";

function calcDue(total: number, paid: number, discount: number) {
  return Math.max(0, total - discount - paid);
}

function calcPaymentStatus(total: number, paid: number, discount: number) {
  const due = calcDue(total, paid, discount);
  if (due <= 0) return "Paid";
  if (paid > 0) return "Partial";
  return "Pending";
}

export async function GET(request: Request) {
  const auth = await requireModuleAuth("project");
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const q = parseListQuery(request.url);
    const url = new URL(request.url);
    const clientId = url.searchParams.get("clientId");

    const filter: Record<string, unknown> = {
      ...buildSoftDeleteFilter(q.includeDeleted || false),
      ...(q.status && q.status !== "All" ? { status: q.status } : {}),
      ...(clientId ? { clientId } : {}),
      ...buildSearchFilter(q.search || "", ["name", "description"]),
    };

    const total = await Project.countDocuments(filter);
    const items = await Project.find(filter)
      .sort(buildSort(q.sortBy || "createdAt", q.sortOrder || "desc"))
      .skip(skip(q.page, q.limit))
      .limit(q.limit)
      .lean();

    return NextResponse.json(paginated(mapDocs(items), q.page, q.limit, total));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const auth = await requireModuleAuth("project");
  if ("error" in auth) return auth.error;

  try {
    const body = await request.json();
    const parsed = projectCreateSchema.safeParse(body);
    if (!parsed.success) return jsonError("Invalid project data", 400);

    await connectDB();
    const item = await Project.create({
      ...parsed.data,
      status: parsed.data.status || "Pending Allocation",
      createdBy: auth.user.userId,
      updatedBy: auth.user.userId,
    });

    await CustomerActivity.create({
      clientId: parsed.data.clientId,
      action: "project_created",
      details: `Project created: ${item.name}`,
      module: "project",
      entityId: String(item._id),
      changedBy: auth.user.userId,
    });

    const linkedCreates: Promise<unknown>[] = [];
    const domainName = String(body.domainName || "").trim();
    if (domainName) {
      linkedCreates.push(
        Domain.create({
          clientId: parsed.data.clientId,
          projectId: item._id,
          domainName,
          registrar: String(body.domainRegistrar || "").trim(),
          purchaseDate: body.domainPurchaseDate || null,
          expiryDate: body.domainExpiryDate || null,
          hostingProvider: String(body.hostingProvider || "").trim(),
          notes: String(body.domainNotes || "").trim(),
          createdBy: auth.user.userId,
          updatedBy: auth.user.userId,
        }).then((domain) =>
          DomainHistory.create({
            domainId: domain._id,
            action: "created",
            details: `Created from project: ${item.name}`,
            changedBy: auth.user.userId,
          }),
        ),
      );
    }

    const totalAmount = Number(body.paymentTotalAmount || body.totalAmount || 0);
    if (totalAmount > 0) {
      const paidAmount = Number(body.paidAmount || 0);
      const discount = Number(body.discount || 0);
      const dueAmount = calcDue(totalAmount, paidAmount, discount);
      linkedCreates.push(
        MarketingPayment.create({
          clientId: parsed.data.clientId,
          projectId: item._id,
          invoiceNumber: String(body.invoiceNumber || "").trim(),
          paymentType: String(body.paymentType || "One Time"),
          totalAmount,
          paidAmount,
          dueAmount,
          gstPercent: Number(body.gstPercent || 18),
          discount,
          status: calcPaymentStatus(totalAmount, paidAmount, discount),
          dueDate: body.paymentDueDate || null,
          notes: String(body.paymentNotes || "").trim(),
          createdBy: auth.user.userId,
          updatedBy: auth.user.userId,
        }),
      );
    }

    const maintenanceType = String(body.maintenanceType || "No Maintenance");
    if (maintenanceType && maintenanceType !== "No Maintenance") {
      linkedCreates.push(
        MaintenanceService.create({
          clientId: parsed.data.clientId,
          projectId: item._id,
          serviceType: maintenanceType,
          title: String(body.maintenanceTitle || `${item.name} Maintenance`),
          description: String(body.maintenanceDescription || "").trim(),
          status: "Active",
          startDate: body.maintenanceStartDate || null,
          expiryDate: body.maintenanceExpiryDate || null,
          renewalDate: body.maintenanceRenewalDate || null,
          createdBy: auth.user.userId,
          updatedBy: auth.user.userId,
        }).then((service) =>
          ServiceHistory.create({
            serviceId: service._id,
            action: "created",
            details: `Created from project: ${item.name}`,
            changedBy: auth.user.userId,
          }),
        ),
      );
    }

    if (linkedCreates.length > 0) {
      await Promise.all(linkedCreates);
      await CustomerActivity.create({
        clientId: parsed.data.clientId,
        action: "project_links_created",
        details: `Linked records created for project: ${item.name}`,
        module: "project",
        entityId: String(item._id),
        changedBy: auth.user.userId,
      });
    }

    await logAudit({
      userId: auth.user.userId,
      userEmail: auth.user.email,
      action: "create",
      module: "project",
      entityId: String(item._id),
      details: `Project created: ${item.name}`,
      ipAddress: getClientIp(request),
    });

    await createNotification({
      title: "New Project Created",
      message: `Project "${item.name}" created and pending allocation`,
      type: "staff_allocation",
      link: "/projects",
      entityModule: "project",
      entityId: String(item._id),
    });

    return NextResponse.json({ item: { ...item.toObject(), _id: String(item._id) } }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
