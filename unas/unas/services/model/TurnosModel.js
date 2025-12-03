const db = require("../config/db");

const Turno = {
    create: (data, callback) => {
        const sql = "INSERT INTO turnos (FK_ID_usuarios, FK_ID_servicios, FK_ID_personal, Fecha, Hora, Estado) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sql, [data.FK_ID_usuarios, data.FK_ID_servicios, data.FK_ID_personal, data.Fecha, data.Hora, data.Estado], callback);
    },

    findAll: (callback) => {
        const sql = "SELECT * FROM turnos";
        db.query(sql, callback);
    },

    update: (id, data, callback) => {
        const sql = "UPDATE turnos SET Fecha = ?, Hora = ?, Estado = ? WHERE ID_turnos = ?";
        db.query(sql, [data.Fecha, data.Hora, data.Estado, id], callback);
    },

    delete: (id, callback) => {
        const sql = "DELETE FROM turnos WHERE ID_turnos = ?";
        db.query(sql, [id], callback);
    },

    findByUsuario: (usuarioId, callback) => {
        const sql = "SELECT * FROM turnos WHERE FK_ID_usuarios = ?";
        db.query(sql, [usuarioId], callback);
    },

    getTurnoDetails: (id, callback) => {
        // Obtenemos los datos esenciales para la autorización y notificación
        const sql = "SELECT FK_ID_usuarios, Fecha, Hora, Estado FROM turnos WHERE ID_turnos = ?";
        db.query(sql, [id], callback);
    },

    // Agregalo dentro del objeto Turno en TurnosModel.js
getOccupiedHours: (fecha, personalId, callback) => {
    // Buscamos solo la Hora de los turnos que coincidan con la fecha y el personal
    const sql = "SELECT Hora FROM turnos WHERE Fecha = ? AND FK_ID_personal = ?";
    db.query(sql, [fecha, personalId], callback);
},

    getTurnoDetails: (id, callback) => {
        // FK_ID_usuarios para verificar la propiedad del turno (cliente)
        // Fecha, Hora, Estado para el contenido del email (reembolso)
        const sql = "SELECT FK_ID_usuarios, Fecha, Hora, Estado FROM turnos WHERE ID_turnos = ?";
        db.query(sql, [id], callback);
    }
};

module.exports = Turno;
