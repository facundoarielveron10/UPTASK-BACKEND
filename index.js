// ---- IMPORTACIONES ---- //
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/database.js';
import UsuarioRoutes from './routes/UsuarioRoutes.js';
import ProyectoRoutes from './routes/ProyectoRoutes.js';
import TareaRoutes from './routes/TareaRoutes.js';
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

// PERMITIR CONEXIONES DESDE EL DOMINO DEL FRONTEND
const whitelist = [`${process.env.FRONT_URL}`];
const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.includes(origin)) {
			// TIENE LOS PERMISOS PARA CONSULTAR LA API
			callback(null, true);
		} else {
			// NO TIENE LOS PERMISOS PARA CONSULTAR LA API
			callback(new Error('Error de Cors'));
		}
	},
};
app.use(cors(corsOptions));

// ROUTING
app.use('/api/usuarios', UsuarioRoutes);
app.use('/api/proyectos', ProyectoRoutes);
app.use('/api/tareas', TareaRoutes);

// PUERTO
const PORT = process.env.PORT || 4000;

// INICIO DEL SERVIDOR
app.listen(PORT, () => {
	console.log(`Servidor corriendo en el puerto ${PORT}`);
});
// ---- ---- ---- ---- ---- //
