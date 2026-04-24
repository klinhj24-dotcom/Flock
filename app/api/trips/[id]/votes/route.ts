import { NextResponse } from "next/server";
import { z } from "zod";
import { voteOnOption, getTrip } from "@/lib/server-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  option_id: z.string().min(1),
  voter: z.string().min(1),
  vote: z.enum(["up", "down"]),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const trip = getTrip(params.id);
  if (!trip) {
    return NextResponse.json({ error: "trip not found" }, { status: 404 });
  }

  let parsed;
  try {
    parsed = BodySchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "invalid body" },
      { status: 400 },
    );
  }

  if (!trip.people.includes(parsed.voter)) {
    return NextResponse.json(
      {
        error: `voter '${parsed.voter}' is not on this trip`,
        members: trip.people,
      },
      { status: 400 },
    );
  }

  const option = voteOnOption(
    params.id,
    parsed.option_id,
    parsed.voter,
    parsed.vote,
  );
  if (!option) {
    return NextResponse.json(
      { error: "option not found" },
      { status: 404 },
    );
  }

  const upCount = Object.values(option.votes).filter((v) => v === "up").length;
  const downCount = Object.values(option.votes).filter((v) => v === "down")
    .length;
  return NextResponse.json({
    option,
    tally: { up: upCount, down: downCount, total: trip.people.length },
  });
}
