// app/api/dashboard/route.js
import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/oracle'; // Pastikan file lib/oracle.js sudah dibuat

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const periodeId = searchParams.get('periode_id');

  try {
    // 1. Ambil List Periode
    const periodeList = await executeQuery(
      `SELECT id, nama_periode, saldo_awal, is_closed, created_at 
       FROM periode_haul 
       ORDER BY created_at DESC`
    );

    // 2. Ambil Settings
    const settings = await executeQuery(
      `SELECT announcement, banner_text FROM settings WHERE id = 'main_config'`
    );

    // 3. Ambil Visitor Stats
    const viewsResult = await executeQuery(`SELECT COUNT(*) AS total FROM visitor_logs`);
    const uniqueResult = await executeQuery(`SELECT COUNT(DISTINCT ip_address) AS unique_count FROM visitor_logs`);
    
    // 4. Ambil Total Plafon Budgets
    const budgetsResult = await executeQuery(`SELECT NVL(SUM(planned_amount), 0) AS total_planned FROM budgets`);

    // 5. Ambil Donations & Transactions (dengan filter periode_id jika ada)
    let donQuery = `SELECT * FROM donation_details`;
    let txQuery = `SELECT * FROM transactions`;
    const donParams = [];
    const txParams = [];

    if (periodeId) {
      donQuery += ` WHERE periode_id = :1`;
      txQuery += ` WHERE periode_id = :1`;
      donParams.push(periodeId);
      txParams.push(periodeId);
    }

    const donationsDb = await executeQuery(donQuery, donParams);
    const transactionsDb = await executeQuery(txQuery, txParams);

    return NextResponse.json({
      periodeList,
      settingsData: settings[0] || null,
      visitorStats: {
        totalViews: viewsResult[0]?.TOTAL || 0,
        uniqueCount: uniqueResult[0]?.UNIQUE_COUNT || 0,
      },
      totalPlafonDinamis: budgetsResult[0]?.TOTAL_PLANNED || 0,
      donationsDb,
      transactionsDb,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { path, ip_address, user_agent } = body;

    await executeQuery(
      `INSERT INTO visitor_logs (path, ip_address, user_agent) VALUES (:1, :2, :3)`,
      [path || '/', ip_address || '127.0.0.1', user_agent || 'unknown'],
      { autoCommit: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Visitor Log Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
