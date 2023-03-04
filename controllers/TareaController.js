// ---- IMPORTACIONES ---- //
import Tarea from '../models/Tarea.js';
import Proyecto from '../models/Proyecto.js';
// ---- ---- ---- ---- ---- //

// ---- CONTROLADOR (TAREAS) ---- //
const agregarTarea = async (req, res) => {
	// VERIFICAR LA EXISTENCIA DEL PROYECTO
	const { proyecto } = req.body;
	const existeProyecto = await Proyecto.findById(proyecto);

	if (!existeProyecto) {
		const error = new Error('Proyecto no encontrado');
		return res.status(404).json({ msg: error.message });
	}

	// VERIFICAR SI EL USUARIO AUTENTICADO ES EL CREADOR DEL PROYECTO
	if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
		const error = new Error('No tienes los permisos para añadir tareas');
		return res.status(403).json({ msg: error.message });
	}

	// AGREGAR LA TAREA AL PROYECTO SELECCIONADO
	try {
		const tareaAlmacenada = await Tarea.create(req.body);
		res.json(tareaAlmacenada);
	} catch (error) {
		// Mostrar el error
		console.log(error);
	}
};

const obtenerTarea = async (req, res) => {
	// OBTENER UNA TAREA ELEGIDA POR EL USUARIO
	const { id } = req.params;

	// VERIFICAR LA EXISTENCIA DE LA TAREA
	const tarea = await Tarea.findById(id).populate('proyecto');

	if (!tarea) {
		const error = new Error('Tarea no encontrada');
		return res.status(404).json({ msg: error.message });
	}

	// VERIFICAR QUE LA TEREA ESTE ASOCIADA A UN PROYECTO QUE LE PERTENESCA AL USUARIO
	if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
		const error = new Error(
			'No tienes los permisos para acceder a esta tarea',
		);
		return res.status(403).json({ msg: error.message });
	}

	res.json(tarea);
};

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
