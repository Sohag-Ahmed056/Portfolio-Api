-- Store uploaded images persistently without writing to the server filesystem.
CREATE TABLE "UploadedImage" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadedImage_pkey" PRIMARY KEY ("id")
);
