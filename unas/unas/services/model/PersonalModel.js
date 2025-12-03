// const db = require("../config/db");
// const { findAll } = require("./ServiciosModel");

// const personal ={
//     create: (data, callback) => {
//         const sql = "INSERT INTO personal (Nombre, Apellido, Telefono, Email, Contra, FK_ID_servicio) VALUES (?, ?, ?, ?, ?)";
//         const values = [data.Nombre, data.Apellido, data.Telefono, data.Email, data.Contra];
//         db.query(sql, values, (err, result) => {
//             if (err) return callback(err);
//             callback(null, result);
//         });
//     },

//     findAll: (callback) => {
//         const sql = "SELECT ID_personal, Nombre, Apellido, Telefono, Email FROM personal";
//         db.query(sql, (err, results) => {
//             if (err) return callback(err);
//             callback(null, results);
//         });
//     }
// };

// module.exports = personal;

const db = require("../config/db");

const personal = {

    create: (data, callback) => {
        const sql = "INSERT INTO personal (Nombre, Apellido, Email, FK_ID_servicios) VALUES ( ?, ?, ?, ?)";
        const values = [data.Nombre, data.Apellido, data.Email, data.FK_ID_servicios];
        db.query(sql, values, (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },

    findById: (id, callback) => {
        const sql = "SELECT * FROM personal WHERE ID_personal = ?";
        db.query(sql, [id], callback);
    },

    delete: (id, callback) => {
        const sql = "DELETE FROM personal WHERE ID_personal = ?";
        db.query(sql, [id], callback);
    },
    
    findPersonalAndService: (callback) => {
        const sql = `
            SELECT 
                p.ID_personal, 
                p.Nombre, 
                p.Apellido, 
                p.Email, 
                p.FK_ID_servicios,
                s.Nombre_servicio, 
                s.Precio, 
                s.Duracion
            FROM personal p
            INNER JOIN servicios s ON p.FK_ID_servicios = s.ID_servicios
        `;
        db.query(sql, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }

};

module.exports = personal;