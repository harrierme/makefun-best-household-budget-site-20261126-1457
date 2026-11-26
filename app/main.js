// Dompet Keluarga — router hash dan pengikat interaksi.
// Rute: #/ dasbor · #/transaksi · #/anggaran · #/darurat · #/tagihan · #/tips.
// Setiap perubahan data disimpan ke localStorage lewat store.js lalu halaman dirender ulang.

import { loadState, saveState, resetState, totalIncome } from './store.js';
import { BUDGET_PLAN } from './data.js';
import {
  viewDashboard, mountDashboard, viewTransactions, viewBudget,
  viewEmergency, mountEmergency, viewBills, viewTips,
} from './views.js';

const NAV = [
  { hash: '#/', label: 'Dasbor' },
  { hash: '#/transaksi', label: 'Transaksi' },
  { hash: '#/anggaran', label: 'Anggaran' },
  { hash: '#/darurat', label: 'Dana Darurat' },
  { hash: '#/tagihan', label: 'Tagihan' },
  { hash: '#/tips', label: 'Tips Hemat' },
];

let state = loadState();
let txFilter = { category: '', q: '' };

function renderNav(active) {
  const nav = document.getElementById('nav');
  nav.innerHTML = NAV.map((n) =>
    `<a href="${n.hash}" class="${n.hash === active ? 'active' : ''}" ${n.hash === active ? 'aria-current="page"' : ''}>${n.label}</a>`).join('');
}

function render() {
  const hash = location.hash || '#/';
  const [path] = hash.split('?');
  const view = document.getElementById('view');
  renderNav(path);
  window.scrollTo(0, 0);

  if (path === '#/transaksi') {
    view.innerHTML = viewTransactions(state, txFilter);
    bindTransactions(view);
  } else if (path === '#/anggaran') {
    view.innerHTML = viewBudget(state);
    bindBudget(view);
  } else if (path === '#/darurat') {
    view.innerHTML = viewEmergency(state);
    mountEmergency();
  } else if (path === '#/tagihan') {
    view.innerHTML = viewBills(state);
    bindBills(view);
  } else if (path === '#/tips') {
    view.innerHTML = viewTips(state);
    bindTips(view);
  } else {
    view.innerHTML = viewDashboard(state);
    mountDashboard(state);
  }
  // Tandai siap untuk screenshot otomatis.
  window.__shotReady = true;
}

function rerender() {
  saveState(state);
  render();
}

// ---- Transaksi: tambah, hapus, filter ----

function bindTransactions(view) {
  const form = view.querySelector('#tx-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const amount = Math.round(Number(data.get('amount')));
    if (!data.get('label') || !data.get('date') || !(amount > 0)) return;
    state.transactions.push({
      id: 'u' + Date.now().toString(36),
      date: String(data.get('date')),
      label: String(data.get('label')).trim().slice(0, 80),
      category: String(data.get('category')),
      amount,
    });
    const note = view.querySelector('#tx-note');
    if (note) note.textContent = 'Tersimpan! Dasbor dan anggaran sudah ikut berubah.';
    rerender();
  });

  const filterForm = view.querySelector('#tx-filter');
  filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(filterForm);
    txFilter = { category: String(data.get('category') || ''), q: String(data.get('q') || '').trim() };
    render();
  });

  view.querySelectorAll('[data-del]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.transactions = state.transactions.filter((t) => t.id !== btn.dataset.del);
      rerender();
    });
  });
}

// ---- Anggaran: simpan edit + preset ----

function applyPreset(kind) {
  const income = totalIncome(state);
  if (kind === '50-30-20') {
    const need = ['makanan', 'transport', 'tagihan', 'pendidikan', 'kesehatan'];
    const want = ['hiburan', 'lainnya'];
    state.budget = state.budget.map((b) => {
      if (need.includes(b.category)) return { ...b, amount: Math.round(income * 0.5 / need.length / 50000) * 50000 };
      if (want.includes(b.category)) return { ...b, amount: Math.round(income * 0.3 / want.length / 50000) * 50000 };
      return { ...b, amount: Math.round(income * 0.2 / 50000) * 50000 };
    });
  } else if (kind === 'hemat') {
    const cuts = { makanan: 3000000, transport: 800000, tagihan: 2200000, pendidikan: 1500000, kesehatan: 400000, hiburan: 300000, tabungan: 3000000, lainnya: 250000 };
    state.budget = state.budget.map((b) => ({ ...b, amount: cuts[b.category] ?? b.amount }));
  } else {
    state.budget = BUDGET_PLAN.map((b) => ({ ...b }));
  }
  rerender();
}

function bindBudget(view) {
  const form = view.querySelector('#budget-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    state.budget = state.budget.map((b) => {
      const v = Math.round(Number(data.get('budget-' + b.category)));
      return { ...b, amount: Number.isFinite(v) && v >= 0 ? v : b.amount };
    });
    const note = view.querySelector('#budget-note');
    if (note) note.textContent = 'Anggaran tersimpan.';
    rerender();
  });
  view.querySelectorAll('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
  });
}

// ---- Tagihan: tandai lunas ----

function bindBills(view) {
  view.querySelectorAll('[data-bill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.bills = state.bills.map((b) => (b.id === btn.dataset.bill ? { ...b, paid: !b.paid } : b));
      rerender();
    });
  });
}

// ---- Tips: checklist ----

function bindTips(view) {
  view.querySelectorAll('[data-tip]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.tip;
      state.tipsDone = state.tipsDone.includes(id)
        ? state.tipsDone.filter((x) => x !== id)
        : [...state.tipsDone, id];
      rerender();
    });
  });
}

// Reset data contoh (dipakai dari footer).
document.getElementById('reset-data').addEventListener('click', () => {
  state = resetState();
  txFilter = { category: '', q: '' };
  rerender();
});

window.addEventListener('hashchange', render);
render();
