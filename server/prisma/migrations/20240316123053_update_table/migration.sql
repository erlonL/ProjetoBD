-- CreateTable
CREATE TABLE `profileImages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(255) NOT NULL,
    `alunoMatricula` VARCHAR(40) NOT NULL,

    UNIQUE INDEX `profileImages_alunoMatricula_key`(`alunoMatricula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
