// app/api/buyers/export/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const where: any = {};
  const search = searchParams.get("search") ?? "";
  const city = searchParams.get("city") ?? "";
  const propertyType = searchParams.get("propertyType") ?? "";
  const status = searchParams.get("status") ?? "";
  const timeline = searchParams.get("timeline") ?? "";

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (city) where.city = city;
  if (propertyType) where.propertyType = propertyType;
  if (status) where.status = status;
  if (timeline) where.timeline = timeline;

  const buyers = await prisma.buyer.findMany({ where });

  const csvHeaders = [
    "fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status",
  ].join("\n");

  const csvRows = buyers
    .map((b) =>
      [
        b.fullName,
        b.email,
        b.phone,
        b.city,
        b.propertyType,
        b.bhk,
        b.purpose,
        b.budgetMin,
        b.budgetMax,
        b.timeline,
        b.source,
        b.notes,
        b.tags?.join(","),
        b.status,
      ].join(",")
    )
    .join("\n");

  const csvData = `${csvHeaders}\n${csvRows}`;

  return new Response(csvData, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="buyers.csv"`,
    },
  });
}
