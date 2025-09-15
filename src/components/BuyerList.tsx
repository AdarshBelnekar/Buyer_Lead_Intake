import prisma from "@/lib/prisma";

type SearchParams = {
  page?: string;
  q?: string;
  city?: string;
  propertyType?: string;
  status?: string;
  timeline?: string;
};

interface BuyerListProps {
  searchParams: SearchParams;
}

// This is a server component (async allowed, can use Prisma)
export default async function BuyerList({ searchParams }: BuyerListProps) {
  const page = parseInt(searchParams.page || "1");
  const take = 10;
  const skip = (page - 1) * take;

  const where: any = {};

  if (searchParams.q) {
    where.OR = [
      { fullName: { contains: searchParams.q, mode: "insensitive" } },
      { phone: { contains: searchParams.q, mode: "insensitive" } },
      { email: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }

  if (searchParams.city) where.city = searchParams.city;
  if (searchParams.propertyType) where.propertyType = searchParams.propertyType;
  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.timeline) where.timeline = searchParams.timeline;

  const [buyers, total] = await Promise.all([
    prisma.buyer.findMany({
      where,
      skip,
      take,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.buyer.count({ where }),
  ]);

  const totalPages = Math.ceil(total / take);

  return (
    <div>
      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Full Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Phone</th>
            <th className="p-2 text-left">City</th>
          </tr>
        </thead>
        <tbody>
          {buyers.map((buyer) => (
            <tr key={buyer.id} className="border-b">
              <td className="p-2">{buyer.fullName}</td>
              <td className="p-2">{buyer.email}</td>
              <td className="p-2">{buyer.phone}</td>
              <td className="p-2">{buyer.city}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-2 text-sm text-gray-500">
        Page {page} of {totalPages}
      </p>
    </div>
  );
}
