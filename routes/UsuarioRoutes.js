// ---- IMPORTACIONES ---- //
import express from 'express';
import {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil,
} from '../controllers/UsuarioController.js';
import checkAuth from '../middleware/checkAuth.js';
// ---- ---- ---- ---- ---- //

// ---- ENRUTADOR (ROUTER) ---- //
const router = express.Router();

// AUTENTICACION, REGISTRO Y CONFIRMACION DE USUARIOS

// -- POST -- //
router.post('/', registrar);
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);
// -- -- -- -- //

// -- GET -- //
router.get('/confirmar/:token', confirmar);
router.get('/perfil', checkAuth, perfil);
// -- -- -- -- //

// -- POST Y GET -- //
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);
// -- -- -- -- -- //

// ---- ---- ---- ---- ---- //

// ---- EXPORTACIONES ---- //
export default router;
// ---- ---- ---- ---- ---- //
