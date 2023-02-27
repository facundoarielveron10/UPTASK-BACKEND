// ---- IMPORTACIONES ---- //
import Usuario from '../models/Usuario.js';
import generarId from '../helpers/generarId.js';
import generarJWT from '../helpers/generarJWT.js';
// ---- ---- ---- ---- ---- //

// ---- CONTROLADOR (USUARIO) ---- //
const registrar = async (req, res) => {
    // EVITAR REGISTROS DUPLICADOS
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({ email });

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // CREAR USUARIO
        const usuario = new Usuario(req.body);

        // CREAR TOKEN
        usuario.token = generarId();

        // ALMACENAR USUARIO EN LA BASE DE DATOS
        const usuarioAlmacenado = await usuario.save();

        // RETORNAR EL USUARIO ALMACENADO
        res.json(usuarioAlmacenado);
    } catch (error) {
        // MOSTRAR ERROR
        console.log(error);
    }
};

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // COMPROBAR SI EL USUARIO EXISTE
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        const error = new Error('El Usuario no existe');
        return res.status(404).json({ msg: error.message });
    }

    // COMPROBAR SI EL USUARIO ESTA CONFIRMADO
    if (!usuario.confirmado) {
        const error = new Error('Tu Cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    // COMPROBAR SU PASSWORD
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id),
        });
    } else {
        const error = new Error('El Password es Incorrecto');
        return res.status(403).json({ msg: error.message });
    }
};

const confirmar = async (req, res) => {
    // CONFIRMAR EL USUARIO
    const { token } = req.params;
    const usuarioConfirmar = await Usuario.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error('Token no valido');
        return res.status(403).json({ msg: error.message });
    }

    try {
        // Pasamos el confirmado a true y borramos el token
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = '';
        // Guardamos en la base de datos
        await usuarioConfirmar.save();
        // Retornamos un mensaje
        res.json({ msg: 'Usuario Confirmado Correctamente' });
    } catch (error) {
        // Mostramos el Error
        console.log(error);
    }
};
// ---- ---- ---- ---- ---- ---- ----//

// ---- EXPORTACIONES ---- //
export { registrar, autenticar, confirmar };
// ---- ---- ---- ---- ---- //
