import { NextResponse } from "next/server";
import { prisma, } from "@/lib/prisma"; // make sure PrismaClient is imported
import { buyerSchema } from "@/lib/validation";
import { Timeline } from "@prisma/client"; // 


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = buyerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    // fake auth (replace with Supabase auth later)
    const ownerId = "demo-user";

    // map the string from form to Prisma enum
   const timelineMap: Record<string, Timeline> = {
  "0_3m": Timeline.ZeroToThree,
  "3_6m": Timeline.ThreeToSix,
  "over_6m": Timeline.MoreThanSix,
  "exploring": Timeline.Exploring,
};


    const buyer = await prisma.buyer.create({
      data: {
        ...data,
        ownerId,
        email: data.email || null, // empty string -> null
        timeline: data.timeline,// 
      },
    });

    await prisma.buyerHistory.create({
      data: {
        buyerId: buyer.id,
        changedBy: ownerId,
        diff: { created: data },
      },
    });

    return NextResponse.json(buyer, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/buyers error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
