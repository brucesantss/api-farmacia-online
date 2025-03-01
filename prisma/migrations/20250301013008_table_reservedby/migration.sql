-- CreateTable
CREATE TABLE `ReservedBy` (
    `client` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,

    UNIQUE INDEX `ReservedBy_client_key`(`client`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
