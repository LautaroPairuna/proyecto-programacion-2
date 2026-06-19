const mongoose = require('mongoose');

// Creacion del modelo de profesional
const profesionalModelSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  especialidad: { type: String, required: true, trim: true },
}, { timestamps: true });


const Profesional = mongoose.model('Profesional', profesionalModelSchema);

module.exports = Profesional;
