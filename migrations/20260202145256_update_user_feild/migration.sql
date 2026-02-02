-- AlterTable
ALTER TABLE "User" DROP COLUMN "isPhoneNumberVerified",
DROP COLUMN "phoneNumberToken",
DROP COLUMN "phoneNumberVerificationIssuedAt",
DROP COLUMN "phoneNumberVerificationRedeemedAt",
ADD COLUMN     "isUserVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userVerificationToken" TEXT,
ADD COLUMN     "userVerificationTokenIssuedAt" TIMESTAMP(3),
ADD COLUMN     "userVerificationTokenRedeemedAt" TIMESTAMP(3);

