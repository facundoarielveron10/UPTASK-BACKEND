// ---- IMPORTACIONES ---- //
import nodemailer from 'nodemailer';
// ---- ---- ---- ---- ---- //

// ---- ENVIO EMAIL (REGISTRO DE USUARIO) ---- //
export const emailRegistro = async datos => {
	const { email, nombre, token } = datos;

	const transport = nodemailer.createTransport({
		host: 'sandbox.smtp.mailtrap.io',
		port: 2525,
		auth: {
			user: 'c19624c40e1a8c',
			pass: '9857e98b85180d',
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
