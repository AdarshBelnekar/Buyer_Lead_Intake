// app/api/buyers/import/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const buyerSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  city: z.enum(["City1", "City2", "City3"]), // Replace with actual City enum
  propertyType: z.enum(["Type1", "Type2"]),
  bhk: z.enum(["1BHK", "2BHK", "3BHK"]).optional(),
  purpose: z.enum(["Buy", "Rent"]),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  timeline: z.string().optional(),
  source: z.enum(["Website", "Referral", "Walk_in", "Call", "Other"]),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.string().optional(),
});

export async function POST(req: Request) {
  const data = await req.json(); // CSV rows parsed from client
  if (!Array.isArray(data)) {
    return NextResponse.json({ error: "Invalid CSV format" }, { status: 400 });
  }

  if (data.length > 200) {
    return NextResponse.json({ error: "Max 200 rows allowed" }, { status: 400 });
  }

  const errors: any[] = [];
  const validRows: any[] = [];

  data.forEach((row, index) => {
    try {
      const parsed = buyerSchema.parse({
        ...row,
        budgetMin: row.budgetMin ? Number(row.budgetMin) : undefined,
        budgetMax: row.budgetMax ? Number(row.budgetMax) : undefined,
        tags: row.tags ? row.tags.split(",") : [],
      });
      validRows.push(parsed);
    } catch (err: any) {
      errors.push({ row: index + 2, message: err.errors?.[0]?.message || err.message });
    }
  });

  if (errors.length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  // Insert valid rows in a transaction
  await prisma.$transaction(
    validRows.map((row) =>
      prisma.buyer.create({ data: { ...row } })
    )
  );

  return NextResponse.json({ inserted: validRows.length });
}
