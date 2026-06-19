const { 
    crearTurnoPaciente, 
    obtenerTodosTurnos, 
    obtenerTurnosPacientes, 
    actualizarTurno, 
    eliminarTurno 
} = require('./turnos.service');

// Crea un turno nuevo para el paciente autenticado
const crearTurno = async (req, res) => {
    try {
        const { fecha, hora, profesionalId, especialidad } = req.body;
        const pacienteId = req.usuario.usuarioId;
        const turno = await crearTurnoPaciente(fecha, hora, profesionalId, pacienteId, especialidad);
        res.status(201).json({ message: 'Turno creado con éxito', turno });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Devuelve solo los turnos del paciente autenticado
const obtenerMisTurnos = async (req, res) => {
    try {
        const turnos = await obtenerTurnosPacientes(req.usuario.usuarioId);
        res.status(200).json(turnos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Devuelve todos los turnos (admin), acepta filtros por query params
// Ejemplo: /api/turnos?estado=pendiente&especialidad=cardiologia
const obtenerTurnos = async (req, res) => {
    try {
        const turnos = await obtenerTodosTurnos(req.query);
        res.status(200).json(turnos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualiza cualquier campo de un turno, incluido el estado (admin)
const actualizarTurnoController = async (req, res) => {
    try {
        const turno = await actualizarTurno(req.params.id, req.body);
        res.status(200).json({ message: 'Turno actualizado con éxito', turno });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Elimina un turno por id (admin)
const eliminarTurnoController = async (req, res) => {
    try {
        await eliminarTurno(req.params.id);
        res.status(200).json({ message: 'Turno eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    crearTurno, 
    obtenerMisTurnos, 
    obtenerTurnos, 
    actualizarTurnoController, 
    eliminarTurnoController 
};