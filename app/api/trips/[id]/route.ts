import { NextResponse } from "next/server";
import { getTrip, getBudgetStatus } from "@/lib/server-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const trip = getTrip(params.id);
  if (!trip) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const budget = getBudgetStatus(params.id);
  return NextResponse.json({ trip, budget });
}
