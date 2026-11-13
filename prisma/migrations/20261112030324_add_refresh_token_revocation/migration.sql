ALTER TABLE `refreshtoken`
ADD COLUMN `revoked` BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX `RefreshToken_expiresAt_idx`
ON `refreshtoken`(`expiresAt`);