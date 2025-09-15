// src/app/__test__/buyerSchema.test.ts
import { buyerSchema } from "@/lib/validation";

describe("buyerSchema", () => {
  it("should reject if budgetMin > budgetMax", () => {
    const result = buyerSchema.safeParse({
      fullName: "John Doe",
      phone: "9876543210",
      city: "Chandigarh",
      propertyType: "Apartment",
      purpose: "Buy",
      budgetMin: 600000, // 
      budgetMax: 500000,
      timeline: "ZeroToThree",
      source: "Website",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      console.log(result.error.format()); // debug log
      expect(result.error.format().budgetMax?._errors || []).toContain(
        "Minimum budget must be less than or equal to maximum budget"
      );
    }
  });

it("should pass with valid budgets", () => {
  const result = buyerSchema.safeParse({
    fullName: "Jane Doe",
    phone: "9876543210",
    city: "Mohali",
    propertyType: "Villa",     // 
    bhk: "Two",                //
    purpose: "Rent",
    budgetMin: 100000,
    budgetMax: 500000,
    timeline: "ThreeToSix",
    source: "Referral",
  });

  expect(result.success).toBe(true);
});

});
