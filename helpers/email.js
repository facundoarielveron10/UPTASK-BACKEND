// ---- IMPORTACIONES ---- //
import nodemailer from 'nodemailer';
// ---- ---- ---- ---- ---- //

// ---- ENVIO EMAIL (REGISTRO DE USUARIO) ---- //
export const emailRegistro = async datos => {
	const { email, nombre, token } = datos;

	const transport = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const info = await transport.sendMail({
		from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
		to: email,
		subject: 'UpTask - Comprueba tu cuenta',
		text: 'Comprueba tu cuenta en UpTask',
		html: `
        <p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
        <p>
            Tu Cuenta ya esta casi lista, solo tienes que comprobarla en el siguiente enlace: 
            <a href="${process.env.FRONT_URL}/confirmar/${token}">Comprobar Cuenta</a>
        </p>
        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `,
	});
};
// ---- ---- ---- ---- ---- //

// ---- ENVIO EMAIL (REESTABLECER PASSWORD) ---- //
export const emailReestablecer = async datos => {
	const { email, nombre, token } = datos;

	const transport = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const info = await transport.sendMail({
		from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
		to: email,
		subject: 'UpTask - Reestablece tu Contraseña',
		text: 'Reestablece tu contraseña de UpTask',
		html: `
        <p>Hola: ${nombre} has solicitado reestablecer tu constraseña de UpTask</p>
        <p>
            Sigue el siguente enlace para generar una nueva contraseña: 
            <a href="${process.env.FRONT_URL}/olvide-password/${token}">Reestablecer Contraseña</a>
        </p>
        <p>Si tu no has solicitado generar una nueva contraseña ignora este mensaje</p>
        `,
	});
};
// ---- ---- ---- ---- ---- //
