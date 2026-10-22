import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const libros = [
  {
    titulo: 'Harry Potter y la piedra filosofal',
    autor: 'J. K. Rowling',
    genero: 'Fantasía',
    editorial: 'Salamandra',
    precio: 12990,
    disponible: true,
  },
  {
    titulo: 'Harry Potter y la cámara secreta',
    autor: 'J. K. Rowling',
    genero: 'Fantasía',
    editorial: 'Salamandra',
    precio: 12990,
    disponible: true,
  },
  {
    titulo: 'El señor de los anillos: La Comunidad del Anillo',
    autor: 'J. R. R. Tolkien',
    genero: 'Fantasía',
    editorial: 'Minotauro',
    precio: 16990,
    disponible: true,
  },
  {
    titulo: 'El hobbit',
    autor: 'J. R. R. Tolkien',
    genero: 'Fantasía',
    editorial: 'Minotauro',
    precio: 11990,
    disponible: true,
  },
  {
    titulo: 'Juego de tronos',
    autor: 'George R. R. Martin',
    genero: 'Fantasía',
    editorial: 'Gigamesh',
    precio: 17990,
    disponible: true,
  },
  {
    titulo: 'Choque de reyes',
    autor: 'George R. R. Martin',
    genero: 'Fantasía',
    editorial: 'Gigamesh',
    precio: 18990,
    disponible: true,
  },
  {
    titulo: 'Tormenta de espadas',
    autor: 'George R. R. Martin',
    genero: 'Fantasía',
    editorial: 'Gigamesh',
    precio: 19990,
    disponible: false,
  },
  {
    titulo: 'Festín de cuervos',
    autor: 'George R. R. Martin',
    genero: 'Fantasía',
    editorial: 'Gigamesh',
    precio: 18990,
    disponible: true,
  },
  {
    titulo: 'Danza de dragones',
    autor: 'George R. R. Martin',
    genero: 'Fantasía',
    editorial: 'Gigamesh',
    precio: 19990,
    disponible: true,
  },
  {
    titulo: 'El imperio del vampiro',
    autor: 'Jay Kristoff',
    genero: 'Fantasía',
    editorial: 'Hidra',
    precio: 21990,
    disponible: true,
  },
  {
    titulo: 'Los juegos del hambre',
    autor: 'Suzanne Collins',
    genero: 'Ciencia ficción',
    editorial: 'Molino',
    precio: 11990,
    disponible: true,
  },
  {
    titulo: 'En llamas',
    autor: 'Suzanne Collins',
    genero: 'Ciencia ficción',
    editorial: 'Molino',
    precio: 11990,
    disponible: false,
  },
  {
    titulo: 'Sinsajo',
    autor: 'Suzanne Collins',
    genero: 'Ciencia ficción',
    editorial: 'Molino',
    precio: 11990,
    disponible: true,
  },
  {
    titulo: 'Balada de pájaros cantores y serpientes',
    autor: 'Suzanne Collins',
    genero: 'Ciencia ficción',
    editorial: 'Molino',
    precio: 13990,
    disponible: true,
  },
];

const unicos = (valores: string[]) => [...new Set(valores)];
async function main() {
  const password = await bcrypt.hash('admin123', 10);
  await prisma.usuario.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: { email: 'admin@admin.com', password },
  });

  const autores = await Promise.all(
    unicos(libros.map((l) => l.autor)).map((nombre) =>
      prisma.autor.upsert({
        where: { nombre },
        update: {},
        create: { nombre },
      }),
    ),
  );
  const generos = await Promise.all(
    unicos(libros.map((l) => l.genero)).map((nombre) =>
      prisma.genero.upsert({
        where: { nombre },
        update: {},
        create: { nombre },
      }),
    ),
  );
  const editoriales = await Promise.all(
    unicos(libros.map((l) => l.editorial)).map((nombre) =>
      prisma.editorial.upsert({
        where: { nombre },
        update: {},
        create: { nombre },
      }),
    ),
  );

  const autorId = new Map(autores.map((a) => [a.nombre, a.id]));
  const generoId = new Map(generos.map((g) => [g.nombre, g.id]));
  const editorialId = new Map(editoriales.map((e) => [e.nombre, e.id]));

  if ((await prisma.libro.count()) > 0) return;

  await prisma.libro.createMany({
    data: libros.map((l) => ({
      titulo: l.titulo,
      precio: l.precio,
      disponible: l.disponible,
      autorId: autorId.get(l.autor)!,
      generoId: generoId.get(l.genero)!,
      editorialId: editorialId.get(l.editorial)!,
    })),
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
