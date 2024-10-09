//import sql from 'mssql';
const sql = require('mssql');

const config = {
    user: 'sa',
    password: '123',
    server: 'localhost',
    database: 'QLTD',
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true, // change to true for local dev / self-signed certs
        characterSet: 'utf8',
    }
};

// export async function connectDB() {
//     try {
//         const pool = await sql.connect(config);
//         return pool;
//     } catch (err) {
//         console.log(err);
//     }
// }

const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('Connect to db');
        });

        connection.on('error', (error) => {
            console.log('Something is wrong in mongodb ', error);
        });
    } catch (error) {
        console.log('Something is wrong. ', error);
    }
}
module.exports = connectDB;

// module.exports = {
//     connectDB,
//     sql // Export sql for reuse
// }