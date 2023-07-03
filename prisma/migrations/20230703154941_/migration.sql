/*
  Warnings:

  - You are about to drop the column `booker_first_name` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `booker_last_name` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `booker_name` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "booker_first_name",
DROP COLUMN "booker_last_name",
ADD COLUMN     "booker_name" TEXT NOT NULL;
