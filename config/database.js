// ---- IMPORTACIONES ---- //
import mongoose from 'mongoose';
// ---- ---- ---- ---- ---- //

// ---- BASE DE DATOS ---- //
const conectarDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.DB_URL}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log(`MongoDB Conectado en: ${url}`);
    } catch (error) {
        // Mostrar Error
        console.log(`Error: ${error.message}`);
        // Terminar con todos los procesos si ocurre un error
        process.exit(1);
    }
};
// ---- ---- ---- ---- ---- //

export default conectarDB;
