const Pago = require("../model/PagosModel");
const Turno = require("../model/TurnosModel"); 

exports.registrarPago = (req, res) => {
    const { FK_ID_turnos, Monto, Metodo, Fecha_pago } = req.body; 

    if (!FK_ID_turnos || !Monto || !Metodo || !Fecha_pago) {
        return res.status(400).json({ message: "Faltan datos obligatorios para el pago" });
    }

    Pago.create({ FK_ID_turnos, Monto, Metodo, Fecha_pago }, (err, result) => {
        if (err) {
            console.error("Error al registrar el pago:", err);
            return res.status(500).json({ message: "Error al registrar el pago", error: err.message });
        }

        const PagoId = result.insertId;

        const idTurno = FK_ID_turnos;
        const nuevoEstado = { Estado: "Pagado" }; 

        Turno.update(idTurno, nuevoEstado, (updateErr, updateResult) => {
            if (updateErr) {
                console.error("Error al actualizar el estado del turno:", updateErr);
                return res.status(500).json({ 
                    message: "Pago registrado, pero el estado del turno no pudo ser actualizado. Revisar DB.", 
                    ID_pago: PagoId
                });
            }
            res.status(201).json({ 
                message: "Pago registrado con éxito y Turno actualizado a 'Pagado'", 
                ID_pago: PagoId,
                ID_turno: idTurno
            });
        });
    });
};