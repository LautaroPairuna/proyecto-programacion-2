const Profesional = require('./profesionales.model.js');

const crearProfesionalService = {
    async crearProfesional(datos) {
        try {
            return await Profesional.create(datos);
        } catch (error) {
            throw new Error('Error al crear el profesional: ' + error.message);
        }
    },
}

const obtenerProfesionalesService = {
    async obtenerProfesionales() {
        try {
            return await Profesional.find();
        } catch (error) {
            throw new Error('Error al obtener los profesionales: ' + error.message);
        }
    },
}

const obtenerProfesionalPorIdService = {
    async obtenerProfesionalPorId(profesionalId) {
        try {
            return await Profesional.findById(profesionalId);
        } catch (error) {
            throw new Error('Profesional no encontrado: ' + error.message);
        }
    },
}

const actualizarProfesionalService = {
    async actualizarProfesional(profesionalId, datos) {
        try {
            return await Profesional.findByIdAndUpdate(profesionalId, datos, { new: true });
        } catch (error) {
            throw new Error('Error al actualizar el profesional: ' + error.message);
        }
    },
}

const eliminarProfesionalService = {
    async eliminarProfesional(profesionalId) {
        try {
            return await Profesional.findByIdAndDelete(profesionalId);
        } catch (error) {
            throw new Error('Error al eliminar el profesional: ' + error.message);
        }
    },
}

module.exports = {
    crearProfesionalService,
    obtenerProfesionalesService,
    obtenerProfesionalPorIdService,
    actualizarProfesionalService,
    eliminarProfesionalService,
}