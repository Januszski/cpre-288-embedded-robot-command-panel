-- CreateTable
CREATE TABLE `Robot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `xCoordinate` DOUBLE NOT NULL,
    `yCoordinate` DOUBLE NOT NULL,
    `orientation` DOUBLE NOT NULL,
    `distanceArray` JSON NOT NULL,
    `degreeArray` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
