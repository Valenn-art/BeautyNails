const personal = require("../model/PersonalModel");
const Turno = require("../model/TurnosModel");
const db = require("../config/db");


exports.createPersonal = (req, res) => {
    const { Nombre, Apellido, Email, FK_ID_servicios } = req.body; 
    
    if (!Nombre || !Apellido || !Email || !FK_ID_servicios) {
        console.log(req.body);
        return res.status(400).json({ message: "Faltan datos obligatorios" });
    }
    
    personal.create({ Nombre, Apellido, Email, FK_ID_servicios }, (err, result) => {
        if (err) {
             console.error("Error al crear personal:", err);
             return res.status(500).json({ message: "Error al registrar el personal" });
        }
        res.status(201).json({ message: "Personal creado con éxito", ID_personal: result.insertId });
    });


};

exports.getPersonalConServicio = (req, res) => {
    personal.findPersonalAndService((err, results) => { 
        if (err) {
            console.error("Error al obtener personal y servicio:", err);
            return res.status(500).json({ error: err.message });
        }
        
        const formattedResults = results.map(p => ({
            ID: p.ID_personal,
            Nombre_Completo: `${p.Nombre} ${p.Apellido}`,
            Detalle: `Servicio: ${p.Nombre_servicio} `,
            Precio: p.Precio,
            Duracion: p.Duracion
        }));
        
        res.json(formattedResults);
    });
};

// exports.deletePersonal = (req, res) => {
//     const { id } = req.params;
//     personal.delete(id, (err, result) => {
//         if (err) {
//             console.error("Error al eliminar personal:", err);
//             return res.status(500).json({ error: "Error al eliminar el personal" });
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: "Personal no encontrado" });
//         }
//         res.json({ message: "Personal eliminado con éxito" });
//     });
// };
exports.deletePersonal = (req, res) => {
    const { id } = req.params; 

    if (!id) {
        return res.status(400).json({ message: "Falta el ID del personal a eliminar." });
    }
    
    // Llamamos directamente a la eliminación del personal.
    // MySQL se encarga de eliminar los turnos por el 'ON DELETE CASCADE'.
    personal.delete(id, (err, result) => {
        if (err) {
            console.error("Error al eliminar personal:", err);
            return res.status(500).json({ error: "Error al intentar eliminar el personal" });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Personal no encontrado." });
        }
        
        // El servidor no necesita saber cuántos turnos eliminó MySQL.
        res.json({ message: "Personal eliminado con éxito. Los turnos asociados fueron eliminados automáticamente." });
    });
};