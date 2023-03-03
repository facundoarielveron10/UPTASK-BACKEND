// ---- IMPORTACIONES ---- //
import express from 'express';
import {
	agregarTarea,
	obtenerTarea,
	actualizarTarea,
	eliminarTarea,
	cambiarEstado,
} from '../controllers/TareaController.js';
import checkAuth from '../middleware/checkAuth.js';
// ---- ---- ---- ---- ---- //

// ---- ENRUTADOR (USUARIO) ---- //
const router = express.Router();

// AGREGACION, OBTENCION, ACTUALIZACION, ELIMINACION Y CAMBIO DE ESTADO DE LAS TAREAS

// -- POST -- //
router.post('/', checkAuth, agregarTarea);
router.post('/estado/:id', checkAuth, cambiarEstado);
// -- -- -- -- //

// -- POST Y GET -- //
router
	.route('/:id')
	.get(checkAuth, obtenerTarea)
	.put(checkAuth, actualizarTarea)
	.delete(checkAuth, eliminarTarea);
// -- -- -- -- -- //

// ---- ---- ---- ---- ---- //

// ---- EXPORTACIONES ---- //
export default router;
// ---- ---- ---- ---- ---- //
