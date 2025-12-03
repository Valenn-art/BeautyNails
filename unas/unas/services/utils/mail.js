const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false, 
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});


const sendTurnoCancellation = async (clientEmail, clientName, turnoDetails, canceledByRole) => {
    
    const { Fecha, Hora, Estado } = turnoDetails;
    
    const remitente = (canceledByRole.toLowerCase() === 'administrador') ? 'el Administrador' : 'el Cliente';
    
    // El mensaje más importante para el cliente
    const reembolsoMensaje = (Estado === 'Pagado') 
        ? "Se ha iniciado el proceso de devolución de su pago. Esto puede tardar 3-5 días hábiles."
        : "No se encontró un pago asociado, por lo que no hay reembolso pendiente.";

    const mailOptions = {
        from: "Notificaciones [Consulta Unas] <" + process.env.MAIL_USER + ">",
        to: clientEmail,
        subject: `⚠️ Turno Eliminado Definitivamente: ${Fecha} a las ${Hora}`,
        html: `
            <p>Hola <b>${clientName}</b>,</p>
            <p>Su turno para el <b>${Fecha}</b> a las <b>${Hora}</b> ha sido **eliminado permanentemente** por ${remitente}.</p>
            
            <h3>Información de Pago y Reembolso</h3>
            <p><b>Estado Original del Turno:</b> ${Estado}</p>
            <p>${reembolsoMensaje}</p>
            
            <p>Si fue un error o tiene preguntas, contacte a soporte.</p>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email de Cancelación enviado: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error al enviar email de cancelación a %s:', clientEmail, error.message);
        return false;
    }
};

module.exports = { 
    sendTurnoCancellation 
};