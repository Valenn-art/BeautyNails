const express = require('express');
const path = require('path');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Rutas API
const usuarios = require('./routes/UsuariosRoutes');
const turnos = require('./routes/TurnosRoutes');
const servicios = require('./routes/ServiciosRoutes');
const personal = require('./routes/PersonalRoutes');
const pago = require('./routes/PagosRoutes');

app.use('/usuarios', usuarios);
app.use('/turnos', turnos);
app.use('/', servicios);
app.use('/personal', personal);
app.use('/pago', pago);

app.use(express.static(path.join(__dirname, '../dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});


module.exports = app;