-- CreateTable
CREATE TABLE "autores" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,

    CONSTRAINT "autores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "generos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "editoriales" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,

    CONSTRAINT "editoriales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "libros" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "precio" INTEGER NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "img_url" VARCHAR(500),
    "autor_id" INTEGER NOT NULL,
    "genero_id" INTEGER NOT NULL,
    "editorial_id" INTEGER NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "libros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "accion" VARCHAR(20) NOT NULL,
    "detalles" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "autores_nombre_key" ON "autores"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "generos_nombre_key" ON "generos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "editoriales_nombre_key" ON "editoriales"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "libros_autor_id_idx" ON "libros"("autor_id");

-- CreateIndex
CREATE INDEX "libros_editorial_id_idx" ON "libros"("editorial_id");

-- CreateIndex
CREATE INDEX "libros_genero_id_idx" ON "libros"("genero_id");

-- CreateIndex
CREATE INDEX "libros_titulo_idx" ON "libros"("titulo");

-- CreateIndex
CREATE INDEX "libros_deleted_at_idx" ON "libros"("deleted_at");

-- CreateIndex
CREATE INDEX "logs_usuario_id_idx" ON "logs"("usuario_id");

-- AddForeignKey
ALTER TABLE "libros" ADD CONSTRAINT "libros_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "autores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "libros" ADD CONSTRAINT "libros_genero_id_fkey" FOREIGN KEY ("genero_id") REFERENCES "generos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "libros" ADD CONSTRAINT "libros_editorial_id_fkey" FOREIGN KEY ("editorial_id") REFERENCES "editoriales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
