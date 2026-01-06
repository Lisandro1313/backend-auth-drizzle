import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { usuarios } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, nombre, rol = 'usuario' } = req.body;

    if (!email || !password || !nombre) {
      return res.status(400).json({ 
        error: 'Email, password y nombre son requeridos' 
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await db.select()
      .from(usuarios)
      .where(eq(usuarios.email, email))
      .limit(1);

    if (usuarioExistente.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = await db.insert(usuarios).values({
      email,
      password: hashedPassword,
      nombre,
      rol
    }).returning({
      id: usuarios.id,
      email: usuarios.email,
      nombre: usuarios.nombre,
      rol: usuarios.rol,
      fechaCreacion: usuarios.fechaCreacion
    });

    res.status(201).json(nuevoUsuario[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y password son requeridos' 
      });
    }

    // Buscar usuario
    const usuario = await db.select()
      .from(usuarios)
      .where(eq(usuarios.email, email))
      .limit(1);

    if (usuario.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario[0].password);

    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario[0].id, 
        email: usuario[0].email, 
        rol: usuario[0].rol 
      },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario[0].id,
        email: usuario[0].email,
        nombre: usuario[0].nombre,
        rol: usuario[0].rol
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const usuario = await db.select({
      id: usuarios.id,
      email: usuarios.email,
      nombre: usuarios.nombre,
      rol: usuarios.rol,
      fechaCreacion: usuarios.fechaCreacion
    })
      .from(usuarios)
      .where(eq(usuarios.id, req.usuario.id))
      .limit(1);

    if (usuario.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
