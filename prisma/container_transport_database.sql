-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `account` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('ADMIN', 'DRIVER') NOT NULL DEFAULT 'DRIVER',
    `status` ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED',
    `driverProfileId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_account_key`(`account`),
    UNIQUE INDEX `User_driverProfileId_key`(`driverProfileId`),
    INDEX `User_username_idx`(`username`),
    INDEX `User_role_idx`(`role`),
    INDEX `User_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `socialCreditCode` VARCHAR(50) NOT NULL,
    `contactName` VARCHAR(50) NOT NULL,
    `contactPhone` VARCHAR(20) NOT NULL,
    `status` ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED',
    `remark` TEXT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Company_socialCreditCode_key`(`socialCreditCode`),
    INDEX `Company_name_idx`(`name`),
    INDEX `Company_socialCreditCode_idx`(`socialCreditCode`),
    INDEX `Company_status_idx`(`status`),
    INDEX `Company_createdBy_idx`(`createdBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContainerType` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `code` VARCHAR(50) NULL,
    `status` ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED',
    `remark` TEXT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ContainerType_code_key`(`code`),
    INDEX `ContainerType_name_idx`(`name`),
    INDEX `ContainerType_status_idx`(`status`),
    INDEX `ContainerType_createdBy_idx`(`createdBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VehiclePlate` (
    `id` VARCHAR(191) NOT NULL,
    `plateNumber` VARCHAR(20) NOT NULL,
    `vehicleType` VARCHAR(50) NULL,
    `teamName` VARCHAR(50) NULL,
    `insuranceExpiresAt` DATE NULL,
    `status` ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED',
    `remark` TEXT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VehiclePlate_plateNumber_key`(`plateNumber`),
    INDEX `VehiclePlate_plateNumber_idx`(`plateNumber`),
    INDEX `VehiclePlate_insuranceExpiresAt_idx`(`insuranceExpiresAt`),
    INDEX `VehiclePlate_status_idx`(`status`),
    INDEX `VehiclePlate_createdBy_idx`(`createdBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Driver` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `defaultVehicleId` VARCHAR(191) NULL,
    `status` ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED',
    `remark` TEXT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Driver_name_idx`(`name`),
    INDEX `Driver_phone_idx`(`phone`),
    INDEX `Driver_defaultVehicleId_idx`(`defaultVehicleId`),
    INDEX `Driver_status_idx`(`status`),
    INDEX `Driver_createdBy_idx`(`createdBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DropLocation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `province` VARCHAR(50) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `district` VARCHAR(50) NOT NULL,
    `detailAddress` VARCHAR(200) NOT NULL,
    `fullAddress` VARCHAR(255) NOT NULL,
    `contactName` VARCHAR(50) NULL,
    `contactPhone` VARCHAR(20) NULL,
    `status` ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED',
    `remark` TEXT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DropLocation_name_idx`(`name`),
    INDEX `DropLocation_province_city_district_idx`(`province`, `city`, `district`),
    INDEX `DropLocation_status_idx`(`status`),
    INDEX `DropLocation_createdBy_idx`(`createdBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Load` (
    `id` VARCHAR(191) NOT NULL,
    `loadNumber` VARCHAR(32) NOT NULL,
    `status` ENUM('DRAFT', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `pickupAt` DATETIME(3) NULL,
    `destination` VARCHAR(100) NOT NULL,
    `companyId` VARCHAR(191) NULL,
    `containerTypeId` VARCHAR(191) NOT NULL,
    `blNumber` VARCHAR(100) NOT NULL,
    `vesselVoyage` VARCHAR(100) NULL,
    `containerNumber` VARCHAR(50) NOT NULL,
    `sealNumber` VARCHAR(50) NULL,
    `dropLocationId` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `driverId` VARCHAR(191) NOT NULL,
    `operatorUserId` VARCHAR(191) NOT NULL,
    `totalFee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `gasFee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `driverPay` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `otherFee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `otherFeeRemark` VARCHAR(200) NULL,
    `balanceFee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `remark` TEXT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Load_loadNumber_key`(`loadNumber`),
    INDEX `Load_status_idx`(`status`),
    INDEX `Load_destination_idx`(`destination`),
    INDEX `Load_companyId_idx`(`companyId`),
    INDEX `Load_containerTypeId_idx`(`containerTypeId`),
    INDEX `Load_blNumber_idx`(`blNumber`),
    INDEX `Load_containerNumber_idx`(`containerNumber`),
    INDEX `Load_dropLocationId_idx`(`dropLocationId`),
    INDEX `Load_vehicleId_idx`(`vehicleId`),
    INDEX `Load_driverId_idx`(`driverId`),
    INDEX `Load_operatorUserId_idx`(`operatorUserId`),
    INDEX `Load_pickupAt_idx`(`pickupAt`),
    INDEX `Load_createdAt_idx`(`createdAt`),
    INDEX `Load_createdBy_idx`(`createdBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoadHistory` (
    `id` VARCHAR(191) NOT NULL,
    `loadId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `changedBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LoadHistory_loadId_idx`(`loadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OperationLog` (
    `id` VARCHAR(191) NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `actorUsername` VARCHAR(50) NOT NULL,
    `actorAccount` VARCHAR(100) NOT NULL,
    `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'RESET_PASSWORD') NOT NULL,
    `module` ENUM('USER_MANAGEMENT', 'LOAD_MANAGEMENT', 'CONTAINER_TYPE_MANAGEMENT', 'COMPANY_MANAGEMENT', 'VEHICLE_MANAGEMENT', 'DRIVER_MANAGEMENT', 'DROP_LOCATION_MANAGEMENT', 'DATABASE_BACKUP') NOT NULL,
    `businessId` VARCHAR(191) NULL,
    `summary` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `OperationLog_actorId_idx`(`actorId`),
    INDEX `OperationLog_action_idx`(`action`),
    INDEX `OperationLog_module_idx`(`module`),
    INDEX `OperationLog_businessId_idx`(`businessId`),
    INDEX `OperationLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_driverProfileId_fkey` FOREIGN KEY (`driverProfileId`) REFERENCES `Driver`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContainerType` ADD CONSTRAINT `ContainerType_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VehiclePlate` ADD CONSTRAINT `VehiclePlate_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Driver` ADD CONSTRAINT `Driver_defaultVehicleId_fkey` FOREIGN KEY (`defaultVehicleId`) REFERENCES `VehiclePlate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Driver` ADD CONSTRAINT `Driver_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DropLocation` ADD CONSTRAINT `DropLocation_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Load` ADD CONSTRAINT `Load_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Load` ADD CONSTRAINT `Load_containerTypeId_fkey` FOREIGN KEY (`containerTypeId`) REFERENCES `ContainerType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Load` ADD CONSTRAINT `Load_dropLocationId_fkey` FOREIGN KEY (`dropLocationId`) REFERENCES `DropLocation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Load` ADD CONSTRAINT `Load_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `VehiclePlate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Load` ADD CONSTRAINT `Load_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Load` ADD CONSTRAINT `Load_operatorUserId_fkey` FOREIGN KEY (`operatorUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Load` ADD CONSTRAINT `Load_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoadHistory` ADD CONSTRAINT `LoadHistory_loadId_fkey` FOREIGN KEY (`loadId`) REFERENCES `Load`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoadHistory` ADD CONSTRAINT `LoadHistory_changedBy_fkey` FOREIGN KEY (`changedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationLog` ADD CONSTRAINT `OperationLog_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

