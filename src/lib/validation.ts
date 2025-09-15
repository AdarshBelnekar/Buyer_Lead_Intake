import { z } from "zod";

// Enums reused for type safety
const Cities = ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"] as const;
const PropertyTypes = ["Apartment", "Villa", "Plot", "Office", "Retail"] as const;
const BHKTypes = ["Studio", "One", "Two", "Three", "Four"] as const;
const Purposes = ["Buy", "Rent"] as const;
const Timelines = ["ZeroToThree", "ThreeToSix", "MoreThanSix", "Exploring"] as const;
const Sources = ["Website", "Referral", "Walk_in", "Call", "Other"] as const;

export const buyerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters").max(80),
    
    email: z
      .string()
      .email("Invalid email")
      .optional()
      .or(z.literal("")), // allow empty string as "optional"
    
    phone: z
      .string()
      .regex(/^\d{10,15}$/, "Phone must be 10–15 digits"),
    
    city: z.enum(Cities),
    
    propertyType: z.enum(PropertyTypes),
    
    bhk: z.enum(BHKTypes).optional(),
    
    purpose: z.enum(Purposes),
    
    budgetMin: z.number().int().positive().optional(),
    budgetMax: z.number().int().positive().optional(),
    
    timeline: z.enum(Timelines),
    
    source: z.enum(Sources),
    
    notes: z.string().max(1000).optional(),
    
    tags: z.array(z.string()).optional(),
  })
  
  // ✅ Validate: budgetMin must be <= budgetMax (if both provided)
  .refine(
    (data) =>
      typeof data.budgetMin !== "number" ||
      typeof data.budgetMax !== "number" ||
      data.budgetMin <= data.budgetMax,
    {
      message: "Minimum budget must be less than or equal to maximum budget",
      path: ["budgetMax"],
    }
  )

  // ✅ Validate: bhk required for Apartment or Villa
  .refine(
    (data) => {
      if (["Apartment", "Villa"].includes(data.propertyType)) {
        return !!data.bhk;
      }
      return true;
    },
    {
      message: "BHK is required for Apartment or Villa",
      path: ["bhk"],
    }
  );

export type BuyerFormData = z.infer<typeof buyerSchema>;
