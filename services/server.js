require('dotenv').config();
const app = require('./App');

const PORT = process.env.PORT;

app.listen(PORT, '0.0.0.0',() => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});