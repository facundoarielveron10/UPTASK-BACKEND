// ---- IMPORTACIONES ---- //
import express from 'express';
import {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
} from '../controllers/ProyectoController.js';
import checkAuth from '../middleware/checkAuth.js';
// ---- ---- ---- ---- ---- //

// ---- ENRUTADOR (PROYECTOS) ---- //
const router = express.Router();

// CREACION, OBTENCION, EDICION DE PROYECTOS E TAREAS Y AGREGACION, ELIMINACION DE COLABORADORES

// -- POST -- //
router.post('/colaboradores', checkAuth, buscarColaborador);
router.post('/colaboradores/:id', checkAuth, agregarColaborador);
router.delete('/colaboradores/:id', checkAuth, eliminarColaborador);
// -- -- -- -- //

// -- POST Y GET -- //
router
    .route('/')
    .get(checkAuth, obtenerProyectos)
    .post(checkAuth, nuevoProyecto);
router
    .route('/:id')
    .get(checkAuth, obtenerProyecto)
    .put(checkAuth, editarProyecto)
    .delete(checkAuth, eliminarProyecto);
// -- -- -- -- -- //

// ---- ---- ---- ---- ---- //

// ---- EXPORTACIONES ---- //
export default router;
// ---- ---- ---- ---- ---- //
