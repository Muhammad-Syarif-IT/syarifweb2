const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Tambahkan baris ini agar file index.html & aset terbaca 

// Konfigurasi koneksi ke Oracle Database Anda
const dbConfig = {
    user: "SYSTEM",          // Ganti dengan username Oracle Anda
    password: "MuhammadOracIT22",  // Ganti dengan password Oracle Anda
    connectString: "localhost:1521/XE" // Sesuaikan dengan koneksi Oracle Anda
};

// Endpoint untuk mengambil data produk dari database Oracle
app.get('/api/products', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT * FROM PRODUCT`, 
            [], 
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gagal mengambil data dari database" });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});