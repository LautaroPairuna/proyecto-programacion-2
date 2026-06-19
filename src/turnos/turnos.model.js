const mongoose = require('mongoose');

const turnoSchema = new mongoose.Schema({
    fecha: { type: Date, required: true },
    hora: { type: String, required: true },
    profesional: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesional', required: true },
    paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    estado: { type: String, required: true, enum: ['pendiente', 'confirmado', 'cancelado'], default: 'pendiente' },
    especialidad: { type: String, required: true, trim: true },
   }, { timestamps: true });

const Turno = mongoose.model('Turno', turnoSchema);

module.exports = Turno;