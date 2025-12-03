const Personal = require("../model/PersonalModel");
const express = require('express');
const router = express.Router();
const personalController = require('../controller/PersonalController.js');
const checkAuth = require('../middleware/verAuth');
const checkRole = require('../middleware/veRol');

/**
 * @swagger
 * tags:
 *   name: Personal
 *   description: Gestión del personal
 */

/**
 * @swagger
 * /personal:
 *   get:
 *     summary: Obtener personal con su servicio asociado
 *     tags: [Personal]
 *     responses:
 *       200:
 *         description: Lista de personal con servicios
 *       500:
 *         description: Error en el servidor
 */
router.post('/nuevoPersonal', personalController.createPersonal);

/**
 * @swagger
 * /nuevoPersonal:
 *   post:
 *     summary: Registrar un nuevo personal
 *     tags: [Personal]
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
 *               contra:
 *                 type: string
 *               FK_ID_servicio:
 *                 type: integer
 *             required:
 *               - Nombre
 *               - Apellido
 *               - Email
 *               - contra
 *               - FK_ID_servicio
 *     responses:
 *       201:
 *         description: Personal registrado exitosamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error en el servidor
 */
router.post(
    '/personal', 
    checkAuth, 
    checkRole, 
    personalController.createPersonal
);

router.delete(
    '/personal/:id', 
    checkAuth, 
    checkRole, 
    personalController.deletePersonal
);
module.exports = router;