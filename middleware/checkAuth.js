// ---- IMPORTACIONES ---- //
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
// ---- ---- ---- ---- ---- //

// ---- MIDDLEWARE (AUTENTICACION PERFIL) ---- //
const checkAuth = async (req, res, next) => {
    // BUSCAMOS EL TOKEN
    let token;
    // SI EXISTE EL TOKEN
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // DECODIFICAMOS EL TOKEN
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // QUITAMOS DATOS INECESARIOS
            req.usuario = await Usuario.findById(decoded.id).select(
                '-password -confirmado -token -createdAt -updatedAt -__v'
            );

            // NOS VAMOS AL SIGUIENTE MIDDLEWARE
            return next();
        } catch (error) {
            // Mostramos el Error
            return res.status(404).json({ msg: 'Hubo un error' });
        }
    }

    if (!token) {
        const error = new Error('Token no valido');
        res.status(401).json({ msg: error.message });
    }
};
// ---- ---- ---- ---- //

// ---- EXPORTACIONES ---- //
export default checkAuth;
// ---- ---- ---- ---- ---- //
