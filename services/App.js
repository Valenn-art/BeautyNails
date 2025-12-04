const express = require('express');
const path = require('path');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Rutas de la API
const usuarios = require('./routes/UsuariosRoutes');
const turnos = require('./routes/TurnosRoutes');
const servicios = require('./routes/ServiciosRoutes');
const personal = require('./routes/PersonalRoutes');
const pago = require('./routes/PagosRoutes');

app.use('/api', usuarios);
app.use('/', turnos);
app.use('/', servicios);
app.use('/', personal);
app.use('/', pago);

// ✅ PRODUCCIÓN: Servir archivos estáticos del build de Vite
if (process.env.NODE_ENV === 'production') {
  // Servir archivos estáticos desde la carpeta dist (build de Vite)
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Todas las rutas que no sean de API deben servir index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('📦 Sirviendo frontend desde /dist');
  }
});

module.exports = app;