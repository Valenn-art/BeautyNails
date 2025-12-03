const mysql = require('mysql2')
require('dotenv').config();
const credenciales ={
    host:process.env.HOST,
    user: process.env.USER,
    password: process.env.PW,
    database: process.env.DB
}

const db = mysql.createPool(credenciales);

module.exports = db;
