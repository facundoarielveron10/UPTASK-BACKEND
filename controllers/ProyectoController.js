// ---- IMPORTACIONES ---- //
import Proyecto from '../models/Proyecto.js';
import Usuario from '../models/Usuario.js';
// ---- ---- ---- ---- ---- //

// ---- CONTROLADOR (PROYECTOS) ---- //
const obtenerProyectos = async (req, res) => {
    // OBTENER TODOS LOS PROYECTOS ASOCIADOS AL USUARIO
    const proyectos = await Proyecto.find()
        .where('creador')
        .equals(req.usuario)
        .select('-tareas');

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
        // Retornamos el proyecto exito
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const obtenerProyecto = async (req, res) => {
    // OBTENER UN PROYECTO ELEGIDO POR EL USUARIO
    const { id } = req.params;

    // VERIFICAR LA EXISTENCIA DEL PROYECTO
    const proyecto = await Proyecto.findById(id)
        .populate('tareas')
        .populate('creador', 'nombre email')
        .populate('colaboradores', 'nombre email');

    if (!proyecto) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    // VERIFICAR QUE EL PROYECTO LE PERTENESCA AL USUARIO
    if (proyecto.creador._id.toString() !== req.usuario._id.toString()) {
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

const buscarColaborador = async (req, res) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email }).select(
        '-confirmado -createdAt -password -token -updatedAt -__v '
    );

    if (!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    res.json(usuario);
};

const agregarColaborador = async (req, res) => {
    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
        const error = new Error('Proyecto No Encontrado');
        return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion No Valida');
        return res.status(404).json({ msg: error.message });
    }

    const { email } = req.body;
    const usuario = await Usuario.findOne({ email }).select(
        '-confirmado -createdAt -password -token -updatedAt -__v '
    );

    if (!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({ msg: error.message });
    }

    // El colaborador no es el admin del proyecto
    if (proyecto.creador.toString() === usuario._id.toString()) {
        const error = new Error(
            'El Creador del Proyecto no puede ser colaborador'
        );
        return res.status(404).json({ msg: error.message });
    }

    // Revisar que no este ya agregado al proyecto
    if (proyecto.colaboradores.includes(usuario._id)) {
        const error = new Error('El Usuario ya pertenece al proyecto');
        return res.status(404).json({ msg: error.message });
    }

    // Esta bien, se puede agregar
    proyecto.colaboradores.push(usuario._id);
    await proyecto.save();
    res.json({ msg: 'Colaborador Agregado Correctamente' });
};

const eliminarColaborador = async (req, res) => {
    const proyecto = await Proyecto.findById(req.body.id);

    if (!proyecto) {
        const error = new Error('Proyecto No Encontrado');
        return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion No Valida');
        return res.status(404).json({ msg: error.message });
    }

    // Esta bien, se puede eliminar
    proyecto.colaboradores.pull(req.params.id);

    await proyecto.save();
    res.json({ msg: 'Colaborador Agregado Correctamente' });
};
// ---- ---- ---- ---- ---- ---- ----//

// ---- EXPORTACIONES ---- //
export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
};
// ---- ---- ---- ---- ---- //
