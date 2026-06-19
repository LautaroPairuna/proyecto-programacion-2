const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Creacion del modelo de usuario
const usuarioSchema = new mongoose.Schema({
  rol: { type: String, required: true, enum: ['cliente', 'admin'], default: 'cliente' },
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  contrasena: { type: String, required: true, trim: true, minlength: 6 },
}, { timestamps: true });

usuarioSchema.pre('save', async function () {
    if (!this.isModified('contrasena')) return;
    this.contrasena = await bcrypt.hash(this.contrasena, 10);
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;