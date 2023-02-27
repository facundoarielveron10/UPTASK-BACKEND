// ---- IMPORTACIONES ---- //
import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/database.js';
import UsuarioRoutes from './routes/UsuarioRoutes.js';
// ---- ---- ---- ---- ---- //

// ---- SERVIDOR ---- //
// APP
const app = express();

// JSON
app.use(express.json());

// ENV
dotenv.config();

// BASE DE DATOS
conectarDB();

// ROUTING
app.use('/api/usuarios', UsuarioRoutes);

// PUERTO
const PORT = process.env.PORT || 4000;

// INICIO DEL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
// ---- ---- ---- ---- ---- //
