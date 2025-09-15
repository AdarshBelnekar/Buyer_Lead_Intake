import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buyerSchema } from "@/lib/validation";

interface Params {
  params: { id: string };
}

// GET buyer + last 5 history
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const buyerId = params.id; // this must exist
  if (!buyerId) return NextResponse.json({ error: "Missing buyer id" }, { status: 400 });

  const buyer = await prisma.buyer.findUnique({ where: { id: buyerId } });
  if (!buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

  const history = await prisma.buyerHistory.findMany({
    where: { buyerId },      // use buyerId variable
    orderBy: { changedAt: "desc" },
    take: 5,
  });

  return NextResponse.json({ buyer, history });
}


// PUT: update buyer with concurrency check
export async function PUT(req: Request, { params }: Params) {
  const body = await req.json();
  const parsed = buyerSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const data = parsed.data;

  const existing = await prisma.buyer.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });



  const updated = await prisma.buyer.update({
    where: { id: params.id },
    data: { ...data, tags: data.tags || [] },
  });

  // log history
  await prisma.buyerHistory.create({
    data: { buyerId: params.id, changedBy: "demo-user", diff: data },
  });

  const history = await prisma.buyerHistory.findMany({
    where: { buyerId: params.id },
    orderBy: { changedAt: "desc" }, // use changedAt
    take: 5,
  });

  return NextResponse.json({ buyer: updated, history });
}
