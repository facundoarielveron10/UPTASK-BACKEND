// ---- IMPORTACIONES ---- //
import Proyecto from '../models/Proyecto.js';
import Tarea from '../models/Tarea.js';
// ---- ---- ---- ---- ---- //

// ---- CONTROLADOR (PROYECTOS) ---- //
const obtenerProyectos = async (req, res) => {
    // OBTENER TODOS LOS PROYECTOS ASOCIADOS AL USUARIO
    const proyectos = await Proyecto.find()
        .where('creador')
        .equals(req.usuario);

    // Retornamos los proyectos
    res.json(proyectos);
};

const nuevoProyecto = async (req, res) => {
    // CREACION DE UN NUEVO PROYECTO
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id;

    try {
        // Guardamos en la base de datos
        const proyectoAlmacenado = await proyecto.save();
        // Retornamos el proyecto creado
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const obtenerProyecto = async (req, res) => {
    // OBTENER UN PROYECTO ELEGIDO POR EL USUARIO
    const { id } = req.params;

    // VERIFICAR LA EXISTENCIA DEL PROYECTO
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    // VERIFICAR QUE EL PROYECTO LE PERTENESCA AL USUARIO
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no valida');
        return res.status(401).json({ msg: error.message });
    }

    // RETORNAR LOS PROYECTOS Y LAS TAREAS
    res.json(proyecto);
};

const editarProyecto = async (req, res) => {
    // EDITAR PROYECTO SELECCIONADO POR EL USUARIO
    const { id } = req.params;

    // VERIFICAR LA EXISTENCIA DEL PROYECTO
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    // VERIFICAR QUE EL PROYECTO LE PERTENESCA AL USUARIO
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no valida');
        return res.status(401).json({ msg: error.message });
    }

    // EDITAR PROYECTO
    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente = req.body.cliente || proyecto.cliente;

    try {
        // Guardamos en la base de datos el proyecto
        const proyectoAlmacenado = await proyecto.save();
        // Retornamos el proyecto
        res.json(proyectoAlmacenado);
    } catch (error) {
        // Mostramos el error
        console.log(error);
    }
};

const eliminarProyecto = async (req, res) => {
    // ELIMINAR PROYECTO SELECCIONADO POR EL USUARIO
    const { id } = req.params;

    // VERIFICAR LA EXISTENCIA DEL PROYECTO
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    // VERIFICAR QUE EL PROYECTO LE PERTENESCA AL USUARIO
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no valida');
        return res.status(401).json({ msg: error.message });
    }

    // ELIMINAR PROYECTO
    try {
        await proyecto.deleteOne();
        res.json({ msg: 'Proyecto Eliminado' });
    } catch (error) {
        // Mostramos el error
        console.log(error);
    }
};

const agregarColaborador = async (req, res) => {};

const eliminarColaborador = async (req, res) => {};
// ---- ---- ---- ---- ---- ---- ----//

// ---- EXPORTACIONES ---- //
export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
};
// ---- ---- ---- ---- ---- //
