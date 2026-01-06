import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'finanzas_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('Ejecutando migraciones...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        rol VARCHAR(50) NOT NULL DEFAULT 'usuario',
        fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
        activo BOOLEAN DEFAULT true
      );
    `);
    
    console.log('Migraciones completadas exitosamente');
  } catch (error) {
    console.error('Error ejecutando migraciones:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
