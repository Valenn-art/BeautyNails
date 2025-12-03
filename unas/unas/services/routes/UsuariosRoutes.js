const express = require("express");
const router = express.Router();
const usuariosController = require("../controller/UsuariosController.js");

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /registrar:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *               Apellido:
 *                 type: string
 *               Email:
 *                 type: string
 *               Telefono:
 *                 type: integer
 *               Password:
 *                 type: string
 *               Rol:
 *                 type: string
 *             required:
 *               - Nombre
 *               - Apellido
 *               - Email
 *               - Telefono
 *               - Password
 *               - Rol
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error en el servidor
 */
router.post("/registrar", usuariosController.createUsuario);
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *             required:
 *               - Email
 *               - Password
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error en el servidor
 */
router.post("/login", usuariosController.login);

module.exports = router;
