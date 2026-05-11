import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET() {
  const cookieUser = await getAuthFromCookies();
  return NextResponse.json(
    { user: cookieUser || null },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } },
  );
}
