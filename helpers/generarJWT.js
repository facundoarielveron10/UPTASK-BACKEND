// ---- IMPORTACIONES ---- //
import jwt from 'jsonwebtoken';
// ---- ---- ---- ---- ---- //

// ---- JSON WEB TOKEN ---- //
const generarJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
// ---- ---- ---- ---- ---- //

// ---- EXPORTACIONES ---- //
export default generarJWT;
// ---- ---- ---- ---- ---- //
