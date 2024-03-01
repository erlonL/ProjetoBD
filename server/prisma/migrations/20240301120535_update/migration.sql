/*
  Warnings:

  - Added the required column `matricula` to the `Aluno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Aluno` ADD COLUMN `matricula` VARCHAR(191) NOT NULL;
