// Dompet Keluarga — grafik kanvas tanpa pustaka: donat kategori & batang mingguan.
// Digambar penuh dengan Canvas 2D agar situs tetap ringan dan tanpa dependensi.

import { rupiah } from './store.js';

function setupCanvas(canvas, heightCss) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || 600;
  const height = heightCss;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

// Donat pengeluaran per kategori (tanpa kategori Tabungan, itu bukan belanja).
export function drawDonut(canvas, rows) {
  const { ctx, width, height } = setupCanvas(canvas, 220);
  const data = rows.filter((r) => r.id !== 'tabungan' && r.spent > 0);
  const total = data.reduce((s, r) => s + r.spent, 0);
  ctx.clearRect(0, 0, width, height);
  if (total === 0) {
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Belum ada pengeluaran', width / 2, height / 2);
    return;
  }
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 12;
  const inner = radius * 0.62;
  let angle = -Math.PI / 2;
  for (const row of data) {
    const sweep = (row.spent / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.fillStyle = row.color;
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + sweep);
    ctx.closePath();
    ctx.fill();
    angle += sweep;
  }
  // Lubang tengah + label total.
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#1f2937';
  ctx.font = '700 15px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Total belanja', cx, cy - 4);
  ctx.font = '700 17px Georgia, serif';
  ctx.fillText(rupiah(total), cx, cy + 18);
}

// Batang total belanja per minggu dalam sebulan.
export function drawWeeklyBars(canvas, weeks) {
  const { ctx, width, height } = setupCanvas(canvas, 200);
  ctx.clearRect(0, 0, width, height);
  const labels = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'];
  const max = Math.max(...weeks, 1);
  const padL = 8;
  const padB = 34;
  const padT = 26;
  const chartW = width - padL * 2;
  const chartH = height - padB - padT;
  const slot = chartW / weeks.length;
  const barW = Math.min(64, slot * 0.55);
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  weeks.forEach((value, i) => {
    const h = Math.max(2, (value / max) * chartH);
    const x = padL + slot * i + (slot - barW) / 2;
    const y = padT + (chartH - h);
    ctx.fillStyle = i === weeks.length - 1 ? '#d97706' : '#2d6a4f';
    ctx.beginPath();
    ctx.roundRect(x, y, barW, h, 6);
    ctx.fill();
    ctx.fillStyle = '#1f2937';
    ctx.font = '700 12px system-ui, sans-serif';
    ctx.fillText(rupiah(value), padL + slot * i + slot / 2, y - 7);
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(labels[i], padL + slot * i + slot / 2, height - 12);
  });
}

// Bilah progres horizontal (dipakai untuk anggaran & target tabungan).
export function progressBar(pct, color) {
  const safe = Math.max(0, Math.min(100, pct));
  const over = pct > 100;
  return `<div class="bar" role="img" aria-label="${Math.round(pct)} persen">
    <span style="width:${safe}%;background:${over ? '#b91c1c' : color}"></span>
  </div>`;
}
