import { pgTable, serial, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const usuarios = pgTable('usuarios', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  rol: varchar('rol', { length: 50 }).notNull().default('usuario'),
  fechaCreacion: timestamp('fecha_creacion').notNull().defaultNow(),
  activo: boolean('activo').default(true)
});
