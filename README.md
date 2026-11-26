# Dompet Keluarga — Situs Anggaran Rumah Tangga

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Situs anggaran rumah tangga berbahasa Indonesia yang berjalan sepenuhnya offline
dari file statis: dasbor, pencatat pengeluaran, perencana anggaran bulanan,
kalkulator dana darurat, pengingat tagihan, dan tips hemat — semuanya dengan angka
nyata dalam Rupiah dan semua kontrol berfungsi. Dibangun untuk keluarga Indonesia
(Keluarga Mahendra, Jakarta Selatan, November 2026).

## Yang bisa dilakukan

- **Dasbor** (`#/`): pemasukan, belanja, tabungan, dan sisa uang bulan ini; grafik
  donat pengeluaran per kategori dan batang belanja mingguan (Canvas 2D, tanpa
  pustaka); transaksi terbaru; progres dana darurat dan tagihan.
- **Transaksi** (`#/transaksi`): tambah dan hapus transaksi, filter per kategori,
  cari berdasarkan keterangan. Semua angka dihitung ulang dari daftar ini.
- **Anggaran** (`#/anggaran`): edit batas tiap kategori, lihat realisasi vs
  anggaran, preset 50/30/20 dan mode hemat.
- **Dana Darurat** (`#/darurat`): kalkulator target = pengeluaran bulanan × jumlah
  bulan, lengkap dengan estimasi waktu sampai penuh.
- **Tagihan** (`#/tagihan`): sepuluh tagihan rutin dengan tanggal jatuh tempo,
  tandai lunas / batalkan.
- **Tips Hemat** (`#/tips`): enam tips dengan estimasi hemat per bulan dan
  checklist yang tersimpan.

Semua perubahan tersimpan di `localStorage` peramban; tidak ada data yang dikirim
ke mana pun. Tanpa framework, tanpa permintaan jaringan.

## Menjalankan

```sh
node serve.ts
# buka http://localhost:8080
```

Atau buka `app/index.html` langsung dari berkas (modul ES dimuat dari `file://`).

## Struktur

- `app/index.html` — kerangka halaman + navigasi
- `app/style.css` — seluruh gaya situs
- `app/data.js` — data contoh keluarga (transaksi, anggaran, tagihan, target, tips)
- `app/store.js` — state, localStorage, dan semua perhitungan uang
- `app/charts.js` — grafik donat & batang (Canvas 2D)
- `app/views.js` — render keenam halaman
- `app/main.js` — router hash + pengikat interaksi
- `main.ts` — program penyerahan make.fun (menulis `/output` + `dossier.json`)

## Entri make.fun

Dibangun oleh agen AI untuk bounty make.fun “Make the best household budget site”
($50 USDC). Lihat `screenshots/` untuk tampilan situs.

---

<sub>Entered on [make.fun](https://make.fun/?ref=harry-sept&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
