import { prisma } from "@/lib/prisma";
import { buyerSchema } from "@/lib/validation";
import Link from "next/link";

const cities = ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"];
const propertyTypes = ["Apartment", "Villa", "Plot", "Office", "Retail"];
const timelines = ["ZeroToThree", "ThreeToSix", "MoreThanSix", "Exploring"];
const statuses = ["New", "Qualified", "Contacted", "Visited", "Negotiation", "Converted", "Dropped"];

export default async function BuyerPage({ params }: { params: { id: string } }) {
  const buyerId = params.id;

  const buyer = await prisma.buyer.findUnique({ where: { id: buyerId } });
  if (!buyer) return <p className="p-6 text-red-500 text-center">Buyer not found.</p>;

  const history = await prisma.buyerHistory.findMany({
    where: { buyerId },
    orderBy: { changedAt: "desc" },
    take: 5,
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <h1 className="text-3xl font-extrabold  text-center mb-6">
        View / Edit Buyer
      </h1>

      {/* Buyer Form */}
      <form
        action={async (formData: FormData) => {
          "use server";
          try {
            const data = Object.fromEntries(formData.entries()) as any;
            const existing = await prisma.buyer.findUnique({ where: { id: buyerId } });
            if (!existing) throw new Error("Buyer not found");
            if (new Date(data.updatedAt).getTime() !== existing.updatedAt.getTime())
              throw new Error("Record changed, please refresh");

            const parsed = buyerSchema.parse({
              ...data,
              budgetMin: Number(data.budgetMin),
              budgetMax: Number(data.budgetMax),
              tags: data.tags?.toString().split(",") || [],
            });

            await prisma.buyer.update({ where: { id: buyerId }, data: parsed });
            await prisma.buyerHistory.create({ data: { buyerId, changedBy: "demo-user", diff: parsed } });
          } catch (err) {
            console.error(err);
          }
        }}
        className="bg-white p-6 rounded-lg  space-y-4"
      >
        <input type="hidden" name="updatedAt" value={buyer.updatedAt.toISOString()} />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Full Name</label>
            <input name="fullName" defaultValue={buyer.fullName} className="border p-2 rounded shadow-sm focus:ring-indigo-300 focus:ring-1 focus:outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Phone</label>
            <input name="phone" defaultValue={buyer.phone} className="border p-2 rounded shadow-sm focus:ring-indigo-300 focus:ring-1 focus:outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Email</label>
            <input name="email" defaultValue={buyer.email ?? ""} className="border p-2 rounded shadow-sm focus:ring-indigo-300 focus:ring-1 focus:outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">City</label>
            <select name="city" defaultValue={buyer.city} className="border p-2 rounded shadow-sm focus:ring-indigo-300 focus:ring-1 focus:outline-none">
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Property Type</label>
            <select name="propertyType" defaultValue={buyer.propertyType} className="border p-2 rounded shadow-sm focus:ring-indigo-300 focus:ring-1 focus:outline-none">
              {propertyTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Timeline</label>
            <select name="timeline" defaultValue={buyer.timeline} className="border p-2 rounded shadow-sm focus:ring-indigo-300 focus:ring-1 focus:outline-none">
              {timelines.map(tl => <option key={tl} value={tl}>{tl}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Status</label>
            <select name="status" defaultValue={buyer.status} className="border p-2 rounded shadow-sm focus:ring-indigo-300 focus:ring-1 focus:outline-none">
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Tags</label>
            <input name="tags" defaultValue={buyer.tags.join(",")} className="border p-2 rounded shadow-sm focus:ring-indigo-300 focus:ring-1 focus:outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Budget Min</label>
            <input type="number" name="budgetMin" defaultValue={buyer.budgetMin ?? ""} className="border p-2 rounded shadow-sm focus:ring-indigo-300 focus:ring-1 focus:outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Budget Max</label>
            <input type="number" name="budgetMax" defaultValue={buyer.budgetMax ?? ""} className="border p-2 rounded shadow-sm focus:ring-indigo-300 focus:ring-1 focus:outline-none" />
          </div>
          <div className="md:col-span-2 flex flex-col">
            <label className="font-medium text-gray-700">Notes</label>
            <textarea name="notes" defaultValue={buyer.notes ?? ""} className="border p-2 rounded shadow-sm focus:ring-indigo-300 focus:ring-1 focus:outline-none h-24"></textarea>
          </div>
        </div>

        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow font-medium">
          Save Changes
        </button>
      </form>

      {/* History Section */}
      <h2 className="text-2xl font-bold text-indigo-700 mt-8 mb-4">Last 5 Changes</h2>
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full text-left divide-y divide-gray-200">
          <thead className="bg-indigo-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-center">Field</th>
              <th className="px-3 py-2 text-center">Old → New</th>
              <th className="px-3 py-2 text-center">Changed By</th>
              <th className="px-3 py-2 text-center">Timestamp</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {history.map(h => {
              const diffObj = typeof h.diff === "object" && h.diff !== null ? h.diff : {};
              return Object.entries(diffObj).map(([field, value]: [string, any]) => (
                <tr key={`${h.id}-${field}`} className="hover:bg-gray-50">
                  <td className="px-2 py-1 text-center">{field}</td>
                  <td className="px-2 py-1 text-center">{JSON.stringify(value)}</td>
                  <td className="px-2 py-1 text-center">{h.changedBy}</td>
                  <td className="px-2 py-1 text-center">{new Date(h.changedAt).toLocaleString()}</td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>

      <Link href="/buyers" className="text-indigo-600 hover:underline mt-4 inline-block">
        Back to Buyers
      </Link>
    </div>
  );
}
