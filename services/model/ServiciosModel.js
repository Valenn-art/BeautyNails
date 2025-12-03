const db = require("../config/db");

const Servicio = {
   create: (data, callback) => {
        const sql = "INSERT INTO servicios (Nombre_servicio, Precio, Duracion) VALUES (?, ?, ?)";
        db.query(sql, [data.Nombre_servicio, data.Precio, data.Duracion], callback);
    },
    findAll: (callback) => {
        const sql = "SELECT * FROM servicios";
        db.query(sql, callback);
    }
};

module.exports = Servicio;