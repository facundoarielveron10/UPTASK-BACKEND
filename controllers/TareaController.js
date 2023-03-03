// ---- IMPORTACIONES ---- //
import Tarea from '../models/Tarea.js';
// ---- ---- ---- ---- ---- //

// ---- CONTROLADOR (TAREAS) ---- //
const agregarTarea = async (req, res) => {
	console.log(req.body);
};
const obtenerTarea = async (req, res) => {};
const actualizarTarea = async (req, res) => {};
const eliminarTarea = async (req, res) => {};
const cambiarEstado = async (req, res) => {};
// ---- ---- ---- ---- ---- ---- ----//

// ---- EXPORTACIONES ---- //
export {
	agregarTarea,
	obtenerTarea,
	actualizarTarea,
	eliminarTarea,
	cambiarEstado,
};
// ---- ---- ---- ---- ---- //
