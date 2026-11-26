// Dompet Keluarga — semua halaman situs. Setiap halaman dirender dari state
// (data contoh + perubahan pengguna) sehingga angka di layar selalu konsisten.

import { HOUSEHOLD, CATEGORIES } from './data.js';
import {
  rupiah, categoryById, totalIncome, totalSpent, totalSpentExcludingSavings,
  totalSaved, remainingMoney, budgetFor, totalBudget, spendingByCategory,
  weeklySpending, billsSummary, emergencyPlan, tipsCatalog, potentialMonthlySaving,
} from './store.js';
import { drawDonut, drawWeeklyBars, progressBar } from './charts.js';

const fmtDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

function kpiCard(label, value, note, tone) {
  return `<div class="kpi ${tone || ''}">
    <div class="kpi-label">${label}</div>
    <div class="kpi-value">${value}</div>
    <div class="kpi-note">${note}</div>
  </div>`;
}

function legendRow(row) {
  const pct = row.spent > 0 ? Math.round((row.spent / Math.max(1, row._total)) * 100) : 0;
  return `<li>
    <span class="dot" style="background:${row.color}"></span>
    <span class="leg-label">${row.icon} ${row.label}</span>
    <span class="leg-value">${rupiah(row.spent)}</span>
    <span class="leg-pct">${pct}%</span>
  </li>`;
}

// ---------------- Dasbor ----------------

export function viewDashboard(state) {
  const income = totalIncome(state);
  const spent = totalSpentExcludingSavings(state);
  const saved = totalSaved(state);
  const rest = remainingMoney(state);
  const byCat = spendingByCategory(state);
  const spendTotal = byCat.filter((r) => r.id !== 'tabungan').reduce((s, r) => s + r.spent, 0);
  byCat.forEach((r) => { r._total = spendTotal; });
  const recent = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const emergency = state.goals[0];
  const emergencyPct = Math.round((emergency.saved / emergency.target) * 100);
  const bills = billsSummary(state);

  return `
  <section class="hero">
    <div>
      <p class="eyebrow">Anggaran ${HOUSEHOLD.monthLabel} · ${HOUSEHOLD.city}</p>
      <h1>Uang keluarga terkendali, tanpa drama akhir bulan.</h1>
      <p class="lede">Dompet Keluarga mencatat pemasukan, belanja, tagihan, dan tabungan
      ${HOUSEHOLD.name} dalam satu tempat — semua angka di bawah ini dihitung dari
      transaksi nyata bulan ini, bukan contoh kosong.</p>
      <p class="hero-actions">
        <a class="btn primary" href="#/transaksi">+ Catat pengeluaran</a>
        <a class="btn" href="#/anggaran">Lihat anggaran</a>
      </p>
    </div>
    <div class="hero-card">
      <div class="hero-card-title">Sisa uang bulan ini</div>
      <div class="hero-card-value">${rupiah(rest)}</div>
      <div class="hero-card-note">dari pemasukan ${rupiah(income)} — belanja ${rupiah(spent)} — tabungan ${rupiah(saved)}</div>
      ${progressBar((spent / income) * 100, '#2d6a4f')}
      <div class="hero-card-foot">Terpakai ${Math.round((spent / income) * 100)}% dari pemasukan</div>
    </div>
  </section>

  <section class="kpis">
    ${kpiCard('Pemasukan', rupiah(income), 'Gaji Budi Rp8,5 jt + Sari Rp4 jt', 'good')}
    ${kpiCard('Belanja bulan ini', rupiah(spent), '26 hari tercatat, tanpa tabungan', '')}
    ${kpiCard('Ditabung', rupiah(saved), 'Dana darurat + tabungan keluarga', 'good')}
    ${kpiCard('Sisa', rupiah(rest), 'Aman untuk 4 hari tersisa', rest >= 0 ? 'good' : 'bad')}
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Ke mana uang pergi?</h2>
      <p class="muted">Pembagian belanja November 2026 per kategori.</p>
      <canvas id="donut" aria-label="Grafik donat pengeluaran per kategori"></canvas>
      <ul class="legend">${byCat.filter((r) => r.id !== 'tabungan').map(legendRow).join('')}</ul>
    </article>
    <article class="card">
      <h2>Belanja per minggu</h2>
      <p class="muted">Minggu ke-4 paling hemat: belanja mingguan turun setelah stok kulkas terisi.</p>
      <canvas id="weekly" aria-label="Grafik batang belanja per minggu"></canvas>
      <h3>Target tabungan</h3>
      ${state.goals.slice(0, 3).map((g) => `
        <div class="goal-row">
          <div class="goal-head"><span>${g.label}</span><span>${rupiah(g.saved)} / ${rupiah(g.target)}</span></div>
          ${progressBar((g.saved / g.target) * 100, '#0f766e')}
        </div>`).join('')}
      <p><a href="#/darurat">Hitung dana darurat →</a></p>
    </article>
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Transaksi terbaru</h2>
      <table class="tx">
        <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th></tr></thead>
        <tbody>${recent.map((t) => `<tr>
          <td>${fmtDate(t.date)}</td><td>${t.label}</td>
          <td>${categoryById(t.category).icon} ${categoryById(t.category).label}</td>
          <td class="num">${rupiah(t.amount)}</td></tr>`).join('')}</tbody>
      </table>
      <p><a href="#/transaksi">Lihat semua ${state.transactions.length} transaksi →</a></p>
    </article>
    <article class="card">
      <h2>Tagihan bulan ini</h2>
      <p class="big">${rupiah(bills.paid)} <span class="muted">dari ${rupiah(bills.total)} sudah dibayar</span></p>
      ${bills.unpaidCount === 0
        ? '<p class="ok">✅ Semua tagihan lunas. Bulan depan mulai lagi tanggal 2.</p>'
        : `<p class="warn">⚠️ ${bills.unpaidCount} tagihan belum dibayar: ${rupiah(bills.unpaidTotal)} — jatuh tempo terdekat 28 November (asuransi jiwa).</p>`}
      <p><a href="#/tagihan">Kelola tagihan →</a></p>
      <h3>Dana darurat: ${emergencyPct}%</h3>
      <p class="muted">${rupiah(emergency.saved)} dari target ${rupiah(emergency.target)} (6 bulan pengeluaran).</p>
      ${progressBar(emergencyPct, '#0f766e')}
      <p><a href="#/darurat">Rencanakan dana darurat →</a></p>
    </article>
  </section>`;
}

export function mountDashboard(state) {
  const byCat = spendingByCategory(state);
  const donut = document.getElementById('donut');
  if (donut) drawDonut(donut, byCat);
  const weekly = document.getElementById('weekly');
  if (weekly) drawWeeklyBars(weekly, weeklySpending(state));
}

// ---------------- Transaksi ----------------

export function viewTransactions(state, filter) {
  const cats = CATEGORIES;
  let list = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  if (filter.category) list = list.filter((t) => t.category === filter.category);
  if (filter.q) {
    const q = filter.q.toLowerCase();
    list = list.filter((t) => t.label.toLowerCase().includes(q));
  }
  const total = list.reduce((s, t) => s + t.amount, 0);
  const options = cats.map((c) =>
    `<option value="${c.id}" ${filter.category === c.id ? 'selected' : ''}>${c.label}</option>`).join('');

  return `
  <section class="page-head">
    <h1>Catat pengeluaran</h1>
    <p class="lede">Semua transaksi ${HOUSEHOLD.monthLabel}. Tambah yang baru, hapus yang salah ketik —
    dasbor dan anggaran ikut berubah otomatis karena semua dihitung dari daftar ini.</p>
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Tambah transaksi</h2>
      <form id="tx-form">
        <label>Tanggal <input type="date" name="date" value="2026-11-26" required></label>
        <label>Keterangan <input type="text" name="label" placeholder="cth: Belanja sayur pasar" required maxlength="80"></label>
        <label>Kategori
          <select name="category">${cats.map((c) => `<option value="${c.id}">${c.label}</option>`).join('')}</select>
        </label>
        <label>Jumlah (Rp) <input type="number" name="amount" min="1000" step="500" placeholder="50000" required></label>
        <button class="btn primary" type="submit">Simpan transaksi</button>
        <p class="form-note" id="tx-note">Tersimpan di peramban ini (localStorage) — tetap ada saat halaman dibuka lagi.</p>
      </form>
    </article>
    <article class="card">
      <h2>Ringkasan</h2>
      <p class="big">${state.transactions.length} transaksi · ${rupiah(totalSpent(state))}</p>
      <p class="muted">Menampilkan ${list.length} transaksi · total ${rupiah(total)}</p>
      <form id="tx-filter" class="filter-row">
        <select name="category" aria-label="Filter kategori">
          <option value="">Semua kategori</option>${options}
        </select>
        <input type="search" name="q" placeholder="Cari keterangan…" value="${filter.q || ''}" aria-label="Cari transaksi">
        <button class="btn" type="submit">Filter</button>
      </form>
      <p class="muted">Kategori belanja terbesar bulan ini: <strong>${spendingByCategory(state).filter((r) => r.id !== 'tabungan')[0].label}</strong>
      (${rupiah(spendingByCategory(state).filter((r) => r.id !== 'tabungan')[0].spent)}).</p>
    </article>
  </section>

  <section class="card">
    <h2>Daftar transaksi</h2>
    <table class="tx">
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th><th></th></tr></thead>
      <tbody>${list.map((t) => `<tr>
        <td>${fmtDate(t.date)}</td><td>${t.label}</td>
        <td>${categoryById(t.category).icon} ${categoryById(t.category).label}</td>
        <td class="num">${rupiah(t.amount)}</td>
        <td><button class="btn small danger" data-del="${t.id}">Hapus</button></td></tr>`).join('') || '<tr><td colspan="5">Tidak ada transaksi yang cocok.</td></tr>'}</tbody>
    </table>
  </section>`;
}

// ---------------- Anggaran ----------------

export function viewBudget(state) {
  const income = totalIncome(state);
  const total = totalBudget(state);
  const rows = spendingByCategory(state);
  return `
  <section class="page-head">
    <h1>Perencana anggaran bulanan</h1>
    <p class="lede">Atur batas belanja tiap kategori untuk ${HOUSEHOLD.monthLabel}. Total anggaran
    ${rupiah(total)} dari pemasukan ${rupiah(income)} — sisa tak teralokasi ${rupiah(income - total)}.
    Ubah angkanya, tekan simpan, dan bilah progres langsung menunjukkan realisasi.</p>
    <p>
      <button class="btn" data-preset="50-30-20">Preset 50/30/20</button>
      <button class="btn" data-preset="hemat">Preset mode hemat</button>
      <button class="btn" data-preset="reset">Kembali ke rencana awal</button>
    </p>
  </section>

  <section class="card">
    <form id="budget-form">
      <table class="tx budget-table">
        <thead><tr><th>Kategori</th><th>Anggaran</th><th>Terpakai</th><th class="num">Sisa</th><th>Progres</th></tr></thead>
        <tbody>${rows.map((r) => {
          const left = r.budget - r.spent;
          const pct = r.budget > 0 ? (r.spent / r.budget) * 100 : 0;
          const status = r.id === 'tabungan'
            ? (pct >= 100 ? '🎉 Target tercapai' : '🟢 Menabung')
            : pct > 100 ? '🔴 Lewat batas' : pct > 85 ? '🟡 Hampir habis' : '🟢 Aman';
          return `<tr>
            <td>${r.icon} ${r.label}</td>
            <td><input type="number" name="budget-${r.id}" value="${r.budget}" min="0" step="50000" aria-label="Anggaran ${r.label}"></td>
            <td>${rupiah(r.spent)}</td>
            <td class="num ${left < 0 ? 'neg' : ''}">${rupiah(left)}</td>
            <td>${progressBar(pct, r.color)}<span class="muted">${Math.round(pct)}% · ${status}</span></td>
          </tr>`;
        }).join('')}</tbody>
        <tfoot><tr><td><strong>Total</strong></td><td><strong>${rupiah(total)}</strong></td>
        <td><strong>${rupiah(totalSpent(state))}</strong></td>
        <td class="num"><strong>${rupiah(total - totalSpent(state))}</strong></td><td></td></tr></tfoot>
      </table>
      <p><button class="btn primary" type="submit">Simpan anggaran</button>
      <span class="form-note" id="budget-note"></span></p>
    </form>
  </section>

  <section class="card">
    <h2>Metode 50/30/20, dihitung dari gajimu</h2>
    <p>Kebutuhan (50%): <strong>${rupiah(income * 0.5)}</strong> · Keinginan (30%): <strong>${rupiah(income * 0.3)}</strong> ·
    Tabungan &amp; utang (20%): <strong>${rupiah(income * 0.2)}</strong>. Rencana keluarga saat ini:
    kebutuhan ${rupiah(8700000)} (70%), keinginan ${rupiah(1000000)} (8%), tabungan ${rupiah(2500000)} (20%) —
    tabungan sudah pas 20%, keinginan ditekan agar cicilan motor lunas lebih cepat.</p>
  </section>`;
}

// ---------------- Dana darurat ----------------

export function viewEmergency(state) {
  const spent = totalSpentExcludingSavings(state);
  const monthly = Math.round(spent / 1); // pengeluaran riil bulan berjalan
  return `
  <section class="page-head">
    <h1>Kalkulator dana darurat</h1>
    <p class="lede">Dana darurat = pengeluaran bulanan × jumlah bulan yang ingin diamankan.
    Keluarga Mahendra menargetkan 6 bulan. Isi angkamu — hasilnya dihitung langsung, tanpa tombol.</p>
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Hitung targetmu</h2>
      <form id="em-form">
        <label>Pengeluaran bulanan (Rp)
          <input type="number" id="em-expense" value="${monthly}" min="0" step="100000">
        </label>
        <p class="muted">Diambil dari belanja riil November: ${rupiah(spent)} (tanpa tabungan).</p>
        <label>Berapa bulan ingin diamankan?
          <select id="em-months">
            <option value="3">3 bulan — minimal</option>
            <option value="6" selected>6 bulan — disarankan</option>
            <option value="12">12 bulan — sangat aman</option>
          </select>
        </label>
        <label>Sudah terkumpul (Rp)
          <input type="number" id="em-saved" value="21500000" min="0" step="100000">
        </label>
        <label>Bisa menabung per bulan (Rp)
          <input type="number" id="em-save" value="1000000" min="0" step="100000">
        </label>
      </form>
      <div id="em-result" class="result" aria-live="polite"></div>
    </article>
    <article class="card">
      <h2>Kenapa 6 bulan?</h2>
      <ul class="ticks">
        <li><strong>3 bulan</strong> cukup kalau pekerjaan stabil dan ada asuransi.</li>
        <li><strong>6 bulan</strong> standar keluarga dengan 2 anak dan satu cicilan berjalan.</li>
        <li><strong>12 bulan</strong> untuk penghasilan tidak tetap (freelance, dagang).</li>
      </ul>
      <h3>Aturan mainnya</h3>
      <ul class="ticks">
        <li>Simpan di rekening terpisah, mudah dicairkan (tabungan, bukan deposito).</li>
        <li>Pakai hanya untuk darurat: PHK, sakit, perbaikan mendesak.</li>
        <li>Isi lagi sampai penuh setiap kali terpakai.</li>
      </ul>
      <h3>Target keluarga lainnya</h3>
      ${state.goals.slice(1).map((g) => `
        <div class="goal-row">
          <div class="goal-head"><span>${g.label}</span><span>${rupiah(g.saved)} / ${rupiah(g.target)}</span></div>
          ${progressBar((g.saved / g.target) * 100, '#0f766e')}
        </div>`).join('')}
    </article>
  </section>`;
}

export function mountEmergency() {
  const expense = document.getElementById('em-expense');
  const months = document.getElementById('em-months');
  const saved = document.getElementById('em-saved');
  const save = document.getElementById('em-save');
  const out = document.getElementById('em-result');
  if (!expense || !out) return;
  const update = () => {
    const plan = emergencyPlan(
      Number(expense.value) || 0,
      Number(months.value) || 6,
      Number(saved.value) || 0,
      Number(save.value) || 0,
    );
    out.innerHTML = `
      <div class="result-line"><span>Target dana darurat</span><strong>${rupiah(plan.target)}</strong></div>
      <div class="result-line"><span>Sudah terkumpul (${Math.round(plan.pct)}%)</span><strong>${rupiah(Number(saved.value) || 0)}</strong></div>
      <div class="result-line"><span>Masih kurang</span><strong>${rupiah(plan.gap)}</strong></div>
      <div class="result-line"><span>Waktu sampai penuh</span><strong>${plan.gap === 0 ? 'Sudah tercapai 🎉' : plan.monthsToGo === Infinity ? 'Isi jumlah tabungan/bulan' : plan.monthsToGo + ' bulan lagi'}</strong></div>
      ${progressBar(plan.pct, '#0f766e')}`;
  };
  [expense, months, saved, save].forEach((el) => el.addEventListener('input', update));
  update();
}

// ---------------- Tagihan ----------------

export function viewBills(state) {
  const summary = billsSummary(state);
  const sorted = [...state.bills].sort((a, b) => a.dueDay - b.dueDay);
  return `
  <section class="page-head">
    <h1>Tagihan rutin</h1>
    <p class="lede">Sepuluh tagihan tetap keluarga setiap bulan, total ${rupiah(summary.total)}.
    Sudah dibayar ${rupiah(summary.paid)} — ${summary.unpaidCount} tagihan (${rupiah(summary.unpaidTotal)})
    masih menunggu. Centang saat sudah bayar.</p>
  </section>

  <section class="card">
    <table class="tx">
      <thead><tr><th>Jatuh tempo</th><th>Tagihan</th><th class="num">Jumlah</th><th>Status</th><th></th></tr></thead>
      <tbody>${sorted.map((b) => `<tr class="${b.paid ? 'paid' : 'due'}">
        <td>Setiap tanggal ${b.dueDay}</td><td>${b.label}</td>
        <td class="num">${rupiah(b.amount)}</td>
        <td>${b.paid ? '✅ Lunas' : '⏳ Belum bayar'}</td>
        <td><button class="btn small" data-bill="${b.id}">${b.paid ? 'Batalkan lunas' : 'Tandai lunas'}</button></td>
      </tr>`).join('')}</tbody>
      <tfoot><tr><td></td><td><strong>Total bulan ini</strong></td>
      <td class="num"><strong>${rupiah(summary.total)}</strong></td>
      <td colspan="2"><strong>${rupiah(summary.paid)} lunas</strong></td></tr></tfoot>
    </table>
    <p class="muted">Tagihan paling besar: cicilan motor ${rupiah(850000)} — lunas April 2027, setelah itu
    ${rupiah(850000)}/bulan bisa dialihkan ke dana pendidikan anak.</p>
  </section>`;
}

// ---------------- Tips hemat ----------------

export function viewTips(state) {
  const tips = tipsCatalog();
  const done = state.tipsDone.length;
  const savedSoFar = tips.filter((t) => state.tipsDone.includes(t.id)).reduce((s, t) => s + t.save, 0);
  const potential = potentialMonthlySaving(state);
  return `
  <section class="page-head">
    <h1>Tips hemat keluarga</h1>
    <p class="lede">Enam kebiasaan kecil dengan hitungan nyata. Sudah ${done} dari ${tips.length} dilakukan —
    hemat ${rupiah(savedSoFar)}/bulan. Potensi tambahan kalau semua dijalankan: ${rupiah(potential)}/bulan.</p>
  </section>

  <section class="tips-grid">
    ${tips.map((t) => {
      const isDone = state.tipsDone.includes(t.id);
      return `<article class="card tip ${isDone ? 'done' : ''}">
        <div class="tip-save">Hemat ${rupiah(t.save)}/bln</div>
        <h2>${t.title}</h2>
        <p>${t.detail}</p>
        <button class="btn ${isDone ? '' : 'primary'}" data-tip="${t.id}">
          ${isDone ? '✓ Sudah dilakukan' : 'Tandai sudah dilakukan'}
        </button>
      </article>`;
    }).join('')}
  </section>

  <section class="card">
    <h2>Kalau semua tips dijalankan</h2>
    <p class="big">Hemat ${rupiah(tips.reduce((s, t) => s + t.save, 0))} per bulan = ${rupiah(tips.reduce((s, t) => s + t.save, 0) * 12)} setahun.</p>
    <p>Setara satu kali liburan keluarga ke Yogyakarta (tiket + hotel + makan ± ${rupiah(6000000)}),
    atau 2,5 bulan cicilan motor. Mulai dari satu tips minggu ini — yang paling gampang: bawa bekal.</p>
  </section>`;
}
