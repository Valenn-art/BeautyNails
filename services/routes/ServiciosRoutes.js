const express = require('express');
const router = express.Router();
const serviciosController = require('../controller/ServiciosController.js');
const personalController = require('../controller/PersonalController.js');

router.get('/servicios', serviciosController.getServicios);
/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: Gestión de servicios
 */

/**
 * @swagger
 * /nuevoServicio:
 *   post:
 *     summary: Crear un nuevo servicio
 *     tags: [Servicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre_servicio:
 *                 type: string
 *               Precio:
 *                 type: integer
 *               Duracion:
 *                 type: string
 *             required:
 *               - Nombre_servicio
 *               - Precio
 *               - Duracion
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error en el servidor
 */
router.post('/nuevoServicio', serviciosController.createServicio);

router.post('/nuevoPersonal', personalController.createPersonal);
router.get('/personal', personalController.getPersonalConServicio); 


module.exports = router;