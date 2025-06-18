-- CreateTable
CREATE TABLE "CidCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CidCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CidCode_code_key" ON "CidCode"("code");

-- CreateIndex
CREATE INDEX "CidCode_code_idx" ON "CidCode"("code");
