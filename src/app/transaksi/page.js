'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import GlassCard from '../components/GlassCard';
import { 
  Plus, 
  FileSpreadsheet, 
  Printer, 
  Lock, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Loader2,
  DollarSign,
  ShieldAlert
} from 'lucide-react';

// KAMUS MULTI-BAHASA
const translations = {
  id: {
    title: "Buku Kas & Transaksi Haul",
    subtitle: "● Murni Grouping pertanggal & Integrasi Kas Keluar Aktif",
    btnTambah: "Tambah Kas",
    btnExcel: "Excel Data",
    btnCetak: "Cetak LPJ",
    btnTutupBuku: "Tutup Buku Periode",
    searchPlaceholder: "Cari uraian keterangan...",
    allCash: "Semua Aliran Kas",
    onlyIn: "Hanya Kas Masuk",
    onlyOut: "Hanya Kas Keluar",
    allCat: "Semua Kategori Pos",
    thDate: "Tanggal",
    thCat: "Pos Kategori",
    thDesc: "Uraian Keterangan",
    thAmount: "Nominal Angka",
    thAction: "Aksi",
    noData: "Tidak ada catatan transaksi ditemukan.",
    syncData: "Sinkronisasi integrasi pembukuan kas...",
    lpjTitle: "LAPORAN PERTANGGUNGJAWABAN (LPJ) KEUANGAN HAUL",
    lpjPeriod: "Periode: Real-Time s/d",
    tblHeaderDesc: "Deskripsi / Ikhtisar Akun",
    tblHeaderAmount: "Jumlah Kas (IDR)",
    totalIn: "Total Penerimaan Arus Kas Masuk (A)",
    totalOut: "Total Pengeluaran Belanja Operasional (B)",
    netBalance: "Sisa Saldo Buku Kas Bersih (A - B)",
    sectIn: "A. Buku Rincian Aliran Arus Kas Masuk",
    sectOut: "B. Buku Rincian Aliran Arus Kas Keluar (Belanja)",
    thLpjDesc: "Uraian Keterangan Transaksi",
    signKnow: "Mengetahui,",
    signChair: "Ketua",
    signMade: "Dibuat Oleh,",
    signTreasurer: "Bendahara",
    signGroup: "PANITIA HAUL 2026",
    city: "Cirebon",
    summarySect: "IKHTISAR REKAP TOTAL PER KATEGORI POS KAS",
    summaryCat: "Kategori Pos Anggaran",
    summaryTotal: "Total Realisasi Dana",
    selectPeriod: "PERIODE HAUL:",
    statusClosed: "(Tutup Buku)",
    statusActive: "(Aktif)",
    errorAuth: "Gagal verifikasi sesi admin.",
    errorLoad: "Gagal memuat data transaksi.",
    errorSave: "Gagal menyimpan transaksi.",
    errorDelete: "Gagal menghapus data.",
    errorCloseBook: "Gagal memproses tutup buku.",
    warnClosed: "Periode ini telah ditutup buku. Data tidak dapat diubah.",
    warnInput: "Harap isi semua data dengan benar.",
    successSave: "Transaksi berhasil disimpan.",
    successDelete: "Data berhasil dihapus.",
    successCloseBook: "Tutup Buku Berhasil! Periode baru telah dibuat."
  },
  jv: { 
    title: "Buku Kas & Transaksi Haul",
    subtitle: "● Murni Grouping pertanggal & Integrasi Kas Keluar Aktif",
    btnTambah: "Tambah Kas",
    btnExcel: "Pragat Excel",
    btnCetak: "Cetak LPJ",
    btnTutupBuku: "Tutup Buku Periode",
    searchPlaceholder: "Goleki keterangan...",
    allCash: "Kabeh Aliran Kas",
    onlyIn: "Pragat Mlebu Tok",
    onlyOut: "Pragat Blonjo Tok",
    allCat: "Kabeh Werna Pos",
    thDate: "Tanggal",
    thCat: "Pos Kategori",
    thDesc: "Keterangan",
    thAmount: "Nominal Angka",
    thAction: "Aksi",
    noData: "Durung ana catatan transaksi.",
    syncData: "Nembe ngebuka integrasi pembukuan kas...",
    lpjTitle: "LAPORAN PERTANGGUNGJAWABAN (LPJ) KEUANGAN HAUL",
    lpjPeriod: "Periode: Real-Time s/d",
    tblHeaderDesc: "Keterangan / Ikhtisar Akun",
    tblHeaderAmount: "Jumlah Kas (IDR)",
    totalIn: "Total Pragat Kas Mlebu (A)",
    totalOut: "Total Pragat Blonjo Operasional (B)",
    netBalance: "Sisa Saldo Buku Kas Bersih (A - B)",
    sectIn: "A. Buku Rincian Aliran Arus Kas Mlebu",
    sectOut: "B. Buku Rincian Aliran Arus Kas Metu (Blonjo)",
    thLpjDesc: "Keterangan Transaksi",
    signKnow: "Weruh,",
    signChair: "Ketua",
    signMade: "Sing Gawe,",
    signTreasurer: "Bendahara",
    signGroup: "PANITIA HAUL 2026",
    city: "Cirebon",
    summarySect: "IKHTISAR REKAP TOTAL PER KATEGORI POS KAS",
    summaryCat: "Kategori Pos Anggaran",
    summaryTotal: "Total Realisasi Dana",
    selectPeriod: "PILIH PERIODE HAUL:",
    statusClosed: "(Rampung)",
    statusActive: "(Mlaku)",
    errorAuth: "Gagal verifikasi sesi admin.",
    errorLoad: "Gagal moco data transaksi.",
    errorSave: "Gagal nyimpen transaksi.",
    errorDelete: "Gagal mbusak data.",
    errorCloseBook: "Gagal proses tutup buku.",
    warnClosed: "Periode iki wis ditutup buku. Data ora iso diubah.",
    warnInput: "Isi kabeh data sing bener.",
    successSave: "Transaksi kasil disimpen.",
    successDelete: "Data kasil dibusak.",
    successCloseBook: "Tutup Buku Kasil! Periode anyar wis digawe."
  },
  en: {
    title: "Cash Book & Haul Transactions",
    subtitle: "● Pure daily grouping & Active cash outflow integration",
    btnTambah: "Add Cash",
    btnExcel: "Export Excel",
    btnCetak: "Print Report",
    btnTutupBuku: "Close Accounting Period",
    searchPlaceholder: "Search description...",
    allCash: "All Cash Flows",
    onlyIn: "Cash Inflow Only",
    onlyOut: "Cash Outflow Only",
    allCat: "All Categories",
    thDate: "Date",
    thCat: "Category Pos",
    thDesc: "Description Note",
    thAmount: "Amount",
    thAction: "Action",
    noData: "No transaction records found.",
    syncData: "Synchronizing cash book integration...",
    lpjTitle: "FINANCIAL ACCOUNTABILITY REPORT (LPJ) OF HAUL",
    lpjPeriod: "Period: Real-Time as of",
    tblHeaderDesc: "Description / Account Overview",
    tblHeaderAmount: "Cash Amount (IDR)",
    totalIn: "Total Cash Inflows (A)",
    totalOut: "Total Operational Expenditures (B)",
    netBalance: "Net Cash Balance (A - B)",
    sectIn: "A. Detailed Cash Inflow Ledger",
    sectOut: "B. Detailed Cash Outflow Ledger (Expenditure)",
    thLpjDesc: "Transaction Description Details",
    signKnow: "Approved By,",
    signChair: "Haul Committee Chairman",
    signMade: "Prepared By,",
    signTreasurer: "Committee Treasurer",
    signGroup: "2026 HAUL COMMITTEE",
    city: "Cirebon",
    summarySect: "SUMMARY OF TOTALS BY CASH POSITION CATEGORY",
    summaryCat: "Budget Position Category",
    summaryTotal: "Total Realized Funds",
    selectPeriod: "HAUL PERIOD:",
    statusClosed: "(Closed)",
    statusActive: "(Active)",
    errorAuth: "Admin session verification failed.",
    errorLoad: "Failed to load transaction data.",
    errorSave: "Failed to save transaction.",
    errorDelete: "Failed to delete data.",
    errorCloseBook: "Failed to process closing book.",
    warnClosed: "This period is closed. Data cannot be modified.",
    warnInput: "Please fill all fields correctly.",
    successSave: "Transaction saved successfully.",
    successDelete: "Data deleted successfully.",
    successCloseBook: "Book closed successfully! New period created."
  }
};

export default function TransaksiPage() {
  const [lang, setLang] = useState('id');
  const t = translations[lang] || translations['id'];

  const [loading, setLoading] = useState(true);
  const [allDonations, setAllDonations] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // STATE NOTIFIKASI TOAST
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // STATE MODAL KONFIRMASI HAPUS
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, isExpenses: false });
  
  // State Periode Haul
  const [periodeList, setPeriodeList] = useState([]);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState(null);
  const [currentPeriodeObj, setCurrentPeriodeObj] = useState(null);
  
  // Modal Tutup Buku
  const [showModalTutupBuku, setShowModalTutupBuku] = useState(false);
  const [namaPeriodeBaruInput, setNamaPeriodeBaruInput] = useState('');

  const [isAdmin, setIsAdmin] = useState(false);
  const [metaOrg, setMetaOrg] = useState({ 
    name: 'PANITIA HAUL', 
    address: '',
    ketua: '....................',
    bendahara: '....................',
    logoUrl: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formType, setFormType] = useState('Pemasukan');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAmount, setFormAmount] = useState('');

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');

  const abortControllerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  }, []);

  // Validasi Sesi Admin via REST API (Oracle Backend)
  const checkAdminSessionOnly = useCallback(async () => {
    const savedPassword = localStorage.getItem('admin_password_haul');
    if (!savedPassword) {
      setIsAdmin(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: savedPassword })
      });
      const data = await res.json();
      setIsAdmin(!!data.valid);
    } catch (err) {
      setIsAdmin(false);
    }
  }, []);

  // Load Data Utama via REST API (Oracle Backend)
  const loadData = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Periode List & Settings
      const [resPeriode, resSettings, resCommittee] = await Promise.all([
        fetch('/api/periode', { signal: abortControllerRef.current.signal }),
        fetch('/api/settings', { signal: abortControllerRef.current.signal }),
        fetch('/api/committee', { signal: abortControllerRef.current.signal })
      ]);

      // Handle Periode
      let activePeriodeId = selectedPeriodeId;
      if (resPeriode.ok) {
        const listPeriode = await resPeriode.json();
        if (Array.isArray(listPeriode) && listPeriode.length > 0) {
          setPeriodeList(listPeriode);
          if (!activePeriodeId) {
            // Default ke periode aktif terbaru (is_closed = 0 atau created_at terbaru)
            const latest = listPeriode.find(p => !(p.is_closed || p.IS_CLOSED)) || listPeriode[0];
            activePeriodeId = latest.id || latest.ID;
            setSelectedPeriodeId(activePeriodeId);
          }
          const found = listPeriode.find(p => (p.id || p.ID) === activePeriodeId) || listPeriode[0];
          setCurrentPeriodeObj(found);
        }
      }

      // Handle Settings & Komite (untuk Kop LPJ)
      let currentName = 'PANITIA HAUL MAQBAROH BUYUT KEPUH & BUYUT BESUS';
      let currentAddress = 'Blok Cibogo Kidul RT/RW. 002/003 Desa Warujaya Kec. Depok Kab. Cirebon';
      let currentLogo = '';
      let currentKetua = '....................';
      let currentBendahara = '....................';

      if (resSettings.ok) {
        const setDb = await resSettings.json();
        currentName = setDb.org_name || setDb.ORG_NAME || currentName;
        currentAddress = setDb.address || setDb.ADDRESS || currentAddress;
        currentLogo = setDb.logo_url || setDb.LOGO_URL || '';
      }

      if (resCommittee.ok) {
        const committeeDb = await resCommittee.json();
        if (Array.isArray(committeeDb)) {
          const ketuaObj = committeeDb.find(c => (c.position || c.POSITION || '').toLowerCase() === 'ketua');
          const bendaharaObj = committeeDb.find(c => (c.position || c.POSITION || '').toLowerCase() === 'bendahara');
          currentKetua = ketuaObj?.name || ketuaObj?.NAME || currentKetua;
          currentBendahara = bendaharaObj?.name || bendaharaObj?.NAME || currentBendahara;
        }
      }

      setMetaOrg({
        name: currentName,
        address: currentAddress,
        ketua: currentKetua,
        bendahara: currentBendahara,
        logoUrl: currentLogo
      });

      // 2. Fetch Kategori
      const resCat = await fetch('/api/category', { signal: abortControllerRef.current.signal });
      if (resCat.ok) {
        const catDb = await resCat.json();
        if (Array.isArray(catDb) && catDb.length > 0) {
          setCategories(catDb);
          if (!formCategory) setFormCategory(catDb[0].name || catDb[0].NAME);
        }
      }

      // 3. Fetch Transaksi (Donasi & Pengeluaran) berdasarkan Periode
      if (activePeriodeId) {
        const [resDonations, resTransactions] = await Promise.all([
          fetch(`/api/donasi?periode_id=${activePeriodeId}`, { signal: abortControllerRef.current.signal }),
          fetch(`/api/transaksi?periode_id=${activePeriodeId}`, { signal: abortControllerRef.current.signal })
        ]);

        if (resDonations.ok) setAllDonations(await resDonations.json());
        if (resTransactions.ok) setAllExpenses(await resTransactions.json());
      } else {
        setAllDonations([]);
        setAllExpenses([]);
      }

    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error("Gagal load data transaksi:", e);
        setError(t.errorLoad);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedPeriodeId, formCategory, t.errorLoad]);

  useEffect(() => {
    checkAdminSessionOnly();
    loadData();

    // Polling sesi admin setiap menit (opsional, sesuaikan kebutuhan)
    const interval = setInterval(checkAdminSessionOnly, 60000);
    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [checkAdminSessionOnly, loadData]);

  // FUNGSI HANDLER CETAK LPJ (SUPPORT ANDROID NATIVE APK & WEB BROWSER)
  const handleCetakLPJ = () => {
    if (typeof window !== 'undefined' && window.cordova && window.cordova.plugins && window.cordova.plugins.printer) {
      window.cordova.plugins.printer.print();
    } else {
      window.print();
    }
  };

  // Simpan/Edit Transaksi via REST API (POST/PUT ke Oracle)
  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    // Proteksi Tutup Buku
    if (currentPeriodeObj?.is_closed || currentPeriodeObj?.IS_CLOSED) {
      showToast(t.warnClosed, 'warning');
      return;
    }
    
    const cleanAmount = parseFloat(formAmount.toString().replace(/[^0-9.-]/g, '')) || 0;
    const finalCategory = formCategory || (categories.length > 0 ? (categories[0].name || categories[0].NAME) : 'Lain-lain');
    
    if (cleanAmount <= 0 || !formDescription.trim() || !selectedPeriodeId) {
      showToast(t.warnInput, 'warning');
      return;
    }
    
    const payload = {
      transaction_date: formDate,
      type: formType === 'Pengeluaran' ? 'keluar' : 'masuk',
      category: finalCategory,
      note: formDescription.trim(),
      amount: cleanAmount,
      periode_id: selectedPeriodeId
    };

    try {
      setLoading(true);
      const url = '/api/transaksi';
      const method = isEditMode ? 'PUT' : 'POST';
      
      if (isEditMode) payload.id = selectedId; // Tambahkan ID untuk update

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('API Error');

      showToast(t.successSave, 'success');
      resetForm();
      await loadData();
    } catch (err) {
      console.error(err);
      showToast(t.errorSave, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Proses Tutup Buku via REST API (Panggil Stored Procedure Oracle via API)
  const handleProsesTutupBuku = async (e) => {
    e.preventDefault();
    if (!isAdmin || !selectedPeriodeId) return;
    if (!namaPeriodeBaruInput.trim()) {
      showToast(t.warnInput, 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/periode/tutup-buku', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periode_id_lama: selectedPeriodeId,
          nama_periode_baru: namaPeriodeBaruInput.trim()
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Server Error');

      showToast(t.successCloseBook, 'success');
      setShowModalTutupBuku(false);
      setNamaPeriodeBaruInput('');
      
      // Reload halaman untuk refresh state periode penuh
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error(err);
      showToast(`${t.errorCloseBook}: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const triggerEdit = (item) => {
    if (currentPeriodeObj?.is_closed || currentPeriodeObj?.IS_CLOSED) {
      showToast(t.warnClosed, 'warning');
      return;
    }
    setSelectedId(item.id);
    setIsEditMode(true);
    setFormDate(item.transaction_date);
    setFormType(item.aliranJenis === 'Keluar' ? 'Pengeluaran' : 'Pemasukan');
    setFormCategory(item.category);
    setFormDescription(item.uraian);
    setFormAmount(item.amount);
    setShowModal(true);
  };

  const triggerHapus = (id, isFromExpenses) => {
    if (!isAdmin) return;
    if (currentPeriodeObj?.is_closed || currentPeriodeObj?.IS_CLOSED) {
      showToast(t.warnClosed, 'warning');
      return;
    }
    setDeleteConfirm({ show: true, id, isExpenses: isFromExpenses });
  };

  // Eksekusi Hapus via REST API (DELETE ke Oracle)
  const executeDelete = async () => {
    const { id, isExpenses } = deleteConfirm;
    setDeleteConfirm({ show: false, id: null, isExpenses: false });
    try {
      setLoading(true);
      // Tentukan target tipe (donasi/transaksi) via query param atau endpoint berbeda
      const targetType = isExpenses ? 'transaksi' : 'donasi';
      const res = await fetch(`/api/transaksi?id=${id}&type=${targetType}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Delete failed');

      showToast(t.successDelete, 'success');
      await loadData();
    } catch (err) {
      console.error(err);
      showToast(t.errorDelete, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditMode(false);
    setSelectedId(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormType('Pemasukan');
    setFormDescription('');
    setFormAmount('');
    if (categories.length > 0) setFormCategory(categories[0].name || categories[0].NAME);
    setShowModal(false);
  };

  // Logika Grouping Murni (Sama seperti sebelumnya, disesuaikan support kapital Oracle)
  const prosesDataGabunganMurni = useCallback(() => {
    const petaGabungan = {};

    if (Array.isArray(allDonations)) {
      allDonations.forEach((item) => {
        const tgl = item.transaction_date || item.TRANSACTION_DATE;
        const kat = item.category || item.CATEGORY;
        const amount = parseFloat(item.amount || item.AMOUNT || 0);
        const donorName = (item.donor_name || item.DONOR_NAME || '').toString().trim();
        const itemId = item.id || item.ID;

        if (!tgl) return;

        const isAdminFee = donorName === '__ADMIN_FEE__';
        const isSaldoMengendap = donorName === '__SALDO_MENGENDAP__';

        if (isAdminFee || isSaldoMengendap) {
          const keySistem = `${tgl}_${kat}_${donorName}_${itemId}`;
          petaGabungan[keySistem] = {
            id: itemId,
            transaction_date: tgl,
            category: kat,
            amount: Math.abs(amount),
            aliranJenis: isAdminFee ? 'Keluar' : 'Masuk', 
            isSystem: true,
            isFromExpenses: false,
            uraian: isAdminFee 
              ? `${dict.systemFee} ${tgl.substring(0, 7)}` 
              : `${dict.settledBalance} ${tgl.substring(0, 7)}`
          };
          return;
        }

        const grupKey = `${tgl}_${kat}_Donatur`;

        if (!petaGabungan[grupKey]) {
          petaGabungan[grupKey] = {
            id: itemId, // ID representatif
            transaction_date: tgl,
            category: kat,
            amount: 0,
            isSystem: false,
            isFromExpenses: false,
            aliranJenis: 'Masuk',
            jumlahDonatur: 0
          };
        }

        petaGabungan[grupKey].amount += Math.abs(amount);
        petaGabungan[grupKey].jumlahDonatur += 1;
      });
    }

    if (Array.isArray(allExpenses)) {
      allExpenses.forEach((item) => {
        const tgl = item.transaction_date || item.TRANSACTION_DATE;
        const kat = item.category || item.CATEGORY || item.kategori || item.KATEGORI;
        const amount = parseFloat(item.amount || item.AMOUNT || item.nominal || item.NOMINAL || 0);
        const type = (item.type || item.TYPE || item.jenis || item.JENIS || '').toString().toLowerCase().trim();
        const noteText = item.note || item.NOTE || '';
        const itemId = item.id || item.ID;

        if (!tgl) return;

        const isKeluar = type === 'keluar' || type === 'pengeluaran';

        // Filter peninggalan query lama supabase (jika ada)
        if (!isKeluar && noteText.toLowerCase().includes('aplikasi pemasukan')) {
          return; 
        }

        const expKey = `EXP_${itemId}`;
        petaGabungan[expKey] = {
          id: itemId,
          transaction_date: tgl,
          category: kat || 'Lain-lain',
          amount: Math.abs(amount),
          aliranJenis: isKeluar ? 'Keluar' : 'Masuk',
          isSystem: true,
          isFromExpenses: true,
          uraian: noteText || (isKeluar ? dict.operasionalExpense : 'Pemasukan Lainnya')
        };
      });
    }

    return Object.values(petaGabungan).map(grup => {
      if (!grup.isSystem) {
        grup.uraian = `${dict.combinedDonor} ${grup.jumlahDonatur} ${dict.donorUpper} ${grup.category.toUpperCase()}`;
      }
      return grup;
    }).sort((a, b) => (b.transaction_date || '').localeCompare(a.transaction_date || ''));
  }, [allDonations, allExpenses, dict.systemFee, dict.settledBalance, dict.combinedDonor, dict.donorUpper, dict.operasionalExpense]);

  const dataTransaksiFinal = prosesDataGabunganMurni();

  // Hitung Rekapitulasi untuk LPJ
  const rekapKategoriMasuk = {};
  const rekapKategoriKeluar = {};
  let totalLpjMasuk = 0; 
  let totalLpjKeluar = 0;

  dataTransaksiFinal.forEach(item => {
    const amount = item.amount || 0;
    if (item.aliranJenis === 'Masuk') {
      totalLpjMasuk += amount;
      rekapKategoriMasuk[item.category] = (rekapKategoriMasuk[item.category] || 0) + amount;
    } else {
      totalLpjKeluar += amount;
      rekapKategoriKeluar[item.category] = (rekapKategoriKeluar[item.category] || 0) + amount;
    }
  });

  const formatRupiah = useCallback((num) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(num || 0);
  }, []);

  // Filter Data Tampilan (Client Side)
  const filteredTrans = dataTransaksiFinal.filter(t => {
    const matchSearch = (t.uraian || '').toLowerCase().includes(search.toLowerCase());
    
    let matchType = false;
    if (typeFilter === 'all') matchType = true;
    else if (typeFilter === 'masuk') matchType = t.aliranJenis === 'Masuk';
    else if (typeFilter === 'keluar') matchType = t.aliranJenis === 'Keluar';

    const matchCat = catFilter === 'all' || t.category === catFilter;
    return matchSearch && matchType && matchCat;
  });

  // Ekspor CSV Manual (Sama seperti sebelumnya)
  const handleExportExcelManual = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Tanggal,Kategori,Uraian Keterangan,Jenis,Nominal\n";
      
      filteredTrans.forEach(t => {
        const row = `"${t.transaction_date}","${t.category}","${t.uraian}","${t.aliranJenis}",${t.amount}\n`;
        csvContent += row;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `LAPORAN_BukuKas_Haul_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Berhasil mengunduh file Excel/CSV.', 'success');
    } catch (err) {
      showToast('Gagal mengekspor data: ' + err.message, 'error');
    }
  };

  if (loading && periodeList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-xs font-mono theme-text-primary">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <span className="font-bold">{t.syncData}</span>
      </div>
    );
  }

  return (
    <div id="root-transaksi-container" className="space-y-4 max-w-7xl mx-auto px-1 sm:px-0 pb-12 text-xs theme-text-primary relative font-sans">
      
      {/* FLOATING TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-[92%] print:hidden animate-in fade-in slide-in-from-top duration-300">
          <div className={`px-4 py-3 rounded-2xl backdrop-blur-xl flex items-center justify-between gap-3 shadow-2xl border-2 ${
            toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-200' :
            toast.type === 'error' ? 'bg-rose-950/90 border-rose-500/80 text-rose-200' :
            toast.type === 'warning' ? 'bg-amber-950/90 border-amber-500/80 text-amber-200' :
            'bg-slate-900/90 border-slate-700 text-white'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {toast.type === 'warning' && <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-400 shrink-0" />}
              <span className="font-bold text-xs leading-snug truncate">{toast.message}</span>
            </div>
            <button onClick={() => setToast({ ...toast, show: false })} className="p-1 hover:bg-white/10 rounded-lg transition-colors shrink-0 cursor-pointer">
              <X className="w-4 h-4 opacity-80 hover:opacity-100" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL DIALOG KONFIRMASI HAPUS */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 print:hidden animate-in fade-in duration-200">
          <GlassCard className="max-w-sm w-full text-center space-y-4 p-6 shadow-2xl border theme-border">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm uppercase theme-text-primary">Konfirmasi Hapus</h3>
            <p className="text-xs theme-text-secondary leading-relaxed font-semibold">Apakah Anda yakin ingin menghapus catatan transaksi internal ini secara permanen?</p>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setDeleteConfirm({ show: false, id: null, isExpenses: false })} className="flex-1 py-2.5 theme-bg-tertiary hover:bg-black/50 theme-text-secondary font-bold rounded-xl text-xs border theme-border cursor-pointer">Batal</button>
              <button onClick={executeDelete} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs uppercase shadow-lg cursor-pointer">Hapus</button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* PRINT STYLES UNTUK LPJ PROFESIONAL */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }

          html, body, main, #root-transaksi-container {
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: white !important;
            color: black !important;
          }

          .print\\:hidden, nav, header, sidebar, button, .lucide {
            display: none !important;
          }

          .hidden.print\\:block {
            display: block !important;
            visibility: visible !important;
            width: 100% !important;
          }

          .cetak-wrapper-logo, .cetak-wrapper-logo img {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-page-wrapper {
            background: white !important;
            color: black !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          .break-inside-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}} />

      {/* AREA UTAMA INTERFACE */}
      <div className="print:hidden space-y-4">
        
        {/* HEADER & TOP CONTROLS */}
        <GlassCard className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black uppercase tracking-wider theme-text-primary flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                {t.title}
              </h2>
              {isAdmin ? (
                <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full font-mono uppercase">
                  ADMIN
                </span>
              ) : (
                <span className="bg-rose-500/20 border border-rose-400/40 text-rose-400 text-[9px] font-black px-2 py-0.5 rounded-full font-mono uppercase">
                  PUBLIC
                </span>
              )}
            </div>
            <p className="text-[10px] font-mono mt-0.5 theme-text-secondary font-semibold">{t.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {periodeList.length > 0 && (
              <div className="flex items-center theme-bg-tertiary p-1 border theme-border rounded-xl mr-1">
                <span className="text-[9px] font-mono font-bold theme-text-secondary px-2 uppercase">{t.selectPeriod}</span>
                <select
                  value={selectedPeriodeId || ''}
                  onChange={(e) => setSelectedPeriodeId(Number(e.target.value))}
                  className="theme-bg-secondary border theme-border text-[10px] theme-text-accent rounded-lg px-2 py-1 font-mono font-bold cursor-pointer focus:outline-none"
                >
                  {periodeList.map((p) => {
                    const pId = p.id || p.ID;
                    const isClosed = p.is_closed || p.IS_CLOSED;
                    return (
                      <option key={pId} value={pId} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                        {p.nama_periode || p.NAMA_PERIODE} {isClosed ? t.statusClosed : t.statusActive}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            <div className="flex theme-bg-tertiary p-1 border theme-border rounded-xl mr-1">
              <button onClick={() => setLang('id')} className={`px-2 py-1 rounded-lg font-black text-[10px] transition-all cursor-pointer ${lang === 'id' ? 'bg-[#BFEC25] text-black' : 'theme-text-secondary'}`}>ID 🇮🇩</button>
              <button onClick={() => setLang('jv')} className={`px-2 py-1 rounded-lg font-black text-[10px] transition-all cursor-pointer ${lang === 'jv' ? 'bg-[#BFEC25] text-black' : 'theme-text-secondary'}`}>JV 🎯</button>
              <button onClick={() => setLang('en')} className={`px-2 py-1 rounded-lg font-black text-[10px] transition-all cursor-pointer ${lang === 'en' ? 'bg-[#BFEC25] text-black' : 'theme-text-secondary'}`}>EN 🇬🇧</button>
            </div>

            {isAdmin && currentPeriodeObj && !(currentPeriodeObj.is_closed || currentPeriodeObj.IS_CLOSED) && (
              <button 
                onClick={() => setShowModalTutupBuku(true)} 
                className="flex-1 sm:flex-initial px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase rounded-xl shadow-md transition-all text-[10px] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t.btnTutupBuku}</span>
              </button>
            )}

            {isAdmin && !(currentPeriodeObj?.is_closed || currentPeriodeObj?.IS_CLOSED) && (
              <button onClick={() => { resetForm(); setShowModal(true); }} className="flex-1 sm:flex-initial px-4 py-2 btn-theme-primary font-black uppercase rounded-xl shadow-md text-[10px] flex items-center justify-center gap-1.5 cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                <span>{t.btnTambah}</span>
              </button>
            )}
            
            <button onClick={handleExportExcelManual} className="flex-1 sm:flex-initial px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold uppercase rounded-xl shadow-md text-[10px] flex items-center justify-center gap-1.5 cursor-pointer">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{t.btnExcel}</span>
            </button>

            {/* TOMBOL CETAK LPJ */}
            <button onClick={handleCetakLPJ} className="flex-1 sm:flex-initial px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black uppercase rounded-xl shadow-md text-[10px] flex items-center justify-center gap-1.5 cursor-pointer">
              <Printer className="w-3.5 h-3.5" />
              <span>{t.btnCetak}</span>
            </button>
          </div>
        </GlassCard>

        {(currentPeriodeObj?.is_closed || currentPeriodeObj?.IS_CLOSED) && (
          <GlassCard className="p-3 border-amber-500/40 flex items-center justify-between text-amber-400 font-mono text-xs">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Periode <strong>{currentPeriodeObj.nama_periode || currentPeriodeObj.NAMA_PERIODE}</strong> telah ditutup buku. Data bersifat Read-Only.</span>
            </span>
            <span className="bg-amber-400 text-black px-2 py-0.5 rounded font-black text-[10px] uppercase">Arsip</span>
          </GlassCard>
        )}

        <GlassCard className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 theme-text-tertiary" />
            <input type="text" placeholder={t.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 theme-bg-tertiary border theme-border rounded-xl focus:outline-none theme-text-primary placeholder:theme-text-tertiary text-xs font-semibold" />
          </div>
          
          <div className="relative flex items-center">
            <Filter className="w-4 h-4 absolute left-3 theme-text-tertiary" />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full pl-9 pr-3 py-2 theme-bg-tertiary border theme-border rounded-xl theme-text-primary focus:outline-none cursor-pointer font-bold text-xs">
              <option value="all" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">{t.allCash}</option>
              <option value="masuk" className="bg-slate-900 text-emerald-400 dark:bg-slate-900 dark:text-emerald-400">{t.onlyIn}</option>
              <option value="keluar" className="bg-slate-900 text-rose-400 dark:bg-slate-900 dark:text-rose-400">{t.onlyOut}</option>
            </select>
          </div>

          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="w-full px-3 py-2 theme-bg-tertiary border theme-border rounded-xl theme-text-primary focus:outline-none cursor-pointer font-bold text-xs">
            <option value="all" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">{t.allCat}</option>
            {categories.map((c, i) => {
              const name = c.name || c.NAME;
              return <option key={i} value={name} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">{name}</option>
            })}
          </select>
        </GlassCard>

        <GlassCard className="p-0 overflow-x-auto max-h-[500px] overflow-y-auto shadow-xl relative scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[620px] sm:min-w-full">
            <thead>
              <tr className="theme-bg-tertiary theme-text-primary border-b theme-border font-mono uppercase text-[10px] font-bold tracking-wider sticky top-0 z-20 backdrop-blur-md">
                <th className="p-3 w-24">{t.thDate}</th>
                <th className="p-3 w-28">{t.thCat}</th>
                <th className="p-3">{t.thDesc}</th>
                <th className="p-3 text-right w-32">{t.thAmount}</th>
                {isAdmin && <th className="p-3 text-center w-36">{t.thAction}</th>}
              </tr>
            </thead>
            <tbody className="divide-y theme-border theme-text-primary">
              {filteredTrans.map((tItem, idx) => {
                const isKeluar = tItem.aliranJenis === 'Keluar';
                return (
                  <tr key={idx} className="hover:bg-white/5 transition-all">
                    <td className="p-3 font-mono theme-text-secondary font-bold text-[10px] whitespace-nowrap">{tItem.transaction_date}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 border rounded-full font-mono text-[9px] uppercase font-black inline-flex items-center gap-1 ${!isKeluar ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-400' : 'bg-rose-500/20 border-rose-400/40 text-rose-400'}`}>
                        {!isKeluar ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {tItem.category}
                      </span> 
                    </td>
                    <td className="p-3 font-bold text-[11px] sm:text-xs uppercase tracking-wide theme-text-primary">
                      {tItem.uraian}
                    </td>
                    <td className={`p-3 text-right font-mono font-black whitespace-nowrap ${!isKeluar ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {!isKeluar ? '+' : '-'}{formatRupiah(tItem.amount)}
                    </td>
                    {isAdmin && (
                      <td className="p-3 text-center space-x-2 font-mono whitespace-nowrap">
                        {(currentPeriodeObj?.is_closed || currentPeriodeObj?.IS_CLOSED) ? (
                          <span className="theme-text-accent italic font-bold text-[10px] flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" /> Terkunci
                          </span>
                        ) : tItem.isSystem ? (
                          <div className="flex items-center justify-center gap-1">
                            {tItem.isFromExpenses && (
                              <button type="button" onClick={() => triggerEdit(tItem)} className="p-1 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-colors cursor-pointer" title="Edit">
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button type="button" onClick={() => triggerHapus(tItem.id, tItem.isFromExpenses)} className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors cursor-pointer" title="Hapus">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="theme-text-secondary italic font-semibold text-[10px]">🔒 Terkunci Privasi</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
              {filteredTrans.length === 0 && (
                <tr><td colSpan={isAdmin ? 5 : 4} className="p-6 text-center theme-text-secondary font-mono font-bold">{t.noData}</td></tr>
              )}
            </tbody>
          </table>
        </GlassCard>
      </div>

      {/* MODAL TUTUP BUKU */}
      {showModalTutupBuku && isAdmin && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 print:hidden">
          <GlassCard className="p-6 w-full max-w-md space-y-4 shadow-2xl border theme-border">
            <h3 className="text-sm font-black uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Konfirmasi Tutup Buku Periode</span>
            </h3>
            <p className="text-xs theme-text-secondary leading-relaxed font-semibold">
              Proses ini akan mengunci seluruh transaksi di <strong>{currentPeriodeObj?.nama_periode || currentPeriodeObj?.NAMA_PERIODE}</strong> dan membentuk Saldo Kas Akhir sebesar <strong className="text-emerald-400">{formatRupiah(totalLpjMasuk - totalLpjKeluar)}</strong> menjadi Saldo Kas Awal periode baru.
            </p>
            <form onSubmit={handleProsesTutupBuku} className="space-y-4">
              <div>
                <label className="block theme-text-secondary mb-1 text-[11px] font-bold">Nama Periode Baru</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Haul 2027" 
                  required 
                  value={namaPeriodeBaruInput} 
                  onChange={e => setNamaPeriodeBaruInput(e.target.value)} 
                  className="w-full px-3 py-2 theme-bg-tertiary border theme-border rounded-xl focus:outline-none font-bold theme-text-accent text-xs" 
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModalTutupBuku(false)} className="flex-1 py-2.5 theme-bg-tertiary border theme-border theme-text-secondary font-bold rounded-xl text-xs cursor-pointer">Batal</button>
                <button type="submit" className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase rounded-xl shadow-lg text-xs cursor-pointer">Eksekusi Tutup Buku</button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* MODAL INPUT TRANSAKSI */}
      {showModal && isAdmin && !(currentPeriodeObj?.is_closed || currentPeriodeObj?.IS_CLOSED) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 print:hidden">
          <GlassCard className="p-6 w-full max-w-md space-y-4 shadow-2xl border theme-border">
            <h3 className="text-sm font-black uppercase tracking-wider theme-text-accent flex items-center gap-2">
              {isEditMode ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />} 
              <span>{isEditMode ? 'Ubah Catatan Operasional' : 'Registrasi Catatan Kas Baru'}</span>
            </h3>
            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block theme-text-secondary mb-1 font-bold text-[11px]">Tanggal</label>
                  <input type="date" required value={formDate} onChange={e => setFormDate(e.target.value)} className="w-full px-3 py-2 theme-bg-tertiary border theme-border rounded-xl focus:outline-none text-center font-mono theme-text-primary text-xs font-bold" />
                </div>
                <div>
                  <label className="block theme-text-secondary mb-1 font-bold text-[11px]">Aliran Jenis</label>
                  <select value={formType} onChange={e => setFormType(e.target.value)} className="w-full px-3 py-2 theme-bg-tertiary border theme-border rounded-xl focus:outline-none theme-text-primary cursor-pointer text-xs font-bold">
                    <option value="Pengeluaran" className="bg-slate-900 text-rose-400 dark:bg-slate-900 dark:text-rose-400">Pengeluaran (Merah)</option>
                    <option value="Pemasukan" className="bg-slate-900 text-emerald-400 dark:bg-slate-900 dark:text-emerald-400">Pemasukan (Hijau)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block theme-text-secondary mb-1 font-bold text-[11px]">Kategori Pos Buku Kas</label>
                <select required value={formCategory} onChange={e => setFormCategory(e.target.value)} className="w-full px-3 py-2 theme-bg-tertiary border theme-border rounded-xl focus:outline-none theme-text-primary cursor-pointer text-xs font-bold">
                  {categories.map((c, i) => {
                    const name = c.name || c.NAME;
                    return <option key={i} value={name} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">{name}</option>
                  })}
                </select>
              </div>
              <div>
                <label className="block theme-text-secondary mb-1 font-bold text-[11px]">Nominal Rupiah</label>
                <input type="number" placeholder="Contoh: 500000" required value={formAmount} onChange={e => setFormAmount(e.target.value)} className="w-full px-3 py-2 theme-bg-tertiary border theme-border rounded-xl focus:outline-none font-mono text-right font-black theme-text-accent text-sm" />
              </div>
              <div>
                <label className="block theme-text-secondary mb-1 font-bold text-[11px]">Uraian Keterangan</label>
                <input type="text" placeholder="Misal: DP Sound System" required value={formDescription} onChange={e => setFormDescription(e.target.value)} className="w-full px-3 py-2 theme-bg-tertiary border theme-border rounded-xl focus:outline-none theme-text-primary text-xs font-bold" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={resetForm} className="flex-1 py-2.5 theme-bg-tertiary border theme-border theme-text-secondary font-bold rounded-xl text-xs cursor-pointer">Batal</button>
                <button type="submit" className="flex-1 py-2.5 btn-theme-primary font-black uppercase rounded-xl shadow-lg text-xs cursor-pointer">Simpan Kas</button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* AREA CETAK LPJ PROFESIONAL (FORMAL A4 PRINT OUT ONLY) */}
      <div className="hidden print:block bg-white text-black p-0 font-serif text-[11px] leading-relaxed w-full">
        <div className="print-page-wrapper">
          
          {/* KOP SURAT FORMAL */}
          <div className="flex items-center justify-between border-b-4 border-double border-black pb-3 mb-4">
            <div className="cetak-wrapper-logo w-16 h-16 flex-shrink-0 flex items-center justify-center">
              {metaOrg.logoUrl ? (
                <img 
                  src={metaOrg.logoUrl}
                  alt="Logo Resmi" 
                  className="w-16 h-16 object-contain"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-16 h-16 border-2 border-black flex items-center justify-center font-bold text-xs uppercase text-center font-sans">LOGO</div>
              )}
            </div>
            <div className="text-center flex-1 px-2">
              <h1 className="text-lg font-bold uppercase font-sans tracking-wide leading-tight">{metaOrg.name}</h1>
              <p className="text-[9px] font-sans italic text-gray-700 mt-0.5">{metaOrg.address}</p>
            </div>
            <div className="w-16 h-16 flex-shrink-0"></div>
          </div>
          
          <div className="text-center mb-5">
            <h2 className="text-sm font-bold uppercase underline tracking-widest font-sans">{t.lpjTitle}</h2>
            <p className="text-[9px] text-gray-600 mt-0.5">{t.lpjPeriod} {new Date().toLocaleDateString(lang === 'id' ? 'id-ID' : lang === 'jv' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          {/* TABEL 1: RINGKASAN UTAMA (IKHTISAR SALDO) */}
          <table className="w-full border-collapse border-2 border-black text-[11px] mb-5 font-sans">
            <thead>
              <tr className="bg-gray-200 border-b-2 border-black uppercase text-[10px] tracking-wider text-center font-bold">
                <th className="border-r-2 border-black py-2 px-3 text-left w-2/3">{t.tblHeaderDesc}</th>
                <th className="py-2 px-3 text-right w-1/3">{t.tblHeaderAmount}</th>
              </tr>
            </thead>
            <tbody className="font-medium divide-y divide-black">
              <tr className="border-b border-black">
                <td className="border-r border-black py-2 px-3 text-left">{t.totalIn}</td>
                <td className="py-2 px-3 text-right text-emerald-900 font-bold font-mono">{formatRupiah(totalLpjMasuk)}</td>
              </tr>
              <tr className="border-b border-black">
                <td className="border-r border-black py-2 px-3 text-left">{t.totalOut}</td>
                <td className="py-2 px-3 text-right text-rose-900 font-bold font-mono">({formatRupiah(totalLpjKeluar)})</td>
              </tr>
              <tr className="bg-gray-100 font-bold text-sm">
                <td className="border-r-2 border-black py-2 px-3 text-left uppercase">{t.netBalance}</td>
                <td className="py-2 px-3 text-right text-blue-900 font-mono border-t-2 border-black">{formatRupiah(totalLpjMasuk - totalLpjKeluar)}</td>
              </tr>
            </tbody>
          </table>

          {/* TABEL 2: REKAPITULASI TOTAL PER KATEGORI POS */}
          <div className="space-y-2 mb-6">
            <h3 className="font-bold text-xs uppercase border-b-2 border-black pb-1 font-sans">{t.summarySect}</h3>
            <div className="grid grid-cols-2 gap-4">
              
              {/* POS PEMASUKAN */}
              <div>
                <table className="w-full text-left border-collapse border-2 border-black text-[10px] font-sans">
                  <thead>
                    <tr className="bg-gray-200 font-bold uppercase text-[8px] border-b-2 border-black">
                      <th className="py-1.5 px-2 border-r border-black">{t.summaryCat} (In)</th>
                      <th className="py-1.5 px-2 text-right">{t.summaryTotal}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(rekapKategoriMasuk).map((key, idx) => (
                      <tr key={idx} className="border-b border-black">
                        <td className="py-1 px-2 uppercase border-r border-black font-medium">{key}</td>
                        <td className="py-1 px-2 text-right font-mono text-emerald-900 font-bold">{formatRupiah(rekapKategoriMasuk[key])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* POS PENGELUARAN */}
              <div>
                <table className="w-full text-left border-collapse border-2 border-black text-[10px] font-sans">
                  <thead>
                    <tr className="bg-gray-200 font-bold uppercase text-[8px] border-b-2 border-black">
                      <th className="py-1.5 px-2 border-r border-black">{t.summaryCat} (Out)</th>
                      <th className="py-1.5 px-2 text-right">{t.summaryTotal}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(rekapKategoriKeluar).map((key, idx) => (
                      <tr key={idx} className="border-b border-black">
                        <td className="py-1 px-2 uppercase border-r border-black font-medium">{key}</td>
                        <td className="py-1 px-2 text-right font-mono text-rose-900 font-bold">{formatRupiah(rekapKategoriKeluar[key])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
          
          {/* TABEL MUTASI RINCIAN PEMASUKAN & PENGELUARAN LENGKAP */}
          <div className="space-y-5 pt-2">
            <h2 className="text-center font-sans font-bold text-xs uppercase underline tracking-wider">LAMPIRAN MUTASI PEMBUKUAN ALIRAN KAS</h2>
            
            {/* TABEL MUTASI KAS MASUK */}
            <div>
              <h3 className="font-bold text-[10px] uppercase mb-1 font-sans border-b border-black pb-0.5">{t.sectIn}</h3>
              <table className="w-full text-left border-collapse border-2 border-black text-[9px]">
                <thead>
                  <tr className="border-b-2 border-black bg-gray-200 font-bold uppercase text-[8px]">
                    <th className="border-r border-black py-1.5 px-1.5 w-20 text-center">{t.thDate}</th>
                    <th className="border-r border-black py-1.5 px-1.5 w-28">{t.thCat}</th>
                    <th className="border-r border-black py-1.5 px-1.5">{t.thLpjDesc}</th>
                    <th className="py-1.5 px-1.5 text-right w-28">{t.thAmount}</th>
                  </tr>
                </thead>
                <tbody>
                  {dataTransaksiFinal.filter(x => x.aliranJenis === 'Masuk').map((tItem, idx) => (
                    <tr key={idx} className="border-b border-black">
                      <td className="border-r border-black py-1 px-1.5 font-mono text-center text-gray-800">{tItem.transaction_date}</td>
                      <td className="border-r border-black py-1 px-1.5 uppercase text-gray-800 font-sans">{tItem.category}</td>
                      <td className="border-r border-black py-1 px-1.5 uppercase font-sans text-gray-900 font-medium tracking-wide">{tItem.uraian}</td>
                      <td className="py-1 px-1.5 text-right font-mono font-bold text-emerald-900">{formatRupiah(tItem.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TABEL MUTASI KAS KELUAR */}
            <div>
              <h3 className="font-bold text-[10px] uppercase mb-1 font-sans border-b border-black pb-0.5">{t.sectOut}</h3>
              <table className="w-full text-left border-collapse border-2 border-black text-[9px]">
                <thead>
                  <tr className="border-b-2 border-black bg-gray-200 font-bold uppercase text-[8px]">
                    <th className="border-r border-black py-1.5 px-1.5 w-20 text-center">{t.thDate}</th>
                    <th className="border-r border-black py-1.5 px-1.5 w-28">{t.thCat}</th>
                    <th className="border-r border-black py-1.5 px-1.5">{t.thLpjDesc}</th>
                    <th className="py-1.5 px-1.5 text-right w-28">{t.thAmount}</th>
                  </tr>
                </thead>
                <tbody>
                  {dataTransaksiFinal.filter(x => x.aliranJenis === 'Keluar').map((tItem, idx) => (
                    <tr key={idx} className="border-b border-black">
                      <td className="border-r border-black py-1 px-1.5 font-mono text-center text-gray-800">{tItem.transaction_date}</td>
                      <td className="border-r border-black py-1 px-1.5 uppercase text-gray-800 font-sans">{tItem.category}</td>
                      <td className="border-r border-black py-1 px-1.5 uppercase font-sans text-gray-900 font-medium tracking-wide">{tItem.uraian}</td>
                      <td className="py-1 px-1.5 text-right font-mono font-bold text-rose-900">{formatRupiah(tItem.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* AREA TANDA TANGAN FORMAL */}
          <div className="mt-8 break-inside-avoid">
            <p className="text-right text-[10px] text-gray-800 italic mb-8 font-sans">
              {t.city}, {new Date().toLocaleDateString(lang === 'id' ? 'id-ID' : lang === 'jv' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className="grid grid-cols-2 gap-8 text-center text-[10px] font-sans">
              <div>
                <p className="font-bold uppercase tracking-wider mb-14 text-gray-800">{t.signKnow}<br />{t.signChair}</p>
                <p className="font-bold underline uppercase text-black">{metaOrg.ketua}</p>
                <p className="text-[8px] text-gray-600 font-medium mt-0.5">{t.signGroup}</p>
              </div>
              <div>
                <p className="font-bold uppercase tracking-wider mb-14 text-gray-800">{t.signMade}<br />{t.signTreasurer}</p>
                <p className="font-bold underline uppercase text-black">{metaOrg.bendahara}</p>
                <p className="text-[8px] text-gray-600 font-medium mt-0.5">{t.signGroup}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
