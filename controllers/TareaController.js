// ---- IMPORTACIONES ---- //
import Tarea from '../models/Tarea.js';
import Proyecto from '../models/Proyecto.js';
import { json } from 'express';
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
        // Almacenar el ID en el proyecto
        existeProyecto.tareas.push(tareaAlmacenada._id);
        await existeProyecto.save();
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
            'No tienes los permisos para acceder a esta tarea'
        );
        return res.status(403).json({ msg: error.message });
    }

    res.json(tarea);
};

const actualizarTarea = async (req, res) => {
    // EDITAR TAREA SELECCIONADA POR EL USUARIO
    const { id } = req.params;

    // REVISAR LA EXISTENCIA DE LA TAREA SELECCIONADA
    const tarea = await Tarea.findById(id).populate('proyecto');

    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return res.status(404).json({ msg: error.message });
    }

    // VERIFICAR QUE LA TEREA ESTE ASOCIADA A UN PROYECTO QUE LE PERTENESCA AL USUARIO
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error(
            'No tienes los permisos para editar esta tarea'
        );
        return res.status(403).json({ msg: error.message });
    }

    // EDITAR TAREA
    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;

    // RETORNAMOS LA TAREA ACTUALIZADO
    try {
        // Guardamos en la base de datos la tarea
        const tareaAlmacenada = await tarea.save();
        // Retornamos la tarea
        res.json(tareaAlmacenada);
    } catch (error) {
        // Mostramos el error
        console.log(error);
    }
};

const eliminarTarea = async (req, res) => {
    // ELIMINAR TAREA SELECCIONADA POR EL USUARIO
    const { id } = req.params;

    // REVISAR LA EXISTENCIA DE LA TAREA SELECCIONADA
    const tarea = await Tarea.findById(id).populate('proyecto');

    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return res.status(404).json({ msg: error.message });
    }

    // VERIFICAR QUE LA TEREA ESTE ASOCIADA A UN PROYECTO QUE LE PERTENESCA AL USUARIO
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error(
            'No tienes los permisos para eliminar esta tarea'
        );
        return res.status(403).json({ msg: error.message });
    }

    // ELIMINAR LA TAREA
    try {
        await tarea.deleteOne();
        res.json({ msg: 'Tarea Eliminada' });
    } catch (error) {
        // Mostrar el error
        console.log(error);
    }
};

const cambiarEstado = async (req, res) => {
    // CAMBIAR ESTADO DE LA TAREA SELECCIONADA POR EL USUARIO
    const { id } = req.params;

    // REVISAR LA EXISTENCIA DE LA TAREA SELECCIONADA
    const tarea = await Tarea.findById(id).populate('proyecto');

    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return res.status(404).json({ msg: error.message });
    }

    // VERIFICAR QUE LA TEREA ESTE ASOCIADA A UN PROYECTO QUE LE PERTENESCA AL USUARIO
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error(
            'No tienes los permisos para cambiar de estado esta tarea'
        );
        return res.status(403).json({ msg: error.message });
    }

    // CAMBIAR ESTADO DE LA TAREA
    tarea.estado === false ? (tarea.estado = true) : (tarea.estado = false);
    res.json({ msg: 'Cambio de estado exitoso' });

    // RETORNAMOS UN MENSAJE
    try {
        // Guardamos en la base de datos la tarea
        await tarea.save();
        // Retornamos el mensaje
        res.json({ msg: 'Cambio de estado exitoso' });
    } catch (error) {
        // Mostramos el error
        console.log(error);
    }
};
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
