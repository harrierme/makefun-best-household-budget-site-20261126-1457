// Dompet Keluarga — state, penyimpanan lokal, dan semua perhitungan uang.
// Satu-satunya sumber angka: data.js + perubahan pengguna (localStorage).
// Tidak ada angka yang ditulis tangan di tampilan; semua dihitung di sini.

import { BUDGET_PLAN, TRANSACTIONS, INCOME, BILLS, GOALS, TIPS, CATEGORIES } from './data.js';

const KEY = 'dompet-keluarga-v1';

export const rupiah = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, label: id, color: '#6b7280', icon: '🧾' };
}

function cloneSeed() {
  return {
    income: INCOME.map((x) => ({ ...x })),
    transactions: TRANSACTIONS.map((x) => ({ ...x })),
    budget: BUDGET_PLAN.map((x) => ({ ...x })),
    bills: BILLS.map((x) => ({ ...x })),
    goals: GOALS.map((x) => ({ ...x })),
    tipsDone: [],
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return cloneSeed();
    const parsed = JSON.parse(raw);
    const seed = cloneSeed();
    // Gabung dengan data contoh supaya field baru tetap ada.
    return {
      income: Array.isArray(parsed.income) ? parsed.income : seed.income,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : seed.transactions,
      budget: Array.isArray(parsed.budget) ? parsed.budget : seed.budget,
      bills: Array.isArray(parsed.bills) ? parsed.bills : seed.bills,
      goals: Array.isArray(parsed.goals) ? parsed.goals : seed.goals,
      tipsDone: Array.isArray(parsed.tipsDone) ? parsed.tipsDone : [],
    };
  } catch {
    return cloneSeed();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(KEY);
  return cloneSeed();
}

// ---- Perhitungan ----

export function totalIncome(state) {
  return state.income.reduce((s, x) => s + x.amount, 0);
}

export function totalSpent(state, categoryId) {
  return state.transactions
    .filter((t) => !categoryId || t.category === categoryId)
    .reduce((s, t) => s + t.amount, 0);
}

export function totalSpentExcludingSavings(state) {
  return state.transactions
    .filter((t) => t.category !== 'tabungan')
    .reduce((s, t) => s + t.amount, 0);
}

export function totalSaved(state) {
  return totalSpent(state, 'tabungan');
}

export function remainingMoney(state) {
  return totalIncome(state) - totalSpent(state);
}

export function budgetFor(state, categoryId) {
  const row = state.budget.find((b) => b.category === categoryId);
  return row ? row.amount : 0;
}

export function totalBudget(state) {
  return state.budget.reduce((s, b) => s + b.amount, 0);
}

// Realisasi per kategori, diurutkan dari yang terbesar.
export function spendingByCategory(state) {
  return CATEGORIES.map((c) => ({
    ...c,
    spent: totalSpent(state, c.id),
    budget: budgetFor(state, c.id),
  })).sort((a, b) => b.spent - a.spent);
}

// Total belanja per minggu (1–7, 8–14, 15–21, 22–akhir bulan), tanpa tabungan.
export function weeklySpending(state) {
  const weeks = [0, 0, 0, 0];
  for (const t of state.transactions) {
    if (t.category === 'tabungan') continue;
    const day = Number(t.date.slice(8, 10));
    const w = Math.min(3, Math.floor((day - 1) / 7));
    weeks[w] += t.amount;
  }
  return weeks;
}

export function billsSummary(state) {
  const total = state.bills.reduce((s, b) => s + b.amount, 0);
  const paid = state.bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  const unpaid = state.bills.filter((b) => !b.paid);
  return { total, paid, unpaidCount: unpaid.length, unpaidTotal: total - paid };
}

// Kalkulator dana darurat: target = pengeluaran bulanan × jumlah bulan.
export function emergencyPlan(monthlyExpense, months, alreadySaved, savePerMonth) {
  const target = monthlyExpense * months;
  const gap = Math.max(0, target - alreadySaved);
  const monthsToGo = savePerMonth > 0 ? Math.ceil(gap / savePerMonth) : Infinity;
  const pct = target > 0 ? Math.min(100, (alreadySaved / target) * 100) : 0;
  return { target, gap, monthsToGo, pct };
}

export function tipsCatalog() {
  return TIPS;
}

export function potentialMonthlySaving(state) {
  return TIPS.filter((t) => !state.tipsDone.includes(t.id))
    .reduce((s, t) => s + t.save, 0);
}
