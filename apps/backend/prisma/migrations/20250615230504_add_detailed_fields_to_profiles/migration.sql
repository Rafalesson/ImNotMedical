-- AlterTable
ALTER TABLE "DoctorProfile" ADD COLUMN     "address" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "specialty" TEXT;

-- AlterTable
ALTER TABLE "PatientProfile" ADD COLUMN     "sex" TEXT;
