require('dotenv').config();
const app = require('./App');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});