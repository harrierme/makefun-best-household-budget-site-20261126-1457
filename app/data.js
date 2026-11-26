// Dompet Keluarga — data contoh realistis keluarga Mahendra, November 2026.
// Semua angka konsisten: total per kategori dihitung dari daftar transaksi ini,
// jadi dasbor, anggaran, dan grafik selalu sepakat. Nilai dalam Rupiah.

export const HOUSEHOLD = {
  name: 'Keluarga Mahendra',
  members: 'Budi & Sari + 2 anak',
  city: 'Jakarta Selatan',
  monthLabel: 'November 2026',
  month: '2026-11',
};

export const CATEGORIES = [
  { id: 'makanan', label: 'Makanan & Belanja', color: '#2d6a4f', icon: '🛒' },
  { id: 'transport', label: 'Transportasi', color: '#40916c', icon: '🛵' },
  { id: 'tagihan', label: 'Tagihan & Utilitas', color: '#d97706', icon: '💡' },
  { id: 'pendidikan', label: 'Pendidikan', color: '#1d4ed8', icon: '📚' },
  { id: 'kesehatan', label: 'Kesehatan', color: '#be185d', icon: '💊' },
  { id: 'hiburan', label: 'Hiburan', color: '#7c3aed', icon: '🎬' },
  { id: 'tabungan', label: 'Tabungan', color: '#0f766e', icon: '💰' },
  { id: 'lainnya', label: 'Lainnya', color: '#6b7280', icon: '🧾' },
];

// Anggaran bulanan keluarga (total Rp12.200.000 dari pemasukan Rp12.500.000).
export const BUDGET_PLAN = [
  { category: 'makanan', amount: 3500000 },
  { category: 'transport', amount: 1000000 },
  { category: 'tagihan', amount: 2200000 },
  { category: 'pendidikan', amount: 1500000 },
  { category: 'kesehatan', amount: 500000 },
  { category: 'hiburan', amount: 600000 },
  { category: 'tabungan', amount: 2500000 },
  { category: 'lainnya', amount: 400000 },
];

// Pemasukan November 2026.
export const INCOME = [
  { id: 'inc-1', date: '2026-11-01', label: 'Gaji Budi (karyawan swasta)', amount: 8500000 },
  { id: 'inc-2', date: '2026-11-01', label: 'Gaji Sari (guru honorer + les)', amount: 4000000 },
];

// Pengeluaran 1–26 November 2026. Realisasi per kategori:
// makanan 2.460.000 · transport 949.000 · tagihan 2.077.000 · pendidikan 1.345.000
// kesehatan 370.000 · hiburan 605.000 · tabungan 2.500.000 · lainnya 300.000
// Total keluar Rp10.606.000 — sisa Rp1.894.000 dari pemasukan Rp12.500.000.
export const TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', label: 'Belanja bulanan Super Indo', category: 'makanan', amount: 850000 },
  { id: 't02', date: '2026-11-01', label: 'Transfer ke tabungan keluarga', category: 'tabungan', amount: 1500000 },
  { id: 't03', date: '2026-11-01', label: 'Setoran dana darurat', category: 'tabungan', amount: 1000000 },
  { id: 't04', date: '2026-11-02', label: 'SPP anak (SD + TK)', category: 'pendidikan', amount: 1200000 },
  { id: 't05', date: '2026-11-02', label: 'Bensin Pertalite', category: 'transport', amount: 250000 },
  { id: 't06', date: '2026-11-03', label: 'Belanja sayur & buah Pasar Minggu', category: 'makanan', amount: 185000 },
  { id: 't07', date: '2026-11-03', label: 'Internet rumah 50 Mbps', category: 'tagihan', amount: 350000 },
  { id: 't08', date: '2026-11-05', label: 'Listrik PLN', category: 'tagihan', amount: 412000 },
  { id: 't09', date: '2026-11-05', label: 'Makan siang keluarga di warteg', category: 'hiburan', amount: 85000 },
  { id: 't10', date: '2026-11-06', label: 'Air PDAM', category: 'tagihan', amount: 185000 },
  { id: 't11', date: '2026-11-07', label: 'Belanja mingguan (sayur, telur, tempe)', category: 'makanan', amount: 240000 },
  { id: 't12', date: '2026-11-08', label: 'Vitamin & obat anak', category: 'kesehatan', amount: 120000 },
  { id: 't13', date: '2026-11-09', label: 'Bensin Pertalite', category: 'transport', amount: 200000 },
  { id: 't14', date: '2026-11-10', label: 'Ayam & daging untuk seminggu', category: 'makanan', amount: 320000 },
  { id: 't15', date: '2026-11-10', label: 'BPJS Kesehatan keluarga', category: 'tagihan', amount: 280000 },
  { id: 't16', date: '2026-11-10', label: 'Iuran RT & kebersihan', category: 'lainnya', amount: 50000 },
  { id: 't17', date: '2026-11-12', label: 'Parkir & tol', category: 'transport', amount: 85000 },
  { id: 't18', date: '2026-11-14', label: 'Belanja mingguan', category: 'makanan', amount: 265000 },
  { id: 't19', date: '2026-11-14', label: 'Makan malam di luar (bakso + es teh)', category: 'hiburan', amount: 180000 },
  { id: 't20', date: '2026-11-15', label: 'Cicilan motor', category: 'tagihan', amount: 850000 },
  { id: 't21', date: '2026-11-16', label: 'Bensin Pertalite', category: 'transport', amount: 200000 },
  { id: 't22', date: '2026-11-17', label: 'Buku & alat tulis anak', category: 'pendidikan', amount: 145000 },
  { id: 't23', date: '2026-11-18', label: 'Belanja sayur & lauk', category: 'makanan', amount: 195000 },
  { id: 't24', date: '2026-11-20', label: 'Ojek online (antar jemput anak)', category: 'transport', amount: 64000 },
  { id: 't25', date: '2026-11-20', label: 'Langganan streaming film', category: 'hiburan', amount: 120000 },
  { id: 't26', date: '2026-11-21', label: 'Belanja mingguan', category: 'makanan', amount: 230000 },
  { id: 't27', date: '2026-11-22', label: 'Makan di luar (nasi padang)', category: 'hiburan', amount: 220000 },
  { id: 't28', date: '2026-11-23', label: 'Bensin Pertalite', category: 'transport', amount: 150000 },
  { id: 't29', date: '2026-11-24', label: 'Beras 10 kg + minyak goreng', category: 'makanan', amount: 175000 },
  { id: 't30', date: '2026-11-24', label: 'Periksa gigi anak', category: 'kesehatan', amount: 250000 },
  { id: 't31', date: '2026-11-25', label: 'Pulsa & paket data', category: 'lainnya', amount: 100000 },
  { id: 't32', date: '2026-11-25', label: 'Hadiah ulang tahun tetangga', category: 'lainnya', amount: 150000 },
];

// Tagihan rutin bulanan beserta tanggal jatuh tempo dan status bayar (per 26 Nov).
export const BILLS = [
  { id: 'b01', label: 'SPP anak (SD + TK)', amount: 1200000, dueDay: 2, paid: true },
  { id: 'b02', label: 'Internet rumah 50 Mbps', amount: 350000, dueDay: 3, paid: true },
  { id: 'b03', label: 'Listrik PLN', amount: 412000, dueDay: 5, paid: true },
  { id: 'b04', label: 'Air PDAM', amount: 185000, dueDay: 6, paid: true },
  { id: 'b05', label: 'BPJS Kesehatan keluarga', amount: 280000, dueDay: 10, paid: true },
  { id: 'b06', label: 'Iuran RT & kebersihan', amount: 50000, dueDay: 10, paid: true },
  { id: 'b07', label: 'Cicilan motor', amount: 850000, dueDay: 15, paid: true },
  { id: 'b08', label: 'Langganan streaming film', amount: 120000, dueDay: 20, paid: true },
  { id: 'b09', label: 'Pulsa & paket data', amount: 100000, dueDay: 25, paid: true },
  { id: 'b10', label: 'Asuransi jiwa Budi', amount: 375000, dueDay: 28, paid: false },
];

// Target tabungan keluarga.
export const GOALS = [
  { id: 'g1', label: 'Dana darurat (6 bulan pengeluaran)', saved: 21500000, target: 48000000 },
  { id: 'g2', label: 'Liburan keluarga ke Yogyakarta', saved: 3200000, target: 6000000 },
  { id: 'g3', label: 'DP motor baru', saved: 5000000, target: 12000000 },
  { id: 'g4', label: 'Dana pendidikan anak', saved: 2750000, target: 10000000 },
];

// Tips hemat dengan estimasi penghematan per bulan.
export const TIPS = [
  { id: 'tip1', title: 'Masak bekal 3× seminggu', detail: 'Bawa bekal dari rumah Senin, Rabu, Jumat — ganti jajan kantin Rp25.000/hari.', save: 450000 },
  { id: 'tip2', title: 'Belanja pakai daftar, jangan lapar', detail: 'Tulis daftar sebelum ke pasar. Belanja tanpa daftar rata-rata boros 15% untuk barang tak perlu.', save: 250000 },
  { id: 'tip3', title: 'Kurangi kopi & jajan di luar', detail: 'Kopi sachet di rumah dan tumbler sendiri: Rp6.000/hari × 30 hari.', save: 180000 },
  { id: 'tip4', title: 'Servis motor tepat waktu', detail: 'Ganti oli tiap 2.000 km mencegah turun mesin yang biayanya Rp2–4 juta sekali datang.', save: 150000 },
  { id: 'tip5', title: 'Matikan lampu & cabut charger', detail: 'AC 1 jam lebih pendek tiap malam + lampu teras LED: tagihan listrik turun ~Rp120.000.', save: 120000 },
  { id: 'tip6', title: 'Patungan langganan streaming', detail: 'Satu akun keluarga untuk 4 profil, bukan 2 langganan terpisah.', save: 80000 },
];
