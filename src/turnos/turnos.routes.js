const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');
const { 
    crearTurno, 
    obtenerMisTurnos, 
    obtenerTurnos, 
    actualizarTurnoController, 
    eliminarTurnoController 
} = require('./turnos.controller');

// Rutas para el paciente (cliente autenticado)
router.post('/', authMiddleware, requireRole('cliente'), crearTurno);
router.get('/mis-turnos', authMiddleware, requireRole('cliente'), obtenerMisTurnos);

// Rutas para el admin
router.get('/', authMiddleware, requireRole('admin'), obtenerTurnos);
router.put('/:id', authMiddleware, requireRole('admin'), actualizarTurnoController);
router.delete('/:id', authMiddleware, requireRole('admin'), eliminarTurnoController);

module.exports = router;