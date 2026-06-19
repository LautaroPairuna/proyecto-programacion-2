require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');

const app = express();
app.use(express.json());

const usuariosRouter = require('./src/usuarios/usuarios.routes');
const profesionalesRouter = require('./src/profesionales/profesionales.routes');
const turnosRouter = require('./src/turnos/turnos.routes');

app.use('/api/usuarios', usuariosRouter);
app.use('/api/profesionales', profesionalesRouter);
app.use('/api/turnos', turnosRouter);

// Solo levanta el servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
    connectDB().then(() => {
        const port = process.env.PORT;
        app.listen(port, () => {
            console.log(`El servidor está corriendo en el puerto ${port}`);
        });
    }).catch(err => {
        console.error('Error al conectar la DB:', err);
        process.exit(1);
    });
}

module.exports = app;