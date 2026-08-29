const oracledb = require('oracledb');

async function run() {
  try {
    let conn = await oracledb.getConnection({
      user: "ADMIN",
      password: "@Aisyah180221",
      connectString: "dbhaul_high",
      configDir: "./wallet",        // <-- TAMBAHIN INI
      walletLocation: "./wallet",   // <-- INI JUGA
      walletPassword: "@Aisyah211117"
    });
    console.log("SUKSES KONEK KE ORACLE!");
    await conn.close();
  } catch(err) { 
    console.log("ERROR:", err); 
  }
}
run();
