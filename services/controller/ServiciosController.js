const Servicio = require('../model/ServiciosModel');

// Crear un nuevo servicio
exports.createServicio = (req, res) => {
    const { Nombre_servicio , Precio , Duracion} = req.body;
    if (!Nombre_servicio || !Precio || !Duracion ) {
        console.log(req.body);
        return res.status(400).json({ message: "Faltan datos obligatorios" });

    }  
    Servicio.create({ Nombre_servicio, Precio, Duracion}, (err, result) => {
        if (err) return res.status(500).json({ message: "error" });
        res.status(201).json({ message: "Servicio creado con éxito", ID_servicios: result.insertId });
    });
};

exports.getServicios = (req, res) => {
    Servicio.findAll((err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};