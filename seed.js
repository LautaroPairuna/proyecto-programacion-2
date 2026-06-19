require('dotenv').config();
const connectDB = require('./src/config/db');
const mongoose = require('mongoose');
const Usuario = require('./src/usuarios/usuarios.model');

const crearAdmin = async () => {
    try {
        await connectDB();

        const adminExistente = await Usuario.findOne({ email: 'admin@admin.com' });
        if (adminExistente) {
            console.log('El admin ya existe');
            await mongoose.connection.close();
            return;
        }

        await Usuario.create({
            nombre: 'Admin',
            apellido: 'Principal',
            email: 'admin@admin.com',
            contrasena: 'admin123',
            rol: 'admin'
        });

        console.log('Admin creado con éxito');
        console.log('Email: admin@admin.com');
        console.log('Contraseña: admin123');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error al crear el admin:', error.message);
        process.exit(1);
    }
};

crearAdmin();