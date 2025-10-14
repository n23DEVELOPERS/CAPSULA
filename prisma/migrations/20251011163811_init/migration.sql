/*
  Warnings:

  - A unique constraint covering the columns `[card_number]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Wallet_card_number_key" ON "public"."Wallet"("card_number");
