require('dotenv').config();
const app = require('./App');
const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Comenzo el servidor con el ${port}`);
});