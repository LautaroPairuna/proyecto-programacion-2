const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Usuario = require('../src/usuarios/usuarios.model');

describe('Usuarios', () => {

    let tokenAdmin;
    let tokenCliente;

    beforeAll(async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
        // Creamos el admin directamente con el modelo
        await Usuario.create({
            nombre: 'Admin', apellido: 'Sistema', email: 'admin@test.com',
            contrasena: '123456', rol: 'admin'
        });
    });

    it('debe registrar un usuario cliente', async () => {
        const res = await request(app)
            .post('/api/usuarios/register')
            .send({
                nombre: 'Juan', apellido: 'Pérez',
                email: 'juan@test.com', contrasena: '123456'
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('usuario');
    });

    it('el registro público siempre crea rol cliente', async () => {
        const res = await request(app)
            .post('/api/usuarios/register')
            .send({
                nombre: 'Hacker', apellido: 'Test',
                email: 'hacker@test.com', contrasena: '123456',
                rol: 'admin' // intentamos forzar admin
            });
        expect(res.status).toBe(201);
        expect(res.body.usuario.rol).toBe('cliente'); // pero queda cliente
    });

    it('debe hacer login con el cliente', async () => {
        const res = await request(app)
            .post('/api/usuarios/login')
            .send({ email: 'juan@test.com', contrasena: '123456' });
        expect(res.status).toBe(200);
        expect(res.body.loginResult).toHaveProperty('token');
        tokenCliente = res.body.loginResult.token;
    });

    it('debe hacer login con el admin', async () => {
        const res = await request(app)
            .post('/api/usuarios/login')
            .send({ email: 'admin@test.com', contrasena: '123456' });
        expect(res.status).toBe(200);
        tokenAdmin = res.body.loginResult.token;
    });

    it('debe rechazar login con contraseña incorrecta', async () => {
        const res = await request(app)
            .post('/api/usuarios/login')
            .send({ email: 'juan@test.com', contrasena: 'incorrecta' });
        expect(res.status).toBe(400);
    });

    it('debe acceder a /me con token válido', async () => {
        const res = await request(app)
            .get('/api/usuarios/me')
            .set('Authorization', `Bearer ${tokenCliente}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('usuario');
    });

    it('debe rechazar /me sin token', async () => {
        const res = await request(app).get('/api/usuarios/me');
        expect(res.status).toBe(401);
    });

    it('debe rechazar /admin-only a un cliente', async () => {
        const res = await request(app)
            .get('/api/usuarios/admin-only')
            .set('Authorization', `Bearer ${tokenCliente}`);
        expect(res.status).toBe(403);
    });

    it('debe permitir /admin-only a un admin', async () => {
        const res = await request(app)
            .get('/api/usuarios/admin-only')
            .set('Authorization', `Bearer ${tokenAdmin}`);
        expect(res.status).toBe(200);
    });
});