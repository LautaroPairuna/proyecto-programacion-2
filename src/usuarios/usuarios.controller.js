const { validationResult } = require('express-validator');
const { registrarUsuarioService, loginUsuarioService, meUsuarioService } = require('./usuarios.service.js');

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Forzamos rol cliente: el registro público nunca crea admins
        const datos = { ...req.body, rol: 'cliente' };
        const usuario = await registrarUsuarioService.registrarUsuario(datos);
        res.status(201).json({ message: 'Usuario registrado con éxito', usuario });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const loginResult = await loginUsuarioService.loginUsuario(req.body);
        res.status(200).json({ message: 'Login exitoso', loginResult });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const me = async (req, res) => {
    try {
        const usuario = await meUsuarioService.meUsuario(req.usuario.usuarioId);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ usuario });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const adminOnly = (req, res) => {
    res.json({ message: 'Acceso concedido al área de administración', usuario: req.usuario });
};

module.exports = { register, login, me, adminOnly };

