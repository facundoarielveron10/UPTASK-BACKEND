// ---- IMPORTACIONES ---- //
import express from 'express';
import {
    registrar,
    autenticar,
    confirmar,
} from '../controllers/UsuarioController.js';
// ---- ---- ---- ---- ---- //

// ---- ENRUTADOR (ROUTER) ---- //
const router = express.Router();

// AUTENTICACION, REGISTRO Y CONFIRMACION DE USUARIOS

// -- POST -- //
router.post('/', registrar);
router.post('/login', autenticar);
// -- -- -- -- //

// -- GET -- //
router.get('/confirmar/:token', confirmar);
// -- -- -- -- //

// ---- ---- ---- ---- ---- //

// ---- EXPORTACIONES ---- //
export default router;
// ---- ---- ---- ---- ---- //
