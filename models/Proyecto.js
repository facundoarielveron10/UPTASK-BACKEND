// ---- IMPORTACIONES ---- //
import mongoose from 'mongoose';
// ---- ---- ---- ---- ---- //

// ---- ESQUEMA PROYECTOS ---- //
const proyectosSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            trim: true,
            required: true,
        },
        descripcion: {
            type: String,
            trim: true,
            required: true,
        },
        fechaEntrega: {
            type: Date,
            default: Date.now(),
        },
        cliente: {
            type: String,
            trim: true,
            required: true,
        },
        creador: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
        },
        tareas: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tarea',
            },
        ],
        colaboradores: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Usuario',
            },
        ],
    },
    {
        timestamps: true,
    }
);
// ---- ---- ---- ---- ---- //

// ---- MODELO PROYECTOS ---- //
const Proyecto = mongoose.model('Proyecto', proyectosSchema);
// ---- ---- ---- ---- ---- //

// ---- EXPORTACIONES ---- //
export default Proyecto;
// ---- ---- ---- ---- ---- //
