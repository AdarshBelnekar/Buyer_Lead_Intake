// app/page.tsx
import CSVImport from "@/components/CSVImport";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const PAGE_SIZE = 10;

async function getBuyers(params: URLSearchParams) {
  const page = Number(params.get("page") ?? "1");
  const search = params.get("search") ?? "";
  const city = params.get("city") ?? "";
  const propertyType = params.get("propertyType") ?? "";
  const status = params.get("status") ?? "";
  const timeline = params.get("timeline") ?? "";

  const where: any = {};

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

  const buyers = await prisma.buyer.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const total = await prisma.buyer.count({ where });

  return { buyers, total, page };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(resolvedParams)) {
    if (typeof value === "string") {
      params.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    }
  }

  const { buyers, total, page } = await getBuyers(params);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const getPaginationRange = () => {
    const start = Math.max(1, page - 4);
    const end = Math.min(totalPages, start + 9);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="flex-1 text-4xl font-extrabold text-gray-900 text-center">
    Buyer Leads
  </h1>
<div className="flex justify-between items-center w-full mb-6">
  {/* Left side: Import + Export */}
  <div className="flex items-center gap-2">
    <div className="   border-gray-400 rounded-md hover:bg-gray-100 transition-colors">
      <CSVImport />
    </div>

   
  </div>

  {/* Right side: Add button */}
  <Link
    href="/buyers/new"
    className="bg-black hover:bg-gray-600 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium"
  >
    + Add
  </Link>
</div>




      {/* Filters */}
      <form className="flex  flex-wrap gap-3 mb-6 items-center" method="get">
        <input
          name="search"
          defaultValue={params.get("search") || ""}
          placeholder="Search by name, email, phone"
          className="border p-2 rounded-md flex-1 min-w-[150px]"
        />
        <input
          name="city"
          defaultValue={params.get("city") || ""}
          placeholder="City"
          className="border p-2 rounded-md min-w-[120px]"
        />
        <input
          name="propertyType"
          defaultValue={params.get("propertyType") || ""}
          placeholder="Property Type"
          className="p-2 border border-gray-500 rounded-md min-w-[120px]"
        />
        <input
          name="status"
          defaultValue={params.get("status") || ""}
          placeholder="Status"
          className="border p-2 rounded-md min-w-[120px]"
        />
        <input
          name="timeline"
          defaultValue={params.get("timeline") || ""}
          placeholder="Timeline"
          className="border p-2 rounded-md min-w-[120px]"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md font-medium"
        >
          Filter
        </button>
      </form>

      {/* Summary */}
      <div className="flex justify-between items-center mb-4 text-gray-700 font-medium">
        <span>Total Leads: <strong>{total}</strong></span>
        <span>Page {page} of {totalPages}</span>
      </div>

      {/* Buyers Table */}
      <div className="overflow-x-auto rounded-lg ">
        <table className="min-w-full text-left">
          <thead className="bg-indigo-600 text-white">
            <tr>
              {["Name", "Phone", "City", "Property Type", "Budget", "Timeline", "Status", "Updated At", "Actions"].map((th) => (
                <th key={th} className="px-4 py-3 text-center">{th}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-50">
            {buyers.map((buyer, idx) => (
              <tr
                key={buyer.id}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}
              >
                <td className="px-4 py-2 text-center">{buyer.fullName}</td>
                <td className="px-4 py-2 text-center">{buyer.phone}</td>
                <td className="px-4 py-2 text-center">{buyer.city}</td>
                <td className="px-4 py-2 text-center">{buyer.propertyType}</td>
                <td className="px-4 py-2 text-center">{buyer.budgetMin} – {buyer.budgetMax}</td>
                <td className="px-4 py-2 text-center">{buyer.timeline}</td>
                <td className="px-4 py-2 text-center">{buyer.status}</td>
                <td className="px-4 py-2 text-center">{new Date(buyer.updatedAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-center">
                  <Link href={`/buyers/${buyer.id}`} className="text-indigo-600 hover:underline font-medium">
                    View / Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        {page > 1 && (
          <Link
            href={`?${new URLSearchParams({ ...Object.fromEntries(params), page: "1" }).toString()}`}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
          >
            First
          </Link>
        )}
        {getPaginationRange().map((p) => (
          <Link
            key={p}
            href={`?${new URLSearchParams({ ...Object.fromEntries(params), page: String(p) }).toString()}`}
            className={`px-3 py-1 rounded-md hover:bg-gray-300 ${p === page ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
          >
            {p}
          </Link>
        ))}
        {page < totalPages && (
          <Link
            href={`?${new URLSearchParams({ ...Object.fromEntries(params), page: String(totalPages) }).toString()}`}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
          >
            Last
          </Link>
        )}
      </div>

       <Link
      href={`/api/buyers/export?${new URLSearchParams(
        Object.fromEntries(params)
      ).toString()}`}
      className=" text-black underline  hover:text-blue-700 text-sm font-medium"
    >
      Export (Download)
    </Link>
    </div>
  );
}
