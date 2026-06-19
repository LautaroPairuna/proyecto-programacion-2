const { 
    crearProfesionalService, 
    obtenerProfesionalesService, 
    obtenerProfesionalPorIdService, 
    actualizarProfesionalService, 
    eliminarProfesionalService 
} = require('./profesionales.service.js');

const crearProfesional = async (req, res) => {
    try {
        const profesional = await crearProfesionalService.crearProfesional(req.body);
        res.status(201).json({ message: 'Profesional creado con éxito', profesional });
    } catch (error) {
        res.status(500).json({ message: error.message.replace('Error al crear el profesional: ', '') });
    }
};

const obtenerProfesionales = async (req, res) => {
    try {
        const profesionales = await obtenerProfesionalesService.obtenerProfesionales();
        res.status(200).json(profesionales);
    } catch (error) {
        res.status(500).json({ message: error.message.replace('Error al obtener los profesionales: ', '') });
    }
};

const obtenerProfesionalPorId = async (req, res) => {
    try {
        const profesional = await obtenerProfesionalPorIdService.obtenerProfesionalPorId(req.params.id);
        if (!profesional) {
            return res.status(404).json({ message: 'Profesional no encontrado' });
        }
        res.status(200).json(profesional);
    } catch (error) {
        res.status(500).json({ message: error.message.replace('Profesional no encontrado: ', '') });
    }
};

const actualizarProfesional = async (req, res) => {
    try {
        const profesional = await actualizarProfesionalService.actualizarProfesional(req.params.id, req.body);
        if (!profesional) {
            return res.status(404).json({ message: 'Profesional no encontrado' });
        }
        res.status(200).json({ message: 'Profesional actualizado con éxito', profesional });
    } catch (error) {
        res.status(500).json({ message: error.message.replace('Error al actualizar el profesional: ', '') });
    }
};

const eliminarProfesional = async (req, res) => {
    try {
        await eliminarProfesionalService.eliminarProfesional(req.params.id);
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: error.message.replace('Error al eliminar el profesional: ', '') });
    }
};

module.exports = { crearProfesional, obtenerProfesionales, obtenerProfesionalPorId, actualizarProfesional, eliminarProfesional };