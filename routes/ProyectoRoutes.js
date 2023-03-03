// ---- IMPORTACIONES ---- //
import express from 'express';
import {
	obtenerProyectos,
	nuevoProyecto,
	obtenerProyecto,
	editarProyecto,
	eliminarProyecto,
	agregarColaborador,
	eliminarColaborador,
	obtenerTareas,
} from '../controllers/ProyectoController.js';
import checkAuth from '../middleware/checkAuth.js';
// ---- ---- ---- ---- ---- //

// ---- ENRUTADOR (PROYECTOS) ---- //
const router = express.Router();

// CREACION, OBTENCION, EDICION DE PROYECTOS E TAREAS Y AGREGACION, ELIMINACION DE COLABORADORES

// -- POST -- //
router.post('/agregar-colaborador/:id', checkAuth, agregarColaborador);
router.post('/eliminar-colaborador/:id', checkAuth, eliminarColaborador);
// -- -- -- -- //

// -- GET -- //
router.get('/tareas/:id', checkAuth, obtenerTareas);
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
