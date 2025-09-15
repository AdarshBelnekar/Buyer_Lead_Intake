"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buyerSchema, BuyerFormData } from "@/lib/validation";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function BuyerFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyerId = searchParams.get("id"); // for update
  const isEditing = !!buyerId;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema),
  });

  const propertyType = watch("propertyType");

  
  useEffect(() => {
    if (isEditing) {
      (async () => {
        const res = await fetch(`/api/buyers/${buyerId}`);
        if (res.ok) {
          const buyer = await res.json();
          reset(buyer);
        }
      })();
    }
  }, [buyerId, isEditing, reset]);

  const onSubmit = async (data: BuyerFormData) => {
    setLoading(true);
    try {
      const res = await fetch(isEditing ? `/api/buyers/${buyerId}` : "/api/buyers", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/buyers");
      } else {
        console.error(await res.json());
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? "Update Buyer Lead" : "Create Buyer Lead"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            {...register("fullName")}
            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
          {errors.fullName && (
            <p id="fullName-error" role="alert" className="text-red-600 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <p id="phone-error" role="alert" className="text-red-600 text-sm mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            City
          </label>
          <select
            id="city"
            {...register("city")}
            className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          >
            <option value="Chandigarh">Chandigarh</option>
            <option value="Mohali">Mohali</option>
            <option value="Zirakpur">Zirakpur</option>
            <option value="Panchkula">Panchkula</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium mb-1">
            Property Type
          </label>
          <select
            id="propertyType"
            {...register("propertyType")}
            className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          >
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Plot">Plot</option>
            <option value="Office">Office</option>
            <option value="Retail">Retail</option>
          </select>
        </div>

        {/* BHK (conditional) */}
        {(propertyType === "Apartment" || propertyType === "Villa") && (
          <div>
            <label htmlFor="bhk" className="block text-sm font-medium mb-1">
              BHK
            </label>
            <select
              id="bhk"
              {...register("bhk")}
              className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="Studio">Studio</option>
              <option value="One">1</option>
              <option value="Two">2</option>
              <option value="Three">3</option>
              <option value="Four">4</option>
            </select>
          </div>
        )}

        {/* Purpose */}
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium mb-1">
            Purpose
          </label>
          <select
            id="purpose"
            {...register("purpose")}
            className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          >
            <option value="Buy">Buy</option>
            <option value="Rent">Rent</option>
          </select>
        </div>

        {/* Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="budgetMin" className="block text-sm font-medium mb-1">
              Budget Min
            </label>
            <input
              id="budgetMin"
              type="number"
              {...register("budgetMin", { valueAsNumber: true })}
              className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="budgetMax" className="block text-sm font-medium mb-1">
              Budget Max
            </label>
            <input
              id="budgetMax"
              type="number"
              {...register("budgetMax", { valueAsNumber: true })}
              className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Timeline */}
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium mb-1">
            Timeline
          </label>
          <select
            id="timeline"
            {...register("timeline")}
            className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          >
            <option value="ZeroToThree">0-3 Months</option>
            <option value="ThreeToSix">3-6 Months</option>
            <option value="MoreThanSix">&gt; 6 Months</option>
            <option value="Exploring">Exploring</option>
          </select>
        </div>

        {/* Source */}
        <div>
          <label htmlFor="source" className="block text-sm font-medium mb-1">
            Source
          </label>
          <select
            id="source"
            {...register("source")}
            className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          >
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Walk_in">Walk-in</option>
            <option value="Call">Call</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            {...register("notes")}
            className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            {...register("tags", {
              setValueAs: (v) => (v ? v.split(",").map((s: string) => s.trim()) : []),
            })}
            className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <div className=" flex justify-between w-full">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {loading ? "Saving..." : isEditing ? "Update Buyer" : "Save Buyer"}
        </button>
         <Link href="/buyers" className="text-blue-500 hover:underline mt-4 inline-block">
                Back to Buyers
              </Link></div>
      </form>
    </div>
  );
}
