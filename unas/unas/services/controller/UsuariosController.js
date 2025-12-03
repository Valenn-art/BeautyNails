const Usuario = require("../model/UsuariosModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.createUsuario = (req, res) => {
    const { Nombre, Apellido, Email, Telefono, Password } = req.body;

    if (!Nombre || !Apellido || !Email || !Telefono || !Password) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Asignar rol por defecto
    const Rol = "cliente";
    const nivel = 10;

    bcrypt.hash(Password, nivel, (err, hash) => {
        if (err) {
            console.error("Error al hashear la contraseña:", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        Usuario.create({ Nombre, Apellido, Email, Telefono, Password: hash, Rol }, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Usuario creado con éxito", ID_usuarios: result.insertId });
        });
    });
};

exports.login = (req, res) => {
    const { Email, Password } = req.body;
    
    if (!Email || !Password) {
        return res.status(400).json({ message: "Faltan credenciales" });
    }

    Usuario.findByEmail(Email, (err, results) => {
        console.log("Resultados de findByEmail:", results);
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length === 0) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const user = results[0];
        const hashedPassword = user.Password; 

        bcrypt.compare(Password, hashedPassword, (compareErr, isMatch) => {
            if (compareErr) {
                console.error("Error al comparar contraseñas:", compareErr);
                return res.status(500).json({ error: "Error en el proceso de autenticación" });
            }

            if (isMatch) {
                const payload = {
                    ID_usuarios: user.ID_usuarios,
                    Email: user.Email,
                    Rol: user.Rol
                };
                const token = jwt.sign(
                    payload,
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );
                return res.status(200).json({
                    message: "Autenticación exitosa",
                    token: token,
                    Rol: user.Rol,
                    ID_usuarios: user.ID_usuarios
                });
            } else {
                res.status(401).json({ message: "Credenciales incorrectas" });
            }
        });
    });
};