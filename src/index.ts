import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Microservicio de Autenticación funcionando' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
