const db = require("../config/db");

const Usuario = {
    create: (data, callback) => {
        const sql = "INSERT INTO usuarios (Nombre, Apellido, Email, Telefono, Password, Rol) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sql, [data.Nombre, data.Apellido, data.Email, data.Telefono, data.Password, data.Rol], callback);
        
    },

    findByEmail: (Email,callback) => {
        const sql = "SELECT * FROM usuarios WHERE Email = ? ";
        db.query(sql, [Email], callback);
    },

    findById: (id, callback) => {
        // Obtenemos Nombre y Email para el correo de notificación
        const sql = "SELECT ID_usuarios, Nombre, Email FROM usuarios WHERE ID_usuarios = ?";
        db.query(sql, [id], callback);
    }
};

module.exports = Usuario;
