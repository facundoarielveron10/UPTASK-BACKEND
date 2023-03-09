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
		await usuario.save();

		// RETORNAR EL USUARIO ALMACENADO
		res.json({
			msg: 'Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta',
		});
	} catch (error) {
		// MOSTRAR ERROR
		console.log(error);
	}
};

const autenticar = async (req, res) => {
	// AUTENTICAR EL USUARIO
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

	// EL USUARIO EXISTE Y SU TOKEN COINCIDEN
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

const olvidePassword = async (req, res) => {
	// ¿OLVIDASTE TU PASSWORD?, RECUPERARLO AQUI
	// VALIDACION, EL USUARIO EXISTE
	const { email } = req.body;
	const usuario = await Usuario.findOne({ email });
	if (!usuario) {
		const error = new Error('El Usuario no existe');
		return res.status(404).json({ msg: error.message });
	}

	// VALIDAMOS SU TOKEN, Y LE ENVIAMOS LAS INSTRUCCIONES
	try {
		// Generamos un nuevo token
		usuario.token = generarId();
		// Guardamos el nuevo token en la Base de datos
		await usuario.save();
		// Retornamos un respuesta
		res.json({ msg: 'Hemos enviado un email con las instrucciones' });
	} catch (error) {
		// Mostramos el Error
		console.log(error);
	}
};

const comprobarToken = async (req, res) => {
	// COMPROBACION DE TOKEN
	const { token } = req.params;
	const tokenConfirmar = await Usuario.findOne({ token });

	if (tokenConfirmar) {
		res.json({ msg: 'Token valido y el Usuario existe' });
	} else {
		const error = new Error('Token no valido');
		return res.status(403).json({ msg: error.message });
	}
};

const nuevoPassword = async (req, res) => {
	// REESTABLESEMOS EL PASSWORD
	const { token } = req.params;
	const { password } = req.body;

	// COMPROBACION DE TOKEN
	const usuario = await Usuario.findOne({ token });

	if (usuario) {
		// Reescribimos el password
		usuario.password = password;
		// Borramos el token
		usuario.token = '';
		// Guardamos los nuevos datos en la Base de datos y retornamos un mensaje
		try {
			await usuario.save();
			res.json({ msg: 'Password Modificado Correctamente' });
		} catch (error) {
			// Mostramos el error
			console.log(error);
		}
	} else {
		const error = new Error('Token no valido');
		return res.status(403).json({ msg: error.message });
	}
};

const perfil = async (req, res) => {
	// RETORNAMOS LOS DATOS DEL PERFIL DEL USUARIO
	res.json(req.usuario);
};
// ---- ---- ---- ---- ---- ---- ----//

// ---- EXPORTACIONES ---- //
export {
	registrar,
	autenticar,
	confirmar,
	olvidePassword,
	comprobarToken,
	nuevoPassword,
	perfil,
};
// ---- ---- ---- ---- ---- //
