const express=require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');

const app= express();
app.use(cors());
app.use(express.json());

const usuarios = require('./routes/UsuariosRoutes');
const turnos = require('./routes/TurnosRoutes');
const servicios = require('./routes/ServiciosRoutes');
const personal = require('./routes/PersonalRoutes');
const pago = require('./routes/PagosRoutes');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec)); 

app.use('/api/usuarios', usuarios);
app.use('/api/turnos', turnos);
app.use('/api/servicios', servicios);
app.use('/api/pagos', pago);
app.use('/api/personal', personal);


module.exports = app;