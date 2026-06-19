const jwt = require('jsonwebtoken');

// Verifica el JWT del header Authorization y adjunta req.usuario
const authMiddleware = (req, res, next) => {
    const encabezadoAuth = req.headers.authorization;
    if (!encabezadoAuth || !encabezadoAuth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
    const token = encabezadoAuth.split(' ')[1];
    try {
        const tokenDecodificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = { usuarioId: tokenDecodificado.userId, rol: tokenDecodificado.rol };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

// Retorna un middleware que permite acceso solo a los roles especificados.
// Debe ejecutarse después de authMiddleware para que req.usuario esté disponible.
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({ message: 'No tienes permiso para acceder a este recurso' });
        }
        next();
    };
};

module.exports = { authMiddleware, requireRole };