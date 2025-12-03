const Turno = require("../model/TurnosModel");
const { sendTurnoCancellation } = require('../utils/mail');
const Usuario = require("../model/UsuariosModel");
const db = require("../config/db");

exports.createTurno = (req, res) => {
   const { FK_ID_usuarios, FK_ID_servicios, FK_ID_personal, Fecha, Hora } = req.body;
    
    const Estado = "Pendiente";
    
    if (!FK_ID_usuarios || !FK_ID_servicios || !FK_ID_personal || !Fecha || !Hora) {
        return res.status(400).json({ message: "Faltan datos obligatorios para el turno" });
    }

    Turno.create({ FK_ID_usuarios, FK_ID_servicios, FK_ID_personal, Fecha, Hora, Estado }, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            message: "Turno creado con éxito y estado Pendiente", 
            ID_turnos: result.insertId 
        });
    });
};

exports.getTurnos = (req, res) => {
    Turno.findAll((err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

exports.updateTurno = (req, res) => {
    const { id } = req.params;
    const { Fecha, Hora, Estado } = req.body;

    if (!Fecha || !Hora || !Estado) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    Turno.update(id, { Fecha, Hora, Estado }, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Turno actualizado con éxito" });
    });
};

exports.deleteTurno = (req, res) => {
    const { id } = req.params;

    Turno.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Turno eliminado con éxito" });
    });
};

exports.getTurnosByUsuario = (req, res) => {
    const { usuario_id } = req.params;

    if (!usuario_id) {
        return res.status(400).json({ message: "Falta el ID del usuario" });
    }

    // Query con JOIN para traer todos los datos necesarios
    const sql = `
        SELECT 
            t.ID_turnos,
            t.Fecha,
            t.Hora,
            t.Estado,
            s.Nombre_servicio,
            s.Precio,
            s.Duracion,
            p.Nombre AS Nombre_personal,
            p.Apellido AS Apellido_personal
        FROM turnos t
        INNER JOIN servicios s ON t.FK_ID_servicios = s.ID_servicios
        INNER JOIN personal p ON t.FK_ID_personal = p.ID_personal
        WHERE t.FK_ID_usuarios = ?
        ORDER BY t.Fecha DESC, t.Hora DESC
    `;

    db.query(sql, [usuario_id], (err, results) => {
        if (err) {
            console.error("Error al obtener turnos:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};
exports.deleteTurnoAndNotify = (req, res) => {
    const { id } = req.params;
    const authenticatedUser = req.user; 
    
    if (!authenticatedUser) {
        return res.status(401).json({ message: "Se requiere autenticación." });
    }
    if (!id) {
        return res.status(400).json({ message: "Falta el ID del turno a eliminar." });
    }

    Turno.getTurnoDetails(id, (err, results) => {
        if (err) return res.status(500).json({ error: "Error al obtener detalles del turno." });
        if (results.length === 0) {
            return res.status(404).json({ message: "Turno no encontrado." });
        }

        const turno = results[0];
        
        // Verifica si es el dueño o si es administrador
        const isClientOwner = authenticatedUser.Rol.toLowerCase() === 'cliente' && 
                              authenticatedUser.ID_usuarios === turno.FK_ID_usuarios;
        const isAdmin = authenticatedUser.Rol.toLowerCase() === 'administrador' || authenticatedUser.Rol.toLowerCase() === 'admin';

        if (!isClientOwner && !isAdmin) {
            return res.status(403).json({ message: "No tienes permiso para eliminar este turno." });
        }
        
        Turno.delete(id, (errDelete, resultDelete) => {
            if (errDelete) {
                // Si este error ocurre, es porque falta el ON DELETE CASCADE en la BD (pagos->turnos)
                console.error("Error al eliminar el turno:", errDelete);
                return res.status(500).json({ error: "Error al eliminar el turno. Verifique la restricción FOREIGN KEY." });
            }
            
            if (resultDelete.affectedRows === 0) {
                 return res.status(404).json({ message: "Turno no encontrado." });
            }

            Usuario.findById(turno.FK_ID_usuarios, async (errUser, userResults) => {
                
                if (errUser || userResults.length === 0) {
                    console.error("Turno eliminado, pero falló al obtener datos del usuario para email:", errUser);
                    return res.json({ message: "Turno eliminado con éxito. (No se pudo enviar la notificación por email)" });
                }
                
                const user = userResults[0];
                const remitente = isAdmin ? 'administrador' : 'cliente';
                
                await sendTurnoCancellation(user.Email, user.Nombre, turno, remitente);
            
                const nota = (turno.Estado === 'Pagado') ? "Reembolso iniciado." : "Sin reembolso pendiente.";
                
                res.json({ 
                    message: "Turno eliminado con éxito. El cliente ha sido notificado.",
                    ID_turnos: id,
                    CanceladoPor: remitente,
                    Nota: nota
                });
            });
        });
    });
};
exports.getDisponibles = (req, res) => {
    const { fecha } = req.params;
    const { personal } = req.query;

    if (!fecha || !personal) {
        return res.status(400).json({ message: "Falta fecha o ID de personal" });
    }

    const horariosPosibles = [
        "09:00", "10:00", "11:00", "12:00", 
        "14:00", "15:00", "16:00", "17:00", "18:00"
    ];

    Turno.getOccupiedHours(fecha, personal, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const horariosOcupados = results.map(row => {
            return row.Hora.substring(0, 5); 
        });

        const disponibles = horariosPosibles.filter(h => !horariosOcupados.includes(h));

        res.json(disponibles);
    });
};