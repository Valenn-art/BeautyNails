const express = require('express');
const cors = require('cors');
const path = require('path');           // ← AÑADIR ESTO
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.dirname(new URL(import.meta.url).pathname); // solo si usas ESM, sino usa path.resolve()
app.use(express.static(path.join(__dirname, 'dist'))); // ← carpeta que genera Vite

const usuarios = require('./routes/UsuariosRoutes');
const turnos = require('./routes/TurnosRoutes');
const servicios = require('./routes/ServiciosRoutes');
const personal = require('./routes/PersonalRoutes');
const pago = require('./routes/PagosRoutes');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use('/api', usuarios);
app.use('/', pago);
app.use('/', personal);
app.use('/', turnos);
app.use('/', servicios);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get("/backend-test", (req, res) => {
  res.send("Backend funcionando en Render");
});

module.exports = app;