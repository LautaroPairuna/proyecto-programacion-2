const request = require('supertest');
const mongoose = require('mongoose');
const Usuario = require('../src/usuarios/usuarios.model');
const app = require('../server');

describe('Profesionales', () => {

    let tokenAdmin;
    let tokenCliente;
    let profesionalId;

    beforeAll(async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
        // Admin con el modelo
        await Usuario.create({
            nombre: 'Admin', apellido: 'Pro', email: 'adminpro@test.com',
            contrasena: '123456', rol: 'admin'
        });
        const resAdmin = await request(app).post('/api/usuarios/login')
            .send({ email: 'adminpro@test.com', contrasena: '123456' });
        tokenAdmin = resAdmin.body.loginResult.token;

        // Cliente con el registro normal
        await request(app).post('/api/usuarios/register').send({
            nombre: 'Cliente', apellido: 'Pro', email: 'clientepro@test.com',
            contrasena: '123456'
        });
        const resCliente = await request(app).post('/api/usuarios/login')
            .send({ email: 'clientepro@test.com', contrasena: '123456' });
        tokenCliente = resCliente.body.loginResult.token;
    });

    it('debe crear un profesional (admin)', async () => {
        const res = await request(app)
            .post('/api/profesionales')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({ nombre: 'Carlos', apellido: 'López', especialidad: 'Cardiología' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('profesional');
        profesionalId = res.body.profesional._id;
    });

    it('debe rechazar crear profesional a un cliente', async () => {
        const res = await request(app)
            .post('/api/profesionales')
            .set('Authorization', `Bearer ${tokenCliente}`)
            .send({ nombre: 'Carlos', apellido: 'López', especialidad: 'Cardiología' });
        expect(res.status).toBe(403);
    });

    it('debe listar todos los profesionales (admin)', async () => {
        const res = await request(app)
            .get('/api/profesionales')
            .set('Authorization', `Bearer ${tokenAdmin}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('debe obtener un profesional por id (admin)', async () => {
        const res = await request(app)
            .get(`/api/profesionales/${profesionalId}`)
            .set('Authorization', `Bearer ${tokenAdmin}`);
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(profesionalId);
    });

    it('debe actualizar un profesional (admin)', async () => {
        const res = await request(app)
            .put(`/api/profesionales/${profesionalId}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({ especialidad: 'Neurología' });
        expect(res.status).toBe(200);
        expect(res.body.profesional.especialidad).toBe('Neurología');
    });

    it('debe eliminar un profesional (admin)', async () => {
        const res = await request(app)
            .delete(`/api/profesionales/${profesionalId}`)
            .set('Authorization', `Bearer ${tokenAdmin}`);
        expect(res.status).toBe(204);
    });
});