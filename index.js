// ---- IMPORTACIONES ---- //
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/database.js';
import UsuarioRoutes from './routes/UsuarioRoutes.js';
import ProyectoRoutes from './routes/ProyectoRoutes.js';
import TareaRoutes from './routes/TareaRoutes.js';
import Proyecto from './models/Proyecto.js';
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
const servidor = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// SOCKET.IO
import { Server } from 'socket.io';

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONT_URL,
    },
});

io.on('connection', (socket) => {
    // Definir los eventos de socket io
    // ABRIR UN PROYECTO
    socket.on('abrir proyecto', (proyecto) => {
        socket.join(proyecto);
        socket.to(proyecto).emit('informacion', false, proyecto);
    });
    // EDITAR UN PROYECTO
    socket.on('editar proyecto', async (proyecto) => {
        const proyectoActualizado = await Proyecto.findById(proyecto._id)
            .populate({
                path: 'tareas',
                populate: { path: 'completado', select: 'nombre' },
            })
            .populate('creador', 'nombre email')
            .populate('colaboradores', 'nombre email');
        socket.to(proyecto?._id).emit('proyecto editado', proyectoActualizado);
    });
    socket.on('editar', (estado, proyecto) => {
        socket.to(proyecto).emit('editando', estado, proyecto);
    });
    // CREAR UNA NUEVA TAREA
    socket.on('nueva tarea', (tarea) => {
        const proyecto = tarea?.proyecto;
        socket.to(proyecto).emit('tarea agregada', tarea);
    });
    // ELIMINAR UNA TAREA
    socket.on('eliminar tarea', (tarea) => {
        const proyecto = tarea?.proyecto;
        socket.to(proyecto).emit('tarea eliminada', tarea);
    });
    // EDITAR UNA TAREA
    socket.on('editar tarea', (tarea) => {
        const proyecto = tarea?.proyecto?._id;
        socket.to(proyecto).emit('tarea editada', tarea);
    });
    // CAMBIAR ESTADO DE UNA TAREA
    socket.on('cambiar estado', (tarea) => {
        const proyecto = tarea?.proyecto?._id;
        socket.to(proyecto).emit('nuevo estado', tarea);
    });
    // NUEVO COLABORADOR
    socket.on('nuevo colaborador', (colaborador, proyecto) => {
        socket.to(proyecto).emit('nuevo colaborador', colaborador, proyecto);
    });
    // ELIMINAR UN COLABORADOR
    socket.on('eliminar colaborador', (colaborador, proyecto) => {
        socket
            .to(proyecto)
            .emit('colaborador eliminado', colaborador, proyecto);
    });
});
// ---- ---- ---- ---- ---- //
