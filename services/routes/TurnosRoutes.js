const express = require("express");
const router = express.Router();
const turnosController = require("../controller/TurnosController.js");
/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: Gestión de turnos
 */

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Obtener todos los turnos
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos
 *       500:
 *         description: Error en el servidor
 */
router.get("/turnosall", turnosController.getTurnos);

/**
 * @swagger
 * /crearturnos:
 *   post:
 *     summary: Crear un nuevo turno
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FK_ID_usuarios:
 *                 type: integer
 *               FK_ID_servicios:
 *                 type: integer
 *               FK_ID_personal:
 *                 type: integer
 *               Fecha:
 *                 type: string
 *                 format: date
 *               Hora:
 *                 type: string
 *               Estado:
 *                 type: string
 *             required:
 *               - FK_ID_usuarios
 *               - FK_ID_servicios
 *               - FK_ID_personal
 *               - Fecha
 *               - Hora
 *               - Estado
 *     responses:
 *       201:
 *         description: Turno creado exitosamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error en el servidor
 */
router.post("/crearturnos", turnosController.createTurno);

/**
 * @swagger
 * /turnos/{id}:
 *   put:
 *     summary: Actualizar un turno por ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Fecha:
 *                 type: string
 *                 format: date
 *               Hora:
 *                 type: string
 *               Estado:
 *                 type: string
 *             required:
 *               - Fecha
 *               - Hora
 *               - Estado
 *     responses:
 *       200:
 *         description: Turno actualizado exitosamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error en el servidor
 */
router.put("/turnosup/:id", turnosController.updateTurno);
/**
 * @swagger
 * /turnos/{id}:
 *   delete:
 *     summary: Eliminar un turno por ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno eliminado exitosamente
 *       500:
 *         description: Error en el servidor
 */
router.delete("/turnosdel/:id", turnosController.deleteTurno);
/**
 * @swagger
 * /mis-turnos/{usuario_id}:
 *   get:
 *     summary: Obtener turnos de un usuario específico
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de turnos del usuario
 *       500:
 *         description: Error en el servidor
 */
router.get("/mis-turnos/:usuario_id", turnosController.getTurnosByUsuario);

router.get("/disponibles/:fecha", turnosController.getDisponibles);

module.exports = router;
