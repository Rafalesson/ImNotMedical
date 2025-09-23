-- CreateTable
CREATE TABLE "public"."MedicalPrescription" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "templateId" TEXT NOT NULL DEFAULT 'default',
    "items" JSONB NOT NULL,
    "generalGuidance" TEXT,
    "additionalNotes" TEXT,
    "pharmacyToken" TEXT,
    "patientToken" TEXT,
    "pdfUrl" TEXT,
    "doctorId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "MedicalPrescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MedicalPrescription_code_key" ON "public"."MedicalPrescription"("code");

-- AddForeignKey
ALTER TABLE "public"."MedicalPrescription" ADD CONSTRAINT "MedicalPrescription_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalPrescription" ADD CONSTRAINT "MedicalPrescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

