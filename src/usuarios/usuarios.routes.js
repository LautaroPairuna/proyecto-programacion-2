const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');
const { register, login, me, adminOnly } = require('./usuarios.controller.js');

router.post('/register', [
    body('email').isEmail().withMessage('Email inválido'),
    body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
], register);

router.post('/login', [
    body('email').isEmail().withMessage('Email inválido'),
    body('contrasena').notEmpty().withMessage('La contraseña es obligatoria'),
], login);

router.get('/me', authMiddleware, me);
router.get('/admin-only', authMiddleware, requireRole('admin'), adminOnly);

module.exports = router;
