const Turno = require('./turnos.model');

const verificarDisponibilidad = async (fecha, hora, profesionalId) => {
    const turnoExistente = await Turno.findOne({ fecha, hora, profesional: profesionalId });
    if (turnoExistente) {
        throw new Error('Ya existe un turno en ese horario para ese profesional');
    }
}

const crearTurnoPaciente = async (fecha, hora, profesionalId, pacienteId, especialidad) => {
    try {
        await verificarDisponibilidad(fecha, hora, profesionalId);
        const turno = new Turno({
            fecha,
            hora,
            profesional: profesionalId,
            paciente: pacienteId,
            estado: 'pendiente',
            especialidad,
        });
        return await turno.save();
    } catch (error) {
        throw new Error('Error al crear el turno: ' + error.message);
    }
}

const obtenerTodosTurnos = async (filtros) => {
    const query = {};
    if (filtros.profesional) {
        query.profesional = filtros.profesional;
    }
    if (filtros.estado) {
        query.estado = filtros.estado;
    }
    if (filtros.especialidad) {
        query.especialidad = filtros.especialidad;
    }
    return await Turno.find(query)
        .populate('profesional')
        .populate('paciente', '-contrasena');
}

const obtenerTurnosPacientes = async (pacienteId) => {
    return await Turno.find({ paciente: pacienteId })
        .populate('profesional')
}

const actualizarTurno = async (turnoId, datos) => {
    const turno = await Turno.findByIdAndUpdate(turnoId, datos, { new: true });
    if (!turno) {
        throw new Error('Turno no encontrado');
    }
    return turno;
}

const eliminarTurno = async (turnoId) => {
    const turno = await Turno.findByIdAndDelete(turnoId);
    if (!turno) {
        throw new Error('Turno no encontrado');
    }
    return turno;
}

module.exports = {
    crearTurnoPaciente,
    obtenerTodosTurnos,
    obtenerTurnosPacientes,
    actualizarTurno,
    eliminarTurno,
}
