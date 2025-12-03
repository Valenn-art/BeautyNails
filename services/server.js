require('dotenv').config();
const app = require('./App');

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
