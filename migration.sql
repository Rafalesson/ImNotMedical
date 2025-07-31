-- Apaga todo o esquema 'public' existente e o recria.
-- O 'CASCADE' remove todas as tabelas, tipos e dependências.
DROP SCHEMA IF EXISTS "public" CASCADE;
CREATE SCHEMA "public";

-- Cria os tipos ENUM
CREATE TYPE "public"."Role" AS ENUM ('DOCTOR', 'PATIENT', 'ADMIN');
CREATE TYPE "public"."Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- Cria a tabela "Address"
CREATE TABLE "public"."Address" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- Cria a tabela "User"
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Cria a tabela "DoctorProfile"
CREATE TABLE "public"."DoctorProfile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "crm" TEXT NOT NULL,
    "specialty" TEXT,
    "addressId" INTEGER,
    "phone" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "DoctorProfile_pkey" PRIMARY KEY ("id")
);

-- Cria a tabela "PatientProfile"
CREATE TABLE "public"."PatientProfile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "sex" "public"."Sex",
    "phone" TEXT,
    "userId" INTEGER NOT NULL,
    "addressId" INTEGER,
    CONSTRAINT "PatientProfile_pkey" PRIMARY KEY ("id")
);

-- Cria a tabela "MedicalCertificate"
CREATE TABLE "public"."MedicalCertificate" (
    "id" SERIAL NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "templateId" TEXT NOT NULL DEFAULT 'default',
    "purpose" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "durationInDays" INTEGER,
    "cidCode" TEXT,
    "cidDescription" TEXT,
    "observations" TEXT,
    "pdfUrl" TEXT,
    "doctorId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    CONSTRAINT "MedicalCertificate_pkey" PRIMARY KEY ("id")
);

-- Cria a tabela "CidCode"
CREATE TABLE "public"."CidCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "CidCode_pkey" PRIMARY KEY ("id")
);

-- Cria os índices e constraints de unicidade
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");
CREATE UNIQUE INDEX "User_passwordResetToken_key" ON "public"."User"("passwordResetToken");
CREATE UNIQUE INDEX "DoctorProfile_crm_key" ON "public"."DoctorProfile"("crm");
CREATE UNIQUE INDEX "DoctorProfile_addressId_key" ON "public"."DoctorProfile"("addressId");
CREATE UNIQUE INDEX "DoctorProfile_userId_key" ON "public"."DoctorProfile"("userId");
CREATE UNIQUE INDEX "PatientProfile_cpf_key" ON "public"."PatientProfile"("cpf");
CREATE UNIQUE INDEX "PatientProfile_userId_key" ON "public"."PatientProfile"("userId");
CREATE UNIQUE INDEX "PatientProfile_addressId_key" ON "public"."PatientProfile"("addressId");
CREATE UNIQUE INDEX "CidCode_code_key" ON "public"."CidCode"("code");
CREATE INDEX "CidCode_code_idx" ON "public"."CidCode"("code");

-- Adiciona as chaves estrangeiras
ALTER TABLE "public"."DoctorProfile" ADD CONSTRAINT "DoctorProfile_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."DoctorProfile" ADD CONSTRAINT "DoctorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."PatientProfile" ADD CONSTRAINT "PatientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."PatientProfile" ADD CONSTRAINT "PatientProfile_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."MedicalCertificate" ADD CONSTRAINT "MedicalCertificate_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."MedicalCertificate" ADD CONSTRAINT "MedicalCertificate_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;