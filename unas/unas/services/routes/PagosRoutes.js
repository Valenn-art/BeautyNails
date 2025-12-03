// PagosRoutes.js

const express = require('express');
const router = express.Router();
const pagosController = require('../controller/PagosController.js');



/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Gestión de pagos
 */

/**
 * @swagger
 * /registrarPago:
 *   post:
 *     summary: Registrar un nuevo pago
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FK_ID_turnos:
 *                 type: integer
 *               Monto:
 *                 type: integer
 *               Metodo:
 *                 type: string
 *               Fecha_pago:
 *                 type: string
 *                 format: date
 *             required:
 *               - FK_ID_turnos
 *               - Monto
 *               - Metodo
 *               - Fecha_pago
 *     responses:
 *       201:
 *         description: Pago registrado exitosamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error en el servidor
 */
router.post('/registrarPago', pagosController.registrarPago);

module.exports = router;