/*
  Warnings:

  - Added the required column `price` to the `Medicamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `medicamento` ADD COLUMN `price` DOUBLE NOT NULL;
