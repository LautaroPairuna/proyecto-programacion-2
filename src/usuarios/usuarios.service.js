const Usuario = require('./usuarios.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Creacion del servicio de usuario
const registrarUsuarioService = {
    async registrarUsuario(datos) {
        return await Usuario.create(datos);
    },
}

const loginUsuarioService = {
    async loginUsuario(datos) {
        const usuario = await Usuario.findOne({ email: datos.email });
        if (!usuario) {
            throw new Error('El usuario no existe');
        }
        const passwordValido = await bcrypt.compare(datos.contrasena, usuario.contrasena);
        if (!passwordValido) {
            throw new Error('La contrasena es incorrecta');
        }
        const token = jwt.sign({ userId: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { token, usuario: {id: usuario._id, email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido, rol: usuario.rol} };
    },
}

const meUsuarioService = {
    async meUsuario(userId) {
        return await Usuario.findById(userId).select('-contrasena');
    },
};

module.exports = {
    registrarUsuarioService,
    loginUsuarioService,
    meUsuarioService,
}
