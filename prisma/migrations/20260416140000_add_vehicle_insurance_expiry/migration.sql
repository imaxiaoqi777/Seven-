-- Add insurance expiry date to vehicle plate records.

ALTER TABLE `VehiclePlate`
    ADD COLUMN `insuranceExpiresAt` DATE NULL;

CREATE INDEX `VehiclePlate_insuranceExpiresAt_idx` ON `VehiclePlate`(`insuranceExpiresAt`);
