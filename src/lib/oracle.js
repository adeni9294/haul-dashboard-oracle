import oracledb from 'oracledb';

// Wajib aktifkan Thin Mode untuk Vercel / Serverless
try {
  oracledb.initOracleClient({});
} catch (err) {
  // Ignore error jika sudah ter-inisialisasi
}

export async function executeQuery(query, params = [], options = {}) {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.OCI_DB_USER,
      password: process.env.OCI_DB_PASSWORD,
      connectString: process.env.OCI_DB_CONNECT_STRING,
    });

    const result = await connection.execute(query, params, {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // Hasil dalam format JSON/Object
      ...options,
    });

    return result.rows;
  } catch (error) {
    console.error('Oracle DB Error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
