-- CreateEnum
CREATE TYPE "public"."City" AS ENUM ('Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other');

-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('Apartment', 'Villa', 'Plot', 'Office', 'Retail');

-- CreateEnum
CREATE TYPE "public"."BHK" AS ENUM ('Studio', '1', '2', '3', '4');

-- CreateEnum
CREATE TYPE "public"."Purpose" AS ENUM ('Buy', 'Rent');

-- CreateEnum
CREATE TYPE "public"."Timeline" AS ENUM ('exploring', '0_3m', '3_6m', 'over_6m');

-- CreateEnum
CREATE TYPE "public"."Source" AS ENUM ('Website', 'Referral', 'Walk-in', 'Call', 'Other');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped');

-- CreateTable
CREATE TABLE "public"."Buyer" (
    "id" TEXT NOT NULL,
    "fullName" VARCHAR(80) NOT NULL,
    "email" TEXT,
    "phone" VARCHAR(15) NOT NULL,
    "city" "public"."City" NOT NULL,
    "propertyType" "public"."PropertyType" NOT NULL,
    "bhk" "public"."BHK",
    "purpose" "public"."Purpose" NOT NULL,
    "budgetMin" INTEGER,
    "budgetMax" INTEGER,
    "timeline" "public"."Timeline" NOT NULL,
    "source" "public"."Source" NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'New',
    "notes" VARCHAR(1000),
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ownerId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BuyerHistory" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diff" JSONB NOT NULL,

    CONSTRAINT "BuyerHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_email_key" ON "public"."Buyer"("email");

-- AddForeignKey
ALTER TABLE "public"."BuyerHistory" ADD CONSTRAINT "BuyerHistory_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "public"."Buyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
