// ---- IMPORTACIONES ---- //
import mongoose from 'mongoose';
// ---- ---- ---- ---- ---- //

// ---- ESQUEMA TAREAS ---- //
const tareasSchema = mongoose.Schema(
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
        estado: {
            type: Boolean,
            default: false,
        },
        fechaEntrega: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        prioridad: {
            type: String,
            required: true,
            enum: ['Baja', 'Media', 'Alta'],
        },
        proyecto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Proyecto',
        },
        completado: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
        },
    },
    {
        timestamps: true,
    }
);
// ---- ---- ---- ---- ---- //

// ---- MODELO TAREAS ---- //
const Tarea = mongoose.model('Tarea', tareasSchema);
// ---- ---- ---- ---- ---- //

// ---- EXPORTACIONES ---- //
export default Tarea;
// ---- ---- ---- ---- ---- //
