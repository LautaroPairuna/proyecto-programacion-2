const router = require('express').Router();
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');
const { crearProfesional, obtenerProfesionales, obtenerProfesionalPorId, actualizarProfesional, eliminarProfesional } = require('./profesionales.controller');

router.get('/', authMiddleware, requireRole('admin'), obtenerProfesionales);
router.get('/:id', authMiddleware, requireRole('admin'), obtenerProfesionalPorId);
router.post('/', authMiddleware, requireRole('admin'), crearProfesional);
router.put('/:id', authMiddleware, requireRole('admin'), actualizarProfesional);
router.delete('/:id', authMiddleware, requireRole('admin'), eliminarProfesional);

module.exports = router;