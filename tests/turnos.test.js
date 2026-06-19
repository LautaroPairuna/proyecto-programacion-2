const request = require('supertest');
const mongoose = require('mongoose');
const Usuario = require('../src/usuarios/usuarios.model');
const app = require('../server');

describe('Turnos', () => {

    let tokenAdmin;
    let tokenCliente;
    let profesionalId;
    let turnoId;

    beforeAll(async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
        // Admin con el modelo
        await Usuario.create({
            nombre: 'Admin', apellido: 'Turno', email: 'adminturno@test.com',
            contrasena: '123456', rol: 'admin'
        });
        const resAdmin = await request(app).post('/api/usuarios/login')
            .send({ email: 'adminturno@test.com', contrasena: '123456' });
        tokenAdmin = resAdmin.body.loginResult.token;

        // Cliente con registro normal
        await request(app).post('/api/usuarios/register').send({
            nombre: 'Cliente', apellido: 'Turno', email: 'clienteturno@test.com',
            contrasena: '123456'
        });
        const resCliente = await request(app).post('/api/usuarios/login')
            .send({ email: 'clienteturno@test.com', contrasena: '123456' });
        tokenCliente = resCliente.body.loginResult.token;

        // Profesional
        const resProfesional = await request(app)
            .post('/api/profesionales')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({ nombre: 'Ana', apellido: 'Martínez', especialidad: 'Pediatría' });
        profesionalId = resProfesional.body.profesional._id;
    });

    it('debe crear un turno (cliente)', async () => {
        const res = await request(app)
            .post('/api/turnos')
            .set('Authorization', `Bearer ${tokenCliente}`)
            .send({
                fecha: '2026-07-01',
                hora: '10:00',
                profesionalId,
                especialidad: 'Pediatría'
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('turno');
        turnoId = res.body.turno._id;

    });

    it('debe rechazar turno duplicado', async () => {
        const res = await request(app)
            .post('/api/turnos')
            .set('Authorization', `Bearer ${tokenCliente}`)
            .send({
                fecha: '2026-07-01',
                hora: '10:00',
                profesionalId,
                especialidad: 'Pediatría'
            });
        expect(res.status).toBe(400);
    });

    it('debe ver sus propios turnos (cliente)', async () => {
        const res = await request(app)
            .get('/api/turnos/mis-turnos')
            .set('Authorization', `Bearer ${tokenCliente}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('debe ver todos los turnos (admin)', async () => {
        const res = await request(app)
            .get('/api/turnos')
            .set('Authorization', `Bearer ${tokenAdmin}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('debe filtrar turnos por estado (admin)', async () => {
        const res = await request(app)
            .get('/api/turnos?estado=pendiente')
            .set('Authorization', `Bearer ${tokenAdmin}`);
        expect(res.status).toBe(200);
    });

    it('debe actualizar el estado de un turno (admin)', async () => {
        const res = await request(app)
            .put(`/api/turnos/${turnoId}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({ estado: 'confirmado' });
        expect(res.status).toBe(200);
        expect(res.body.turno.estado).toBe('confirmado');
    });

    it('debe rechazar acceso a todos los turnos a un cliente', async () => {
        const res = await request(app)
            .get('/api/turnos')
            .set('Authorization', `Bearer ${tokenCliente}`);
        expect(res.status).toBe(403);
    });

    it('debe eliminar un turno (admin)', async () => {
        const res = await request(app)
            .delete(`/api/turnos/${turnoId}`)
            .set('Authorization', `Bearer ${tokenAdmin}`);
        expect(res.status).toBe(200);
    });
});