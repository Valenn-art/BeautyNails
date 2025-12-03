// PagosModel.js

const db = require("../config/db");

const Pago = {
    // Inserta un nuevo registro en la tabla 'pagos'
    create: (data, callback) => {
        // Columnas en tu DB: ID_pagos, FK_ID_turnos, Monto, Metodo, Fecha_pago
        const sql = "INSERT INTO pagos (FK_ID_turnos, Monto, Metodo, Fecha_pago) VALUES (?, ?, ?, ?)";
        const values = [data.FK_ID_turnos, data.Monto, data.Metodo, data.Fecha_pago];
        db.query(sql, values, callback);
    }
    // Puedes agregar funciones para buscar, actualizar o listar pagos si es necesario.
};

module.exports = Pago;